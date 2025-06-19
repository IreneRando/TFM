import { useState, useEffect } from 'react';
import { fetchTrackings, createTracking, updateTracking, deleteTrackingById } from '../Services/supabaseService';
import "./Traking.scss"

const Traking = () => {
  const [showFormTraking, setShowFormTraking] = useState(true);
  const [newTraking, setNewTraking] = useState({ fecha: "", estado_animo: "", estado_fisico: [], horas_sueno: "", presion_arterial: "", peso: "" });
  const [editingTrackingId, setEditingTrackingId] = useState(null);
  const [trackings, setTrackings] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);

  const EstadosAnimicos = [
    { nombre: "Muy feliz", icon: "faH" },
    { nombre: "Feliz" },
    { nombre: "Tranquilo" },
    { nombre: "Neutral" },
    { nombre: "Triste" },
    { nombre: "Muy triste" },
    { nombre: "Enfadado" },
    { nombre: "Desesperado" }
  ]

  const EstadosFisicos = [
    { nombre: "Excelente", icon: "faH" },
    { nombre: "Bueno", icon: "faH" },
    { nombre: "Regular", icon: "faH" },
    { nombre: "Malo", icon: "faH" },
    { nombre: "Enfermo", icon: "faH" },
    { nombre: "Lesionado", icon: "faH" },
    { nombre: "Con dolor", icon: "faH" },
    { nombre: "Con fiebre", icon: "faH" },
    { nombre: "Con tos", icon: "faH" },
    { nombre: "Con resfriado", icon: "faH" },
    { nombre: "Con alergia", icon: "faH" },
    { nombre: "Con migraña", icon: "faH" },
    { nombre: "Cansado", icon: "faH" }
  ]

  useEffect(() => {
    const loadTrakings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const historial = await fetchTrackings(user.id);
        setTrackings(historial);
      } catch (error) {
        console.error("Error al cargar historial:", error.message);
      }
    };

    loadTrakings();
  }, [setTrackings]);
console.log(localStorage.getItem('user'));
const reloadTrackings = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;
  try {
    const historial = await fetchTrackings(user.id);
    setTrackings(historial);
  } catch (error) {
    console.error("Error al cargar historial:", error.message);
  }
};

  const addTracking = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    if (editingTrackingId !== null) {
      await updateTracking(editingTrackingId, {
        ...newTraking,
        estado_fisico: Array.isArray(newTraking.estado_fisico)
          ? newTraking.estado_fisico.join(',')
          : newTraking.estado_fisico
      });
    } else {
      const trackingToCreate = {
        ...newTraking,
        estado_fisico: Array.isArray(newTraking.estado_fisico)
          ? newTraking.estado_fisico.join(',')
          : newTraking.estado_fisico,
        usuario_id: user.id
      };
      await createTracking(trackingToCreate);
    }
    await reloadTrackings(); // Solo recarga desde la base de datos
    setShowFormTraking(true);
    setNewTraking({ fecha: "", estado_animo: "", estado_fisico: [], horas_sueno: "", presion_arterial: "", peso: "" });
    setEditingTrackingId(null);
  } catch (error) {
    console.error("Error al agregar o actualizar el historial:", error.message);
  }
};

const deleteTracking = async (id) => {
  try {
    await deleteTrackingById(id);
    await reloadTrackings(); // Solo recarga desde la base de datos
  } catch (error) {
    console.error("Error al eliminar el historial:", error.message);
  }
};

  const editTracking = (tracking) => {
    setNewTraking({
      fecha: tracking.fecha,
      estado_animo: tracking.estado_animo,
      estado_fisico: Array.isArray(tracking.estado_fisico)
        ? tracking.estado_fisico
        : (tracking.estado_fisico ? tracking.estado_fisico.split(',') : []),
      horas_sueno: tracking.horas_sueno,
      presion_arterial: tracking.presion_arterial,
      peso: tracking.peso
    });
    setEditingTrackingId(tracking.id);
    setShowFormTraking(true);
  };

  return (
    <div className="p-4">
      <div className="container-traking">
        <div className="form-container">
          <h1 className="text-2xl font-bold mb-4">Historial de Seguimiento</h1>

          {showFormTraking && (
            <form onSubmit={addTracking} className="">

              <input
                type="date"
                value={newTraking.fecha}
                onChange={(e) => setNewTraking({ ...newTraking, fecha: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <label className="block mb-1">Estado de ánimo:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EstadosAnimicos.map((estado, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`px-3 py-1 rounded border ${newTraking.estado_animo === estado.nombre ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    onClick={() => setNewTraking({ ...newTraking, estado_animo: estado.nombre })}
                  >
                    {estado.nombre}
                  </button>
                ))}
              </div>

              <label className="block mb-1">Estado físico (selecciona uno o varios):</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EstadosFisicos.map((estado, index) => {
                  const selected = newTraking.estado_fisico.includes(estado.nombre);
                  return (
                    <button
                      type="button"
                      key={index}
                      className={`px-3 py-1 rounded border ${selected ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                      onClick={() => {
                        setNewTraking({
                          ...newTraking,
                          estado_fisico: selected
                            ? newTraking.estado_fisico.filter(e => e !== estado.nombre)
                            : [...newTraking.estado_fisico, estado.nombre]
                        });
                      }}
                    >
                      {estado.nombre}
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                placeholder="Horas de sueño"
                value={newTraking.horas_sueno}
                onChange={(e) => setNewTraking({ ...newTraking, horas_sueno: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <input
                type="text"
                placeholder="Presión arterial"
                value={newTraking.presion_arterial}
                onChange={(e) => setNewTraking({ ...newTraking, presion_arterial: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <input
                type="number"
                placeholder="Peso (kg)"
                value={newTraking.peso}
                onChange={(e) => setNewTraking({ ...newTraking, peso: e.target.value })}
                required
                className="border p-2 mr-2"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                {editingTrackingId !== null ? "Actualizar" : "Guardar"}
              </button>
            </form>
          )}
        </div>
        <div className="historial-container">
          <div className="space-y-2">
            {trackings.length === 0 && <div className="text-gray-500">No hay registros.</div>}
            {trackings.map((tracking, idx) => (
              <div key={tracking.id} className="border rounded">
                <button
                  type="button"
                  className="botton-accordion"
                  onClick={() => setOpenAccordion(openAccordion === tracking.id ? null : tracking.id)}
                >
                  <span>{tracking.fecha} - {tracking.estado_animo}</span>
                  <span>{openAccordion === tracking.id ? "▲" : "▼"}</span>
                </button>
                {openAccordion === tracking.id && (
                  <div className="px-4 py-2 bg-white">
                    <div><strong>Estado físico:</strong> {
                      Array.isArray(tracking.estado_fisico)
                        ? tracking.estado_fisico.join(', ')
                        : (tracking.estado_fisico ? tracking.estado_fisico.split(',').join(', ') : '')
                    }</div>
                    <div><strong>Horas de sueño:</strong> {tracking.horas_sueno}</div>
                    <div><strong>Presión arterial:</strong> {tracking.presion_arterial}</div>
                    <div><strong>Peso:</strong> {tracking.peso} kg</div>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="bg-yellow-400 text-white px-2 py-1 rounded"
                        onClick={() => editTracking(tracking)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => deleteTracking(tracking.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};
export default Traking