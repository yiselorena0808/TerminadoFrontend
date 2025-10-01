import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface ListaChequeo {
  id: number;
  idUsuario: number;
  usuarioNombre: string;
  fecha: string;     
  hora: string;       
  modelo: string;
  marca: string;
  soat: string;
  tecnico: string;
  kilometraje: string;
}

const LectorChequeo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lista = location.state as ListaChequeo | undefined;


  const formatFechaForInput = (fecha: string) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; 
  };

  const formatHoraForInput = (fecha: string) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`; // HH:mm
  };

  const [editando] = useState(true);
  const [form, setForm] = useState<ListaChequeo | undefined>(
    lista
      ? {
          ...lista,
          fecha: formatFechaForInput(lista.fecha), 
          hora: formatHoraForInput(lista.fecha),   
        }
      : undefined
  );

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">
          No se encontró información de la lista seleccionada.
        </p>
      </div>
    );
  }

  const eliminarLista = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta lista?")) return;

    try {
      const res = await fetch(
        `https://backsst.onrender.com/eliminarListaChequeo/${form.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        alert("Lista eliminada correctamente.");
        navigate("/nav/listasChequeo", { replace: true });
      } else {
        const errorText = await res.text();
        console.error("Error backend:", errorText);
        alert("No se pudo eliminar la lista.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <h2 className="text-3xl font-bold">📋 Detalle Lista de Chequeo</h2>
          <p className="text-blue-100">Usuario: {form.usuarioNombre}</p>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="font-semibold">Usuario</label>
            <input
              type="text"
              name="usuarioNombre"
              value={form.usuarioNombre}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />

            <label className="font-semibold">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />

            <label className="font-semibold">Hora</label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />

            <label className="font-semibold">Técnico</label>
            <input
              type="text"
              name="tecnico"
              value={form.tecnico}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="space-y-3">
            <label className="font-semibold">Marca</label>
            <input
              type="text"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />

            <label className="font-semibold">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />

            <label className="font-semibold">Kilometraje</label>
            <input
              type="text"
              name="kilometraje"
              value={form.kilometraje}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />

            <label className="font-semibold">SOAT</label>
            <input
              type="text"
              name="soat"
              value={form.soat}
              onChange={handleChange}
              disabled={!editando}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex gap-4 justify-end">
          <button
            onClick={eliminarLista}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
          >
            <Trash2 className="w-5 h-5" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectorChequeo;