import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportesC: React.FC = () => {
  const [form, setForm] = useState({
    id_usuario: "",
    nombre_usuario: "",
    cargo: "",
    cedula: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    imagen: "",
    archivos: "",
    estado: "",
  });

  const [mensaje, setMensaje] = useState<string>("");
  const navigate = useNavigate();

  const apiCrearReporte= import.meta.env.VITE_API_REGISTROREPORTE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idUsuarioNum = parseInt(form.id_usuario);
    if (isNaN(idUsuarioNum)) {
      alert("ID de usuario debe ser un número válido.");
      return;
    }

    try {
      const response = await fetch(apiCrearReporte, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id_usuario: idUsuarioNum,
        }),
      });

      const data = await response.json();
      setMensaje(data.mensaje || "Reporte enviado correctamente");
    } catch (error) {
      console.error("Error al enviar:", error);
      setMensaje("No se pudo enviar el reporte.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda con imagen */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/vector-gratis/equipo-construccion-trabajadores_24908-56103.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      >
        <div className="w-full h-full bg-blue-900/40 flex items-center justify-center text-white text-4xl font-bold">
          Registro de Reportes
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900">
        <div className="w-full max-w-lg bg-blue-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            📝 Registro de Reportes
          </h2>

          {mensaje && (
            <div className="mb-4 p-3 rounded-lg bg-blue-300 text-blue-900 text-center font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              name="id_usuario"
              placeholder="ID Usuario"
              value={form.id_usuario}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="text"
              name="nombre_usuario"
              placeholder="Nombre Usuario"
              value={form.nombre_usuario}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="text"
              name="cargo"
              placeholder="Cargo"
              value={form.cargo}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="text"
              name="cedula"
              placeholder="Cédula"
              value={form.cedula}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="text"
              name="lugar"
              placeholder="Lugar"
              value={form.lugar}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="text"
              name="imagen"
              placeholder="Imagen (URL)"
              value={form.imagen}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <input
              type="text"
              name="archivos"
              placeholder="Archivos (URL)"
              value={form.archivos}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            />
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-blue-700/50 border border-blue-300 text-white"
            >
              <option value="">Seleccione un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Revisado">Revisado</option>
              <option value="Finalizado">Finalizado</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Enviar Reporte
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportesC;
