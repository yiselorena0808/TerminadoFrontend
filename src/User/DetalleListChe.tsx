import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  placa:string;
  observaciones:string;
  comentarioAdmin?: string;
}

const MiDetalleListaChequeo: React.FC = () => {
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
    return `${hours}:${minutes}`; 
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          ← Volver
        </button>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 to-blue-600 p-6 text-white">
            <h2 className="text-3xl font-bold">Detalle Lista de Chequeo</h2>
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
              <label className="font-semibold">Placa del vehiculo</label>
              <input
                type="text"
                name="soat"
                value={form.placa}
                onChange={handleChange}
                disabled={!editando}
                className="w-full border rounded p-2"
              />
              <label className="font-semibold">Observaciones del vehiculo</label>
              <input
                type="text"
                name="soat"
                value={form.observaciones}
                onChange={handleChange}
                disabled={!editando}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiDetalleListaChequeo;
