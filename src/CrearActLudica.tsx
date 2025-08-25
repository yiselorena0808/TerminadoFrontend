import React, { useState, useEffect } from "react";

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
  const [id_usuario, setIdUsuario] = useState("");
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [nombre_actividad, setNombreActividad] = useState("");
  const [fecha_actividad, setFechaActividad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen_video, setImagenVideo] = useState("");
  const [archivo_adjunto, setArchivoAdjunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idUsuarioNum = parseInt(id_usuario);
    if (isNaN(idUsuarioNum)) {
      alert("ID Usuario debe ser un número válido.");
      return;
    }

    try {
      const response = await fetch("https://backsst.onrender.com/crearActividadLudica", {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda con imagen */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://onesoluciones.co/wp-content/uploads/2021/04/Pausas-1.jpg')",
        }}
      >
        <div className="w-full h-full bg-blue-900/40 flex items-center justify-center text-white text-4xl font-bold">
          Registro de Actividad
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-start p-10 bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900">
        <div className="w-full max-w-lg bg-blue-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Formulario de Actividad
          </h2>

          {mensaje && (
            <div className="mb-4 p-3 rounded-lg bg-blue-300 text-blue-900 text-center font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="ID Usuario"
              value={id_usuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Nombre Usuario"
              value={nombre_usuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Nombre Actividad"
              value={nombre_actividad}
              onChange={(e) => setNombreActividad(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="date"
              value={fecha_actividad}
              onChange={(e) => setFechaActividad(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            ></textarea>
            <input
              type="text"
              placeholder="Imagen o Video (URL)"
              value={imagen_video}
              onChange={(e) => setImagenVideo(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Archivo Adjunto (URL)"
              value={archivo_adjunto}
              onChange={(e) => setArchivoAdjunto(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              type="submit"
              className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Guardar Actividad
            </button>
          </form>
        </div>

        {/* Lista de actividades */}
        <div className="w-full max-w-lg mt-10 bg-blue-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-4 text-center">Actividades Registradas</h3>
          {actividades.length === 0 ? (
            <p className="text-center">No hay actividades registradas.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {actividades.map((act, idx) => (
                <li key={idx} className="p-3 bg-blue-700/50 rounded-lg">
                  <p><strong>Usuario:</strong> {act.nombre_usuario}</p>
                  <p><strong>Actividad:</strong> {act.nombre_actividad}</p>
                  <p><strong>Fecha:</strong> {act.fecha_actividad}</p>
                  <p><strong>Descripción:</strong> {act.descripcion}</p>
                  <p><strong>Imagen/Video:</strong> {act.imagen_video}</p>
                  <p><strong>Archivo:</strong> {act.archivo_adjunto}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActividadForm; 