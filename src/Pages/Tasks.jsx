import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ESTADOS = ["pendiente", "en proceso", "hecha"];

function Tarea({ tarea, listeners, attributes, setNodeRef, style }) {
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        padding: 10,
        marginBottom: 8,
        border: "1px solid #ccc",
        borderRadius: 4,
        backgroundColor: "#fff",
      }}
    >
      <strong>{tarea.titulo}</strong>
      <br />
      <small>Fecha: {tarea.fecha}</small>
    </div>
  );
}

function SortableTarea({ tarea }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tarea.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Tarea
      tarea={tarea}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      style={style}
    />
  );
}

export default function GestorTareas() {
  const [tareas, setTareas] = useState([
    { id: "1", titulo: "Dar desayuno", estado: "hecho", fecha: "2025-06-10" },
    { id: "2", titulo: "Duchar", estado: "en proceso", fecha: "2025-06-12" },
    { id: "3", titulo: "Cita médica (Radiólogo) ", estado: "pendiente", fecha: "2025-06-10" },
    { id: "4", titulo: "Recoger primera orina del día", estado: "hecho", fecha: "2025-06-10" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("pendiente");
  const [nuevaFecha, setNuevaFecha] = useState("");

  const sensores = useSensors(useSensor(PointerSensor));

  function agregarTarea(e) {
    e.preventDefault();
    const nueva = {
      id: Date.now().toString(),
      titulo: nuevoTitulo,
      estado: nuevoEstado,
      fecha: nuevaFecha,
    };
    setTareas((t) => [...t, nueva]);
    setNuevoTitulo("");
    setNuevaFecha("");
    setNuevoEstado("pendiente");
    setShowForm(false);
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const tareaActiva = tareas.find((t) => t.id === active.id);
    const columnaOrigen = tareaActiva.estado;
    const columnaDestino = tareas.find((t) => t.id === over.id)?.estado;

    // Si se movió a otra columna
    if (columnaDestino && columnaOrigen !== columnaDestino) {
      setTareas((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, estado: columnaDestino } : t
        )
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestor de Tareas</h2>
      <button onClick={() => setShowForm(true)}>Añadir tarea</button>

      {showForm && (
        <form onSubmit={agregarTarea} style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Título"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            required
          />
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            required
          />
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <button type="submit">Crear</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancelar
          </button>
        </form>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {ESTADOS.map((estado) => {
            const tareasPorEstado = tareas.filter((t) => t.estado === estado);

            return (
              <div
                key={estado}
                style={{
                  width: "32%",
                  background: "#f5f5f5",
                  padding: 10,
                  borderRadius: 6,
                  minHeight: 200,
                }}
              >
                <h3 style={{ textTransform: "capitalize" }}>{estado}</h3>
                <SortableContext
                  items={tareasPorEstado.map((t) => t.id)}
                  strategy={rectSortingStrategy}
                >
                  {tareasPorEstado.map((tarea) => (
                    <SortableTarea key={tarea.id} tarea={tarea} />
                  ))}
                </SortableContext>
              </div>
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}
