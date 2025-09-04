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

  const apiCrearReporte = import.meta.env.VITE_API_REGISTROREPORTE;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Función para convertir archivo a base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, archivos: reader.result as string });
    };
    reader.readAsDataURL(file); // Convierte a base64
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
      setMensaje("No se pudo enviar el reporte");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('https://img.freepik.com/vector-gratis/equipo-construccion-trabajadores_24908-56103.jpg?semt=ais_hybrid&w=740&q=80')",
      }}
    >
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-white">
        <h2 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">
          Registro de Reportes
        </h2>

        {mensaje && (
          <div className="mb-4 p-3 rounded-lg bg-blue-300 text-blue-900 text-center font-medium shadow">
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
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre Usuario"
            value={form.nombre_usuario}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={form.cargo}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={form.cedula}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="lugar"
            placeholder="Lugar"
            value={form.lugar}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="imagen"
            placeholder="Imagen (URL)"
            value={form.imagen}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white placeholder-gray-200 focus:ring-2 focus:ring-blue-400"
          />

          {/* Input para seleccionar archivo desde escritorio */}
          <div>
            <label className="block mb-1 text-white font-semibold">Archivo:</label>
            <input
              type="file"
              accept="*"
              onChange={handleFileChange}
              className="w-full p-2 rounded-lg text-gray-800 bg-white border border-blue-200"
            />
            {form.archivos && (
              <p className="mt-2 text-sm text-green-300 truncate">
                Archivo cargado (base64)
              </p>
            )}
          </div>

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-200 text-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccione un estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Revisado">Revisado</option>
            <option value="Finalizado">Finalizado</option>
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Enviar Reporte
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 text-lg font-bold text-white bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportesC;
