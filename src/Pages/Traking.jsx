import { useState, useEffect } from 'react';
import { fetchTrackings, createTracking, updateTracking, deleteTrackingById } from '../Services/supabaseService';
import "./Traking.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinSquint, faFaceGrin, faFaceMeh, faFaceFrown, faFaceSadCry, faFaceAngry, faFaceDizzy, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const Traking = () => {
  const [showFormTraking, setShowFormTraking] = useState(true);
  const [newTraking, setNewTraking] = useState({ fecha: "", estado_animo: "", estado_fisico: [], horas_sueno: "", presion_arterial: "", peso: "" });
  const [editingTrackingId, setEditingTrackingId] = useState(null);
  const [trackings, setTrackings] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);

  const EstadosAnimicos = [
    { nombre: "Feliz", icon: faFaceGrinSquint },
    { nombre: "Tranquilo", icon: faFaceGrin },
    { nombre: "Neutral", icon: faFaceMeh },
    { nombre: "Triste", icon: faFaceFrown },
    { nombre: "Muy triste", icon: faFaceSadCry },
    { nombre: "Enfadado", icon: faFaceAngry },
    { nombre: "Desesperado", icon: faFaceDizzy }
  ]

  const EstadosFisicos = [
    { nombre: "Excelente" },
    { nombre: "Bueno" },
    { nombre: "Regular" },
    { nombre: "Malo" },
    { nombre: "Enfermo" },
    { nombre: "Lesionado" },
    { nombre: "Con dolor" },
    { nombre: "Con fiebre" },
    { nombre: "Con tos" },
    { nombre: "Con resfriado" },
    { nombre: "Con alergia" },
    { nombre: "Con migraña" },
    { nombre: "Cansado" }
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
    <div className="body p-4">
      <div className="container-traking">
        <div className="form-container">
          <h2 className="text-2xl font-bold mb-4">Historial de Seguimiento</h2>

          {showFormTraking && (
            <form onSubmit={addTracking} className="form-container">

              <input
                type="date"
                value={newTraking.fecha}
                onChange={(e) => setNewTraking({ ...newTraking, fecha: e.target.value })}
                required
                className="date border p-2 mr-2"
              />
              <label className="block mb-1">¿Cómo se encuentra anímicamente?</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EstadosAnimicos.map((estado, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`btn-estado-animo px-3 py-1 rounded  ${newTraking.estado_animo === estado.nombre ? 'bg-transparent' : 'bg-white text-black'}`}
                    onClick={() => setNewTraking({ ...newTraking, estado_animo: estado.nombre })}
                  >
                    <FontAwesomeIcon icon={estado.icon} className={`emoji${newTraking.estado_animo === estado.nombre ? ' emoji-selected' : ''}`} />

                  </button>
                ))}
              </div>

              <label className="block mb-1">¿Cómo se encuentra físiciamente? (selecciona uno o varios):</label>
              <div className="flex flex-wrap mb-2">
                {EstadosFisicos.map((estado, index) => {
                  const selected = newTraking.estado_fisico.includes(estado.nombre);
                  return (
                    <button
                      type="button"
                      key={index}
                      className={`btn-estado-fisico px-3 py-1 rounded border ${selected ? 'btn-estado-fisico-selected' : 'bg-white text-black'}`}
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
              <div className='container-inputs'>
                <div> <label>Establecer horas de sueño:</label>
                  <input
                    type="number"
                    placeholder="Horas de sueño"
                    value={newTraking.horas_sueno}
                    onChange={(e) => setNewTraking({ ...newTraking, horas_sueno: e.target.value })}
                    required
                    className="border p-2 mr-2"
                  />
                </div>
                <div> <label>Establecer presión arterial:</label>
                  <input
                    type="text"
                    placeholder="Presión arterial"
                    value={newTraking.presion_arterial}
                    onChange={(e) => setNewTraking({ ...newTraking, presion_arterial: e.target.value })}
                    required
                    className="border p-2 mr-2"
                  />
                </div>
                <div>
                  <label>Establecer peso:</label>
                  <input
                    type="number"
                    placeholder="Peso (kg)"
                    value={newTraking.peso}
                    onChange={(e) => setNewTraking({ ...newTraking, peso: e.target.value })}
                    required
                    className="border p-2 mr-2"
                  />
                </div>
              </div>
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
                  className="button-accordion"
                  onClick={() => setOpenAccordion(openAccordion === tracking.id ? null : tracking.id)}
                >
                  <span>{tracking.fecha}</span>
                  <span>{openAccordion === tracking.id ? "▲" : "▼"}</span>
                </button>
                {openAccordion === tracking.id && (
                  <div>
                  <div className="container-card-acordion">
                    <div className='container-items-card1'>
                      <div><strong>Estado de ánimo:</strong> {tracking.estado_animo}</div>
                      <div>
                        <strong>Estado físico:</strong> {
                          Array.isArray(tracking.estado_fisico)
                            ? tracking.estado_fisico.join(', ')
                            : (tracking.estado_fisico ? tracking.estado_fisico.split(',').join(', ') : '')
                        }</div>


                      <div><strong>Horas de sueño:</strong> {tracking.horas_sueno}</div>
                    </div>
                    <div className='container-items-card2'>
                      <div><strong>Presión arterial:</strong> {tracking.presion_arterial}</div>

                      <div><strong>Peso:</strong> {tracking.peso} kg</div>
                    </div>
                  </div>
                    <div className="container-buttons">
                      <div className="card-actions">
                        <FontAwesomeIcon icon={faPen} onClick={() => editTracking(tracking)} className="action-icon" />
                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteTracking(tracking.id)} className="action-icon-trash" />
                      </div>
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