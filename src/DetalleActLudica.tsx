import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Calendar, FileText, FileVideo, File } from "lucide-react";

interface ActividadDetalle {
  id_usuario: number;
  nombre_usuario: string;
  nombre_actividad: string;
  fecha_actividad: string;
  descripcion: string;
  imagen_video: string;
  archivo_adjunto: string;
}

const DetalleActividad: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  /*const actividad: ActividadDetalle | undefined = location.state as ActividadDetalle;

if (!actividad) {
  return <p className="p-4 text-center text-white">No hay datos para mostrar.</p>;
}*/

const actividad: ActividadDetalle = {
  id_usuario: 45,
  nombre_usuario: "María Gómez",
  nombre_actividad: "Torneo de Ajedrez",
  fecha_actividad: "2025-08-14",
  descripcion: "Organización de un torneo de ajedrez para fomentar la concentración y el trabajo en equipo entre los participantes.",
  imagen_video: "https://images.unsplash.com/photo-1605902711622-cfb43c4434a1?auto=format&fit=crop&w=800&q=80",
  archivo_adjunto: "https://example.com/archivos/reglamento_ajedrez.pdf",
};

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const verArchivo = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          ← Volver
        </button>

        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="text-4xl font-bold">🎯 Detalle de Actividad</h2>
            <p className="text-blue-100 text-lg">Usuario ID #{actividad.id_usuario}</p>
          </div>

          {/* Body */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del Usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Usuario
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Nombre:</span>{" "}
                {actividad.nombre_usuario}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">ID Usuario:</span>{" "}
                {actividad.id_usuario}
              </p>
            </div>

            {/* Información de la Actividad */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles de la Actividad
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Actividad:</span>{" "}
                {actividad.nombre_actividad}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Fecha:</span>{" "}
                {formatearFecha(actividad.fecha_actividad)}
              </p>
              <p className="text-gray-700 leading-relaxed text-justify">
                {actividad.descripcion}
              </p>
            </div>

            {/* Imagen o Video */}
            {actividad.imagen_video && (
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                  Evidencia
                </h3>
                <div
                  className="relative group cursor-pointer rounded-xl overflow-hidden border shadow hover:shadow-lg transition"
                  onClick={() => verArchivo(actividad.imagen_video)}
                >
                  <img
                    src={actividad.imagen_video}
                    alt="Evidencia"
                    className="w-full max-h-[500px] object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition">
                    Click para ampliar
                  </div>
                </div>
              </div>
            )}

            {/* Archivo Adjunto */}
            {actividad.archivo_adjunto && (
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  onClick={() => verArchivo(actividad.archivo_adjunto)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-900 transition text-lg"
                >
                  <File className="w-5 h-5" /> Descargar Archivo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleActividad;
