import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, FileText, Calendar, Briefcase, Clipboard } from "lucide-react";

interface GestionDetalle {
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: number;
  cargo: string;
  productos: string;
  cantidad: number;
  importancia: string;
  estado: string | null;
  fecha_creacion: string;
}

const DetalleGestionEPP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*const gestion: GestionDetalle | undefined = location.state as GestionDetalle;

  if (!gestion) {
    return <p className="p-4 text-white text-center">No hay datos para mostrar.</p>;
  }*/
 
 const gestion: GestionDetalle = {
  id_usuario: 123,
  nombre: "Juan",
  apellido: "Pérez",
  cedula: 1020304050,
  cargo: "Operario",
  productos: "Casco, Guantes, Chaleco",
  cantidad: 3,
  importancia: "Alta",
  estado: "Activo",
  fecha_creacion: "2025-08-14",
};


  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://ccmty.com/wp-content/uploads/2018/02/1c257c52b98d4c8b895eac8364583bc9.jpg')",
      }}
    >
      {/* Overlay oscuro */}
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
            <h2 className="text-4xl font-bold">🛡️ Detalle de Gestión EPP</h2>
            <p className="text-blue-100 text-lg">Usuario ID #{gestion.id_usuario}</p>
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
                {gestion.nombre} {gestion.apellido}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cédula:</span>{" "}
                {gestion.cedula}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cargo:</span>{" "}
                {gestion.cargo}
              </p>
            </div>

            {/* Información de la Gestión */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles de la Gestión
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <Clipboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Productos:</span>{" "}
                {gestion.productos}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Clipboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cantidad:</span>{" "}
                {gestion.cantidad}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Clipboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Importancia:</span>{" "}
                {gestion.importancia}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Clipboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Estado:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gestion.estado === "Pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : gestion.estado === "Activo"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {gestion.estado || "Sin definir"}
                </span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Fecha Creación:</span>{" "}
                {formatearFecha(gestion.fecha_creacion)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-10 py-6 flex flex-wrap gap-4 justify-end border-t">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-900 transition text-lg">
              <FileText className="w-5 h-5" /> Descargar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleGestionEPP;
