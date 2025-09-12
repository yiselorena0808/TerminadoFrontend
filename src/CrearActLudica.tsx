import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CrearActividadLudica: React.FC = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);
  const [form, setForm] = useState({
    nombre_actividad: "",
    fecha_actividad: "",
    descripcion: "",
    imagen_video: "",
    archivo_adjunto: "",
  });
  const [mensaje, setMensaje] = useState("");

  // Verifica que la variable de entorno esté correctamente configurada
  const apiCrearActividad = import.meta.env.VITE_API_CREARACTIVIDAD || "https://backsst.onrender.com/crearActividadLudica";

  useEffect(() => {
    const usuarioLogueado = localStorage.getItem("usuario");
    if (usuarioLogueado) {
      const parsed = JSON.parse(usuarioLogueado);
      setUsuario({ nombre: parsed.nombre });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debug
      console.log("URL:", apiCrearActividad); // Debug
      
      if (!token) {
        setMensaje("Usuario no logueado");
        return;
      }

      const response = await fetch(apiCrearActividad, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ← ESPACIO AÑADIDO después de "Bearer"
        },
        body: JSON.stringify({
          nombre_actividad: form.nombre_actividad,
          fecha_actividad: form.fecha_actividad,
          descripcion: form.descripcion,
          imagen_video: form.imagen_video,
          archivo_adjunto: form.archivo_adjunto,
        }),
      });

      console.log("Status:", response.status); // Debug
      
      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        setMensaje(data.mensaje || "Actividad creada correctamente");
        setForm({
          nombre_actividad: "",
          fecha_actividad: "",
          descripcion: "",
          imagen_video: "",
          archivo_adjunto: "",
        });
      } else {
        // Maneja específicamente el error 401
        if (response.status === 401) {
          setMensaje("Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
        } else {
          setMensaje(data.error || data.errors?.[0] || "Ocurrió un error al crear la actividad");
        }
      }
    } catch (error) {
      console.error("Error al crear actividad:", error);
      setMensaje("Ocurrió un error de conexión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-center mb-6">Crear Actividad Lúdica</h2>

        {mensaje && (
          <div className={`mb-4 p-3 rounded-lg text-center ${
            mensaje.includes("correctamente") 
              ? "bg-green-200 text-green-900" 
              : "bg-red-200 text-red-900"
          }`}>
            {mensaje}
          </div>
        )}

        {usuario && (
          <p className="mb-4 text-gray-700">
            Usuario logueado: <strong>{usuario.nombre}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre_actividad"
            placeholder="Nombre de la actividad"
            value={form.nombre_actividad}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="date"
            name="fecha_actividad"
            value={form.fecha_actividad}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="imagen_video"
            placeholder="URL imagen/video"
            value={form.imagen_video}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="archivo_adjunto"
            placeholder="URL archivo adjunto"
            value={form.archivo_adjunto}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear Actividad
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearActividadLudica;