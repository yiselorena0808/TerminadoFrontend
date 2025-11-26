import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilePdf,
  FaHardHat,
  FaExclamationTriangle,
  FaPlus,
  FaFolderOpen,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaCalendarAlt,
  FaShieldAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import jsPDF from "jspdf";

interface Empresa {
  nombre?: string;
  direccion?: string;
  nit?: string;
}

interface Area {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
}

interface Gestion {
  id: number;
  idUsuario: number;
  nombre: string;
  apellido: string | null;
  cedula: string;
  cantidad: number;
  importancia: string;
  estado: boolean;
  idCargo?: number;
  idEmpresa?: number;
  idArea?: number;
  empresa?: Empresa;
  area?: Area;
  fechaCreacion: string;
  createdAt: string;
}

const LectorMisGestiones: React.FC = () => {
  const navigate = useNavigate();
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const gestionesPorPagina = 9;

  const apiListarMisGestiones = import.meta.env.VITE_API_MISGESTIONES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    obtenerGestiones();
  }, []);

  const obtenerGestiones = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarMisGestiones, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      const data = await res.json();
      setGestiones(data && Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error al obtener gestiones:", error);
      setGestiones([]);
    }
  };

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generarPDF = (item: Gestion) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Gestión EPP - Reporte", 20, 20);
    doc.setFontSize(12);
    doc.text(`Usuario: ${item.nombre} ${item.apellido || ""}`, 20, 40);
    doc.text(`Cédula: ${item.cedula}`, 20, 50);
    doc.text(`Importancia: ${item.importancia}`, 20, 60);
    doc.text(`Cantidad: ${item.cantidad}`, 20, 70);
    doc.text(`Estado: ${item.estado ? "Activo" : "Inactivo"}`, 20, 80);
    doc.text(`Fecha: ${formatearFecha(item.createdAt)}`, 20, 90);
    doc.text(`Empresa: ${item.empresa?.nombre || "No especificada"}`, 20, 100);
    doc.save(`gestion_epp_${item.id}.pdf`);
  };

  const gestionesFiltradas = gestiones.filter((item) =>
    `${item.nombre} ${item.cedula} ${item.importancia} ${item.empresa?.nombre}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // 🔹 PAGINACIÓN
  const totalPaginas = Math.ceil(gestionesFiltradas.length / gestionesPorPagina);
  const indiceInicial = (paginaActual - 1) * gestionesPorPagina;
  const indiceFinal = indiceInicial + gestionesPorPagina;
  const gestionesPaginadas = gestionesFiltradas.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const getBadgeColor = (importancia: string) => {
    switch (importancia.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaShieldAlt className="text-blue-700" /> 
            Mis Gestiones EPP
          </h1>

          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{gestionesFiltradas.length}</span> gestiones
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/nav/CreargestioneppUser")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Nueva Gestión
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR Y FILTROS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar gestión EPP..."
                  className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
              </div>
            </div>
            
            <select
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              disabled
            >
              <option>Todas las gestiones</option>
            </select>
          </div>
        </div>

        {/* LISTA DE GESTIONES */}
        {gestionesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {gestiones.length === 0 ? "No hay gestiones registradas" : "No se encontraron gestiones"}
            </h3>
            <p className="text-gray-500">
              {gestiones.length === 0 
                ? "Crea la primera gestión usando el botón 'Nueva Gestión'" 
                : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE GESTIONES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gestionesPaginadas.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {item.nombre} {item.apellido || ""}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          <FaUser className="inline mr-1 text-blue-500" />
                          {item.cedula}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                          item.importancia
                        )}`}
                      >
                        {item.importancia}
                      </span>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      <FaCalendarAlt className="inline mr-2 text-gray-400" />
                      {formatearFecha(item.createdAt)}
                    </p>

                    {/* INFORMACIÓN ADICIONAL */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span className="text-sm">Cantidad:</span>
                        <span className="font-semibold">{item.cantidad}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="text-sm">Estado:</span>
                        <span className={`font-semibold ${item.estado ? "text-green-600" : "text-red-600"}`}>
                          {item.estado ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="text-sm">Empresa:</span>
                        <span className="font-semibold text-sm">{item.empresa?.nombre || "N/A"}</span>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate("/nav/Migestionepp", { state: item })}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm flex items-center gap-2"
                      >
                        <FaFolderOpen /> Ver Detalle
                      </button>
                      <button
                        onClick={() => generarPDF(item)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg flex items-center gap-2 font-semibold text-sm"
                      >
                        <FaFilePdf /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {[...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => cambiarPagina(i + 1)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        paginaActual === i + 1
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LectorMisGestiones;