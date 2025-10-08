import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Calendar,
  Briefcase,
  Clipboard,
  Save,
  Building,
  Layers,
  Package,
} from "lucide-react";

interface Empresa {
  nombre: string;
  direccion: string;
  nit: string;
  alias: string;
}

interface Area {
  nombre: string;
  codigo: string;
  descripcion: string;
  alias: string;
}

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
}

interface GestionDetalle {
  id: number;
  idUsuario: number;
  nombre: string;
  apellido: string | null;
  cedula: string;
  cantidad: number;
  importancia: string;
  estado: boolean;
  idCargo: number;
  idEmpresa: number;
  idArea: number;
  fechaCreacion: string | null;
  createdAt: string;
  updatedAt: string;
  empresa: Empresa;
  productos: Producto[];
  area: Area;
}

const DetalleGestionEPPUser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gestion: GestionDetalle | undefined = location.state as GestionDetalle;

  const [estado, setEstado] = useState(gestion?.estado ? "Activo" : "Inactivo");
  const [observacion, setObservacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!gestion) {
    return <p className="p-4 text-white text-center">No hay datos para mostrar.</p>;
  }

  const formatearFecha = (fecha: string | null | undefined) => {
    if (!fecha) return "Sin fecha registrada";
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return "Sin fecha registrada";
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              Usuario: {gestion.nombre} {gestion.apellido ?? ""}
            </p>
          </div>

          {/* Información general */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del Usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                👤 Información del Usuario
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Nombre:</span>{" "}
                {gestion.nombre} {gestion.apellido ?? ""}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cédula:</span>{" "}
                {gestion.cedula}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cargo ID:</span>{" "}
                {gestion.idCargo}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Clipboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Importancia:</span>{" "}
                {gestion.importancia}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Fecha:</span>{" "}
                {formatearFecha(gestion.createdAt || gestion.fechaCreacion || gestion.updatedAt)}
              </p>
            </div>

            {/* Información de la Empresa y Área */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                🏢 Información Empresarial
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <Building className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Empresa:</span>{" "}
                {gestion.empresa?.nombre}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Dirección:</span>{" "}
                {gestion.empresa?.direccion}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">NIT:</span>{" "}
                {gestion.empresa?.nit}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Alias:</span>{" "}
                {gestion.empresa?.alias}
              </p>

              <h3 className="text-lg font-bold text-gray-800 border-t pt-3">
                🧩 Área Asignada
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <Layers className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Área:</span>{" "}
                {gestion.area?.nombre}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Código:</span>{" "}
                {gestion.area?.codigo}
              </p>
              <p className="text-gray-700 italic">{gestion.area?.descripcion}</p>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              📦 Productos Asignados
            </h3>
            {gestion.productos && gestion.productos.length > 0 ? (
              <ul className="grid md:grid-cols-2 gap-4">
                {gestion.productos.map((p) => (
                  <li
                    key={p.idProducto}
                    className="bg-white p-4 rounded-lg shadow-sm border"
                  >
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      {p.nombre}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">{p.descripcion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No hay productos asociados a esta gestión.
              </p>
            )}
          </div>

          {/* Panel de Administración */}
          <div className="border-t border-gray-300 p-8 bg-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ⚙️ Panel de Administración
            </h3>

            <div className="mb-4">
              <label className="block font-semibold text-gray-900 mb-2">
                Estado:
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="px-3 py-2 border rounded-lg w-full max-w-xs"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-900 mb-2">
                Observación:
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

export default DetalleGestionEPPUser;
