import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Calendar,
  Briefcase,
  Clipboard,
  Building,
  Layers,
  Package,
} from "lucide-react";

interface Cargo {
  idCargo?: number;
  cargo?: string;
  idEmpresa?: number;
}

interface Empresa {
  idEmpresa?: number;
  nombre?: string;
  direccion?: string;
  nit?: string;
  alias?: string;
}

interface Area {
  idArea?: number;
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  alias?: string;
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
  area: Area;
  productos: Producto[];
  cargo: Cargo;
}

const DetalleGestionEPP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const gestion: GestionDetalle | undefined = location.state as GestionDetalle;

  if (!gestion) {
    return (
      <p className="p-4 text-white text-center">
        No hay datos para mostrar.
      </p>
    );
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

  return (
    <div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          ← Volver
        </button>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-4xl font-bold">🛡️ Detalle de Gestión EPP</h2>
            <p className="text-blue-100 text-lg">
              Usuario: {gestion.nombre} {gestion.apellido ?? ""}
            </p>
          </div>

          {/* Información general */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                👤 Información del Usuario
              </h3>

              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Nombre:</span>
                {gestion.nombre} {gestion.apellido ?? ""}
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cédula:</span>
                {gestion.cedula}
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Cargo:</span>
                {gestion.cargo?.cargo ?? "Sin cargo"}
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <Clipboard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  Importancia:
                </span>
                {gestion.importancia}
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Fecha:</span>
                {formatearFecha(
                  gestion.createdAt ||
                    gestion.fechaCreacion ||
                    gestion.updatedAt
                )}
              </p>
            </div>

            {/* Empresa y Área */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                🏢 Información Empresarial
              </h3>

              <p className="flex items-center gap-2 text-gray-700">
                <Building className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Empresa:</span>
                {gestion.empresa?.nombre ?? "Sin empresa"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Dirección:</span>{" "}
                {gestion.empresa?.direccion ?? "No registrada"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">NIT:</span>{" "}
                {gestion.empresa?.nit ?? "No registrado"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Alias:</span>{" "}
                {gestion.empresa?.alias ?? "Sin alias"}
              </p>

              <h3 className="text-lg font-bold text-gray-800 border-t pt-3">
                🧩 Área Asignada
              </h3>

              <p className="flex items-center gap-2 text-gray-700">
                <Layers className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Área:</span>
                {gestion.area?.nombre ?? "Sin área"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Código:</span>{" "}
                {gestion.area?.codigo ?? "No registrado"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Alias:</span>{" "}
                {gestion.area?.alias ?? "Sin alias"}
              </p>

              <p className="text-gray-700 italic">
                {gestion.area?.descripcion ?? "Sin descripción"}
              </p>
            </div>
          </div>

          {/* Productos */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              📦 Productos Asignados
            </h3>

            {gestion.productos?.length > 0 ? (
              <ul className="grid md:grid-cols-2 gap-4">
                {gestion.productos.map((p, index) => (
                  <li
                    key={p.idProducto || p.id || `producto-${index}`}
                    className="bg-white p-4 rounded-lg shadow-sm border"
                  >
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      {p.nombre}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {p.descripcion}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No hay productos asociados a esta gestión.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleGestionEPP;