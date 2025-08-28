import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Calendar,
  Briefcase,
  Clipboard,
  Trash2,
  Save,
} from "lucide-react";

interface GestionDetalle {
  id: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: number;
  cargo: string;
  productos: string;
  cantidad: number;
  importancia: string;
  estado: string | null;
  fechaCreacion: string;
}

const DetalleGestionEPP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gestion: GestionDetalle | undefined = location.state as GestionDetalle;

  const [estado, setEstado] = useState(gestion?.estado || "");
  const [mensaje, setMensaje] = useState("");

  const apiEliminar= import.meta.env.VITE_API_ELIMINARGESTION

  if (!gestion) {
    return (
      <p className="p-4 text-white text-center">
         No hay datos para mostrar.
      </p>
    );
  }

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const eliminarGestion = async (id:number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta gestión?")) return;
    try {
      const res = await fetch(
       apiEliminar + id ,
        { method: "DELETE" }
      );
      if (res.ok) {
        alert("Gestión eliminada");
        navigate(-1);
      } else {
        setMensaje("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
      setMensaje(" Error en el servidor");
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
            <p className="text-blue-100 text-lg">
              Usuario ID #{gestion.id_usuario}
            </p>
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

              {/* Estado editable */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">Estado:</span>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Revisado">Revisado</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>

              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  Fecha Creación:
                </span>{" "}
                {formatearFecha(gestion.fechaCreacion)}
              </p>
            </div>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className="px-10 pb-4 text-center text-green-700 font-semibold">
              {mensaje}
            </div>
          )}

          {/* Footer con acciones */}
          <div className="bg-gray-50 px-10 py-6 flex flex-wrap gap-4 justify-end border-t">

            <button
              onClick={eliminarGestion}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition text-lg"
            >
              <Trash2 className="w-5 h-5" /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleGestionEPP;
