import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ActividadFormProps {
  onSubmit: (datos: {
    id_usuario: number;
    nombre_usuario: string;
    nombre_actividad: string;
    fecha_actividad: string;
    descripcion: string;
    imagen_video: string;
    archivo_adjunto: string;
  }) => void;
}

interface Actividad {
  id_usuario: number;
  nombre_usuario: string;
  nombre_actividad: string;
  fecha_actividad: string;
  descripcion: string;
  imagen_video: string;
  archivo_adjunto: string;
}

const ActividadForm: React.FC<ActividadFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();

  const [id_usuario, setIdUsuario] = useState("");
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [nombre_actividad, setNombreActividad] = useState("");
  const [fecha_actividad, setFechaActividad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen_video, setImagenVideo] = useState("");
  const [archivo_adjunto, setArchivoAdjunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const apiCrearAct = import.meta.env.VITE_API_CREARACTIVIDAD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idUsuarioNum = parseInt(id_usuario);
    if (isNaN(idUsuarioNum)) {
      alert("ID Usuario debe ser un número válido.");
      return;
    }

    try {
      const response = await fetch(apiCrearAct, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idUsuarioNum,
          nombre_usuario,
          nombre_actividad,
          fecha_actividad,
          descripcion,
          imagen_video,
          archivo_adjunto,
        }),
      });

      const msj = await response.json();
      setMensaje(msj.mensaje || "Actividad registrada exitosamente.");
      obtenerActividades();
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setMensaje("Error al conectar con el servidor.");
    }

    onSubmit({
      id_usuario: idUsuarioNum,
      nombre_usuario,
      nombre_actividad,
      fecha_actividad,
      descripcion,
      imagen_video,
      archivo_adjunto,
    });
  };

  const obtenerActividades = async () => {
    try {
      const res = await fetch("http://localhost:3333/listarActividadesLudicas");
      const data = await res.json();
      setActividades(data.datos);
    } catch (error) {
      console.error("Error al obtener actividades:", error);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(59,130,246,0.85), rgba(37,99,235,0.85)), url('https://onesoluciones.co/wp-content/uploads/2021/04/Pausas-1.jpg')",
      }}
      
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Columna izquierda */}
        <div className="md:w-1/2 p-8 bg-gradient-to-b from-blue-600 to-blue-800 text-white relative">
          {/* Botón Volver */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg shadow text-white text-sm font-medium transition"
          >
            <ArrowLeft size={18} /> Volver
          </button>

          <div className="flex flex-col justify-center h-full mt-10 md:mt-0">
            <h1 className="text-4xl font-extrabold mb-4 drop-shadow">
              Registro de Actividades
            </h1>
            <p className="text-lg opacity-90">
              Registra tus actividades de manera fácil y consulta el historial
              en cualquier momento.
            </p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="md:w-1/2 p-10 bg-gray-50 flex flex-col gap-8 overflow-y-auto max-h-screen">
          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
              📝 Nueva Actividad
            </h2>

            {mensaje && (
              <div className="mb-4 p-3 rounded-lg bg-blue-100 text-blue-800 text-center font-medium shadow">
                {mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="ID Usuario"
                value={id_usuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="Nombre Usuario"
                value={nombre_usuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="Nombre Actividad"
                value={nombre_actividad}
                onChange={(e) => setNombreActividad(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="date"
                value={fecha_actividad}
                onChange={(e) => setFechaActividad(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
              <input
                type="text"
                placeholder="Imagen o Video (URL)"
                value={imagen_video}
                onChange={(e) => setImagenVideo(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Archivo Adjunto (URL)"
                value={archivo_adjunto}
                onChange={(e) => setArchivoAdjunto(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                Guardar Actividad
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActividadForm;
