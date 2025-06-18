import { useState, useEffect } from 'react';
import { fetchTrackings, createTracking, updateTracking, deleteTrackingById } from '../Services/supabaseService';


const Traking = () => {
  const [showFormTraking, setShowFormTraking] = useState(false);
  const [newTraking, setNewTraking] = useState({ fecha: "", estado_animo: "", estado_fisico: "", horas_sueno: "", presion_arterial: "", peso: "" });
  const [editingTrackingId, setEditingTrackingId] = useState(null);
  const [trackings, setTrackings] = useState([]);

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

  const addTracking = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      if (editingTrackingId !== null) {
        const updatedTracking = await updateTracking(editingTrackingId, newTraking);
        setTrackings((prev) =>
          prev.map((tracking) =>
            tracking.id === editingTrackingId ? updatedTracking : tracking
          )
        );
      } else {
        const trackingToCreate = {
          ...newTraking,
          usuario_id: user.id
        };
        const createdTracking = await createTracking(trackingToCreate);
        setTrackings([...trackings, createdTracking]);
      }
      setShowFormTraking(false);
      setNewTraking({ fecha: "", estado_animo: "", estado_fisico: "", horas_sueno: "", presion_arterial: "", peso: "" });
      setEditingTrackingId(null);
    } catch (error) {
      console.error("Error al agregar o actualizar el historial:", error.message);
    }
  };

  const deleteTracking = async (id) => {
    try {
      await deleteTrackingById(id);
      setTrackings(trackings.filter((tracking) => tracking.id !== id));
    } catch (error) {
      console.error("Error al eliminar el historial:", error.message);
    }
  };

  const editTracking = (tracking) => {
    setNewTraking({
      fecha: tracking.fecha,
      estado_animo: tracking.estado_animo,
      estado_fisico: tracking.estado_fisico,
      horas_sueno: tracking.horas_sueno,
      presion_arterial: tracking.presion_arterial,
      peso: tracking.peso
    });
    setEditingTrackingId(tracking.id);
    setShowFormTraking(true);
  };

  return (

};

export default Traking