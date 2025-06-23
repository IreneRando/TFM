import { useState, useContext, useEffect } from 'react';
import { fetchTask } from '../Services/supabaseService';
import { TaskContext } from '../Context/TaskContext';
import './Home.scss';
import { fetchMedications, createMedication, updateMedication, deleteMedicationById } from "../Services/supabaseService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faTablets, faSyringe, faBaby, faBottleDroplet, faSpoon, faDroplet, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
    const { tasks, setTasks, medications, setMedications } = useContext(TaskContext);
    const [showFormMed, setShowFormMed] = useState(false);
    const [newMed, setNewMed] = useState({ nombre: "", frecuencia: "", proxima_toma: "", tipo: "", observaciones: "" })
    const [editingMedicationId, setEditingMedicationId] = useState(null);

    const tiposMedicamento = [
        { nombre: "comprimido", icon: faCapsules },
        { nombre: "pastilla", icon: faTablets },
        { nombre: "gotas", icon: faDroplet },
        { nombre: "jarabe", icon: faSpoon },
        { nombre: "inyección", icon: faSyringe },
        { nombre: "crema", icon: faBottleDroplet },
        { nombre: "supositorio", icon: faBaby }
    ];


    useEffect(() => {
        const loadMedications = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                const medicamento = await fetchMedications(user.id);
                setMedications(medicamento);
            } catch (error) {
                console.error("Error al cargar medicamento:", error.message);
            }
        };

        loadMedications();
    }, [setMedications]);

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
    }, [setTasks]);


    const addMedication = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            if (editingMedicationId !== null) {
                const updatedMedication = await updateMedication(editingMedicationId, newMed)
                setMedications((prev) =>
                    prev.map((medicamento) =>
                        medicamento.id === editingMedicationId ? updatedMedication : medicamento
                    )
                )
            } else {
                const medicationsToCreate = {
                    ...newMed,
                    usuario_id: user.id

                };
                const createdMedication = await createMedication(medicationsToCreate)
                setMedications([...medications, createdMedication]);
            }
            setShowFormMed(false);
            setNewMed({ nombre: "", frecuencia: "", proxima_toma: "pendiente", tipo: "", observaciones: "" });
            setEditingMedicationId(null)
            console.log(newMed)

        } catch (error) {
            console.error('Error al guardar la tarea:', error)
        }
    }

    const editMedication = (medicamento) => {
        setNewMed({
            nombre: medicamento.nombre,
            frecuencia: medicamento.frecuencia,
            proxima_toma: medicamento.proxima_toma,
            tipo: medicamento.tipo,
            observaciones: medicamento.observaciones
        })
        setEditingMedicationId(medicamento.id)
        setShowFormMed(true)
    }

    const deleteMedication = async (id) => {
        try {
            await deleteMedicationById(id)
            setMedications((prev) => prev.filter((medicamento) => medicamento.id !== id))
        } catch (error) {
            console.error('Error al eliminar medicamento:', error)
        }
    }
    console.log(tasks);
    const tareasResumen = tasks.filter(task =>
        task.estado === "pendiente" || task.estado === "en proceso"
    )


    return (
        <div className="body p-4">
            <section className="medication-section">
                <h2>Medicación</h2>
                <button onClick={() => setShowFormMed(true)} className="button2">+ Añadir</button>

                {showFormMed && (
                    <form onSubmit={addMedication} className="container-form2">
                        <h3>Nuevo medicamento</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            required
                            value={newMed.nombre}
                            onChange={(e) => setNewMed({ ...newMed, nombre: e.target.value })}
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Frecuencia"
                            required
                            value={newMed.frecuencia}
                            onChange={(e) => setNewMed({ ...newMed, frecuencia: e.target.value })}
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Proxima Toma"
                            required
                            value={newMed.proxima_toma}
                            onChange={(e) => setNewMed({ ...newMed, proxima_toma: e.target.value })}
                            className="input"
                        />
                        <div >
                            <label className='mb-3'>Tipo:</label>
                            <div style={{ display: "flex", gap: "30px" }}>
                                {tiposMedicamento.map(tipo => (
                                    <label key={tipo.nombre} style={{ display: "flex", gap: "10px" }}>
                                        <input
                                            type="radio"
                                            name="tipo"
                                            value={tipo.nombre}
                                            checked={newMed.tipo === tipo.nombre}
                                            onChange={(e) => setNewMed({ ...newMed, tipo: e.target.value })} />
                                        <FontAwesomeIcon icon={tipo.icon} size='xl' />
                                    </label>
                                ))}
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Observaciones"
                            value={newMed.observaciones}
                            onChange={(e) => setNewMed({ ...newMed, observaciones: e.target.value })}
                            className="input"
                        />
                        <div className="container-buttons">
                            <button type="button" onClick={() => setShowFormMed(false)} className="button2">Cancelar</button>
                            <button type="submit" className="button2">Guardar</button>
                        </div>
                    </form>
                )}

                <div className="med-cards">
                    {medications.map(med => {
                        const tipoMed = tiposMedicamento.find(t => t.nombre.toLowerCase() === med.tipo);
                        return (
                            <div key={med.id} className="med-card">
                                <h4>{med.nombre}</h4>
                                <p>Frecuencia: {med.frecuencia}</p>
                                <p>Próxima Toma: {med.proxima_toma}</p>
                                <p>
                                    Tipo: {tipoMed && <FontAwesomeIcon icon={tipoMed.icon} size='xl' />}
                                </p>
                                <p>Observaciones: {med.observaciones}</p>
                                <div className="container-buttons">
                                    <div className="card-actions">
                                        <FontAwesomeIcon icon={faPen} onClick={() => editMedication(med)} className="action-icon" />
                                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteMedication(med.id)} className="action-icon-trash" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </section>

            <section className="task-summary-section">
                <h2>Resumen de Tareas</h2>
                {tareasResumen.length === 0 ? (
                    <p>No hay tareas pendientes ni en proceso.</p>
                ) : (
                    <div className="task-summary-list">
                        {tareasResumen.map(task => (
                            <div key={task.id} className="task-summary-card">
                                <h4>{task.titulo}</h4>
                                <p>Fecha: {task.fecha}</p>
                                <p>Estado: {task.estado}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
export default Home