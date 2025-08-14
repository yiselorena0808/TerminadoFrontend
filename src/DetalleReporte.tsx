import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  User,
  Briefcase,
  IdCard,
  Calendar,
  MapPin,
  FileCheck,
} from "lucide-react";

interface Reporte {
  id_reporte: number;
  nombre_usuario: string;
  cargo_usuario: string;
  cedula: number;
  fecha: string;
  lugar: string;
  descripcion: string;
  img: string;
  archivos: string;
  estado: string;
}

const DetalleReporte: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

/* const reporte: Reporte | undefined = location.state as Reporte;

  if (!reporte) {
    return <p className="p-4">No hay datos para mostrar.</p>;
  }*/

    const reporte: Reporte = {
  id_reporte: 501,
  nombre_usuario: "Ana Morales",
  cargo_usuario: "Supervisora",
  cedula: 1098765432,
  fecha: "2025-08-14T10:45:00",
  lugar: "Planta Industrial Bogotá",
  descripcion: "Se detectó una falla en la máquina de embalaje que requiere mantenimiento urgente.",
  img: "https://www.suseso.cl/606/articles-18649_imagen_portada.thumb_iSlider.jpg",
  archivos: "https://www.suseso.cl/606/articles-18649_imagen_portada.thumb_iSlider.jpg",
  estado: "Pendiente",
};

  const formatearFecha = (fechaIso: string) =>
    new Date(fechaIso).toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const verImagen = () => {
    const imgUrl = `http://localhost:3333/img/${reporte.img}`;
    window.open(imgUrl, "_blank");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="text-4xl font-bold">📋 Detalle del Reporte</h2>
            <p className="text-blue-100 text-lg">ID #{reporte.id_reporte}</p>
          </div>

          {/* Body */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Usuario
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Usuario:</span>{" "}
                {reporte.nombre_usuario}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cargo:</span>{" "}
                {reporte.cargo_usuario}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <IdCard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cédula:</span>{" "}
                {reporte.cedula}
              </p>
            </div>

            {/* Información del reporte */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles del Reporte
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Fecha:</span>{" "}
                {formatearFecha(reporte.fecha)}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Lugar:</span>{" "}
                {reporte.lugar}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Estado:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reporte.estado === "Pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : reporte.estado === "Aprobado"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {reporte.estado}
                </span>
              </p>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                {reporte.descripcion}
              </p>
            </div>

            {/* Imagen */}
            {reporte.img && (
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                  Evidencia
                </h3>
                <div
                  className="relative group cursor-pointer rounded-xl overflow-hidden border shadow hover:shadow-lg transition"
                  onClick={verImagen}
                >
                  <img
                    src={`http://localhost:3333/img/${reporte.img}`}
                    alt="Evidencia"
                    className="w-full max-h-[500px] object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition">
                    Click para ampliar
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          <div className="bg-gray-50 px-10 py-6 flex flex-wrap gap-4 justify-end border-t">
            <button
              onClick={verImagen}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-lg"
            >
              <ImageIcon className="w-5 h-5" /> Ver Imagen
            </button>

            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-900 transition text-lg">
              <FileText className="w-5 h-5" /> Descargar Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleReporte;
