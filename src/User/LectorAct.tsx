import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  FileText,
  Image as ImageIcon,
  FileDown,
  Trash2,
  Save,
  Activity,
} from "lucide-react";

interface ActividadLudica {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreActividad: string;
  fechaActividad: string;
  descripcion: string;
  imagenVideo: string;
  archivoAdjunto: string;
}

const LectorAct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const actividad = location.state as ActividadLudica | undefined;

  const [descripcion, setDescripcion] = useState(actividad?.descripcion || "");
  const [mensaje, setMensaje] = useState("");

  if (!actividad) {
    return <p className="p-6 text-center text-white">No hay datos.</p>;
  }

  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);
    return isNaN(d.getTime())
      ? fecha || "Sin fecha"
      : d.toLocaleDateString("es-CO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const eliminarActividad = async () => {
    if (!window.confirm("¿Eliminar esta actividad lúdica?")) return;
    try {
      const res = await fetch(
        `https://backsst.onrender.com/eliminarActividadLudica/${actividad.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        alert("Actividad eliminada");
        navigate(-1);
      } else {
        setMensaje("Error al eliminar");
      }
    } catch (error) {
      setMensaje(" Error en el servidor");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://onesoluciones.co/wp-content/uploads/2021/04/Pausas-1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white/90 text-gray-800 rounded-lg shadow hover:bg-white"
        >
          ← Volver
        </button>

        {/* Card principal */}
        <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden border">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-8 text-white">
            <h2 className="text-3xl font-bold">
              🎨 {actividad.nombreActividad}
            </h2>
            <p className="text-pink-100">{actividad.nombreUsuario}</p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-5">
            {/* Usuario */}
            <p className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Usuario:</span>{" "}
              {actividad.nombreUsuario} (ID: {actividad.idUsuario})
            </p>

            {/* Nombre actividad */}
            <p className="flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Actividad:</span>{" "}
              {actividad.nombreActividad}
            </p>

            {/* Fecha */}
            <p className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Fecha:</span>{" "}
              {formatearFecha(actividad.fechaActividad)}
            </p>

            {/* Editable descripción */}
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-pink-600" />
                <span className="font-semibold">Descripción:</span>
              </p>
              <textarea
                className="w-full border rounded-lg p-3"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* Imagen / Video */}
            {actividad.imagenVideo && (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-600" />
                <a
                  href={actividad.imagenVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver Imagen/Video
                </a>
              </div>
            )}

            {/* Archivo */}
            {actividad.archivoAdjunto && (
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-pink-600" />
                <a
                  href={actividad.archivoAdjunto}
                  download
                  className="text-green-600 underline"
                >
                  Descargar archivo
                </a>
              </div>
            )}
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className="px-8 pb-4 text-center text-green-700 font-semibold">
              {mensaje}
            </div>
          )}

          {/* Footer acciones */}
          <div className="bg-gray-50 px-8 py-5 flex justify-end gap-4 border-t">
            <button
              onClick={eliminarActividad}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-5 h-5" /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectorAct;
