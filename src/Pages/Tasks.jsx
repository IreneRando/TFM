import { useState, useContext, useEffect } from "react";
import "./Tasks.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCircleCheck, faPaste, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { TaskContext } from '../Context/TaskContext';
import { fetchTask, createTask, updateTask, deleteTaskById } from "../Services/supabaseService";

const estados = [
  { nombre: "pendiente", icono: faPaste },
  { nombre: "en proceso", icono: faClock },
  { nombre: "hecha", icono: faCircleCheck },
];

const TaskBoard = () => {
  const { tasks, setTasks } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ titulo: "", fecha: "", estado: "pendiente" });
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const tareas = await fetchTask(user.id);
        setTasks(tareas);
      } catch (error) {
        console.error("Error al cargar tareas:", error.message);
      }
    };

    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      if (editingTaskId !== null) {
        const updatedTask = await updateTask(editingTaskId, newTask)
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId ? updatedTask : task
          )
        )
      } else {
        const taskToCreate = {
          titulo: newTask.titulo,
          fecha: newTask.fecha,
          estado: newTask.estado.toLowerCase(),
          asignado_a: user.id

        };
        const createdTask = await createTask(taskToCreate)
        setTasks([...tasks, createdTask]);
      }
      setShowForm(false);
      setNewTask({ titulo: "", fecha: "", estado: "pendiente" });
      setEditingTaskId(null)
      console.log(newTask)

    } catch (error) {
      console.error('Error al guardar la tarea:', error)
    }
  }
  const editTask = (task) => {
    setNewTask({ titulo: task.titulo, fecha: task.fecha, estado: task.estado })
    setEditingTaskId(task.id)
    setShowForm(true)
  }

  const deleteTask = async (id) => {
    try {
      await deleteTaskById(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }

  const moveTask = async (id, direction) => {
    const taskToUpdate = tasks.find(task => task.id === id)
    if (!taskToUpdate) return
    const currentIndex = estados.findIndex(e => e.nombre === taskToUpdate.estado);
    const newIndex = currentIndex + direction;

    if (newIndex < 0 || newIndex >= estados.length) return

    const nuevoEstado = estados[newIndex].nombre.toLowerCase()

    try {
      await updateTask(id, { estado: nuevoEstado })
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, estado: nuevoEstado } : task
        )
      );
    } catch (error) {
      console.error('Error al mover la tarea:', error.message);
      alert('No se pudo mover la tarea.');
    }

  }

  return (
    <div className="body p-4">
      <h2 className="mb-4">Gestor de Tareas</h2>
      <button onClick={() => setShowForm(true)} className="button2">
        + Tarea
      </button>

      {showForm && (
        <form onSubmit={addTask} className="container-form2">
          <h3 className="mb-2">Nueva Tarea</h3>
          <input
            type="text"
            required
            placeholder="Título"
            value={newTask.titulo}
            onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
            className="block border p-2 mb-2 w-full"
          />
          <div style={{ display: 'flex', gap: '20px' }}>
            <input
              type="date"
              required
              value={newTask.fecha}
              onChange={(e) => setNewTask({ ...newTask, fecha: e.target.value })}
              className="block border p-2 mb-2 w-full"
            />
            <select
              value={newTask.estado}
              onChange={(e) => setNewTask({ ...newTask, estado: e.target.value })}
              className="block border p-2 mb-2 w-full"
              style={{ width: '170px' }}
            >
              {estados.map(({ nombre }) => (
                <option key={nombre} value={nombre.toLowerCase()}>
                  {nombre.charAt(0).toLowerCase() + nombre.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="container-buttons">
            <button type="button" onClick={() => setShowForm(false)} className="button2">Cancelar</button>
            <button type="submit" className="button2">Guardar</button>
          </div>
        </form>
      )}

      <div className="container-columns">
        {estados.map(({ nombre, icono }) => {
          const tareasEnColumna = tasks.filter((task) => task.estado === nombre);

          return (
            <div key={nombre} className="column">
              <div className="header-column">
                <FontAwesomeIcon icon={icono} className="estado-icon" />
                <h2 className="tittle-estado">{nombre}</h2>
                <p className="task-count">{tareasEnColumna.length}</p>
              </div>
              {tareasEnColumna.map((task) => (
                <div key={task.id} className="container-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="tittle">{task.titulo}</div>
                    <div className="fecha">{task.fecha}</div>
                  </div>
                  <div className="container-buttons">
                    <div className="card-actions">
                      <FontAwesomeIcon icon={faPen} onClick={() => editTask(task)} className="action-icon" />
                      <FontAwesomeIcon icon={faTrash} onClick={() => deleteTask(task.id)} className="action-icon-trash" />
                    </div>
                    <div className="container-arrows">
                      <button
                        disabled={estados.findIndex(e => e.nombre === task.estado) === 0}
                        onClick={() => moveTask(task.id, -1)}
                        className="button2"
                      >
                        ←
                      </button>
                      <button
                        disabled={estados.findIndex(e => e.nombre === task.estado) === estados.length - 1}
                        onClick={() => moveTask(task.id, 1)}
                        className="button2"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
