import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const CrearListaChequeo: React.FC = () => {
   const navigate = useNavigate();
  const [form, setForm] = useState({
    id_usuario: "",
    usuario_nombre: "",
    fecha: "",
    hora: "",
    modelo: "",
    marca: "",
    soat: "",
    tecnico: "",
    kilometraje: "",
  });

  const apiCrearLista=import.meta.env.VITE_API_CREARCHEQUEO

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiCrearLista, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Lista de chequeo creada correctamente.");
        setForm({
          id_usuario: "",
          usuario_nombre: "",
          fecha: "",
          hora: "",
          modelo: "",
          marca: "",
          soat: "",
          tecnico: "",
          kilometraje: "",
        });
      } else {
        alert("Error al crear la lista de chequeo.");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl"
      >
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          Crear Lista de Chequeo
        </h2>
    
        {/* Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            name="id_usuario"
            value={form.id_usuario}
            onChange={handleChange}
            placeholder="ID Usuario"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="usuario_nombre"
            value={form.usuario_nombre}
            onChange={handleChange}
            placeholder="Nombre Usuario"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Vehículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            placeholder="Modelo"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            placeholder="Marca"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Soat, Técnico, Kilometraje */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="soat"
            value={form.soat}
            onChange={handleChange}
            placeholder="SOAT"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="tecnico"
            value={form.tecnico}
            onChange={handleChange}
            placeholder="Técnico"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="kilometraje"
            value={form.kilometraje}
            onChange={handleChange}
            placeholder="Kilometraje"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Guardar Lista de Chequeo
        </button>
      </form>
    </div>
  );
};

export default CrearListaChequeo;
