import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, FileText, Calendar, Briefcase, Clipboard, Save } from "lucide-react";

interface GestionDetalle {
  id: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  cedula: number;
  cargo: string;
  productos: string;
  cantidad: number;
  importancia: string;
  estado: string | null;
  fechaCreacion: string;
  observacion?: string;
}

const DetalleGestionEPP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gestion: GestionDetalle | undefined = location.state as GestionDetalle;

  const [estado, setEstado] = useState(gestion?.estado || "");
  const [observacion, setObservacion] = useState(gestion?.observacion || "");
  const [mensaje, setMensaje] = useState("");

  if (!gestion) {
    return <p className="p-4 text-white text-center">No hay datos para mostrar.</p>;
  }

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleGuardar = async () => {
    try {
      const apiUpdate = import.meta.env.VITE_API_ACTUALIZARGESTION;
      
      const response = await fetch(`${apiUpdate}/${gestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, observacion }),
      });
      const data = await response.json();
      setMensaje(data.mensaje || "Gestión actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("Error al actualizar la gestión");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://ccmty.com/wp-content/uploads/2018/02/1c257c52b98d4c8b895eac8364583bc9.jpg')",
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
            <h2 className="text-4xl font-bold">🛡️ Detalle de Gestión EPP</h2>
            <p className="text-blue-100 text-lg">
              Usuario: {gestion.nombre} {gestion.apellido}
            </p>
          </div>

          {/* Body - Datos enviados por usuario */}
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
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles de la Gestión (Enviado por usuario)
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
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  Fecha Creación:
                </span>{" "}
                {formatearFecha(gestion.fechaCreacion)}
              </p>
            </div>
          </div>

          {/* Panel de Administración */}
          <div className="border-t border-gray-300 p-8 bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ⚙️ Panel de Administración
            </h3>

            <div className="mb-4">
              <label className="block font-semibold text-gray-900 mb-2">
                Estado de la Gestión:
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="px-3 py-2 border rounded-lg w-full max-w-xs"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Revisado">Revisado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-900 mb-2">
                Observación del Administrador:
              </label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                rows={4}
                placeholder="Escribe una observación sobre esta gestión..."
                className="w-full p-3 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGuardar}
                className="flex items-center gap-2 px-6 py-3 text-white font-bold bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                <Save className="w-5 h-5" /> Guardar Cambios
              </button>
            </div>

            {mensaje && (
              <div className="mt-4 text-center text-green-700 font-semibold">
                {mensaje}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleGestionEPP;
