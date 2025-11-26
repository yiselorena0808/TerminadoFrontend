import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHardHat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

interface Reporte {
  id_reporte: number;
  id_usuario: number;
  nombre_usuario: string;
  cargo: string;
  cedula: number | string;
  fecha: string | null;
  lugar: string;
  descripcion: string;
  imagen: string;
  archivos: string;
  estado: string;
  id_empresa: number;
}

const LectorListaReportes: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [cargando, setCargando] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 6;

  const estados = ["Todos", "Pendiente", "Revisado", "Finalizado"];
  const apiListarReportes = import.meta.env.VITE_API_MISREPORTES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
  }, []);

  const obtenerListas = async () => {
    if (!usuario) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuario no autenticado");
      return;
    }

    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("q", busqueda);
      if (estadoFiltro !== "Todos") params.append("estado", estadoFiltro);

      const res = await fetch(`${apiListarReportes}?${params.toString()}`, {
        method: "GET",
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Error al obtener reportes");

      const data = await res.json();
      
      // Manejar diferentes estructuras de respuesta
      const reportesData = data.data || data.datos || [];
      
      if (Array.isArray(reportesData)) {
        const reportes: Reporte[] = reportesData.map((r: any) => ({
          id_reporte: r.idReporte ?? r.id_reporte,
          id_usuario: r.idUsuario ?? r.id_usuario,
          nombre_usuario: r.nombreUsuario ?? r.nombre_usuario,
          cargo: r.cargo,
          cedula: r.cedula,
          fecha: r.fecha,
          lugar: r.lugar,
          descripcion: r.descripcion,
          imagen: r.imagen ?? "",
          archivos: r.archivos ?? "",
          estado: r.estado,
          id_empresa: r.idEmpresa ?? r.id_empresa,
        }));

        setListas(reportes);
      } else {
        setListas([]);
      }
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      setListas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      obtenerListas();
    }
  }, [usuario, busqueda, estadoFiltro]);

  const abrirDetalle = (item: Reporte) => {
    navigate("/nav/MidetalleRepo", { state: item });
  };

  const formatearFecha = (fechaIso: string | null) => {
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

  const descargarPDF = (reporte: Reporte) => {
    const doc = new jsPDF();
    
    // Header con fondo azul
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, "F");
    
    // Título
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("INFORME DE REPORTE SST", 105, 18, { align: "center" });

    // Contenido
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 30, 210, 267, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    let y = 45;
    const agregarLinea = (titulo: string, valor: string | number) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${titulo}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(valor), 60, y);
      y += 8;
    };

    agregarLinea("ID Reporte", reporte.id_reporte);
    agregarLinea("Usuario", reporte.nombre_usuario);
    agregarLinea("Cédula", reporte.cedula);
    agregarLinea("Cargo", reporte.cargo);
    agregarLinea("Fecha", formatearFecha(reporte.fecha));
    agregarLinea("Lugar", reporte.lugar);
    agregarLinea("Estado", reporte.estado);
    
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Descripción:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    const descripcionLines = doc.splitTextToSize(reporte.descripcion, 170);
    doc.text(descripcionLines, 20, y);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sistema de Gestión SST - Generado automáticamente", 20, 280);

    doc.save(`Reporte_${reporte.nombre_usuario}_${reporte.id_reporte}.pdf`);
  };

  const reportesFiltrados = listas.filter(
    (item) =>
      (estadoFiltro === "Todos" || item.estado === estadoFiltro) &&
      `${item.nombre_usuario} ${item.cargo} ${item.lugar} ${item.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  // Paginación
  const totalPaginas = Math.ceil(reportesFiltrados.length / ITEMS_POR_PAGINA);
  const indiceInicial = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const indiceFinal = indiceInicial + ITEMS_POR_PAGINA;
  const reportesPaginados = reportesFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Revisado":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Finalizado":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <FaHardHat className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SST - Reportes de Seguridad</h1>
              <p className="text-blue-100">Prevención, control y seguimiento de incidentes</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur-sm">
            <p className="text-sm font-semibold">
              Total: <span className="text-2xl">{reportesFiltrados.length}</span> reportes
            </p>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BARRA DE HERRAMIENTAS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* BUSCADOR */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar reporte por usuario, cargo o fecha..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* FILTRO POR ESTADO */}
            <div className="relative">
              <div className="relative">
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 appearance-none bg-white"
                >
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* BOTÓN NUEVO REPORTE */}
            <button
              onClick={() => navigate("/nav/creaListRepo")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaPlus className="text-sm" />
              Crear Reporte
            </button>
          </div>
        </div>

        {/* LISTA DE REPORTES */}
        {reportesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              {listas.length === 0 ? "No hay reportes registrados" : "No se encontraron reportes"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {listas.length === 0 
                ? "Comienza creando el primer reporte de incidente usando el botón 'Crear Reporte'" 
                : "Intenta ajustar los filtros o términos de búsqueda"}
            </p>
            {listas.length === 0 && (
              <button
                onClick={() => navigate("/nav/creaListRepo")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
              >
                Crear Primer Reporte
              </button>
            )}
          </div>
        ) : (
          <>
            {/* GRID DE REPORTES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportesPaginados.map((item) => (
                <div
                  key={item.id_reporte}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 hover:border-blue-200 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaUser className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                            {item.nombre_usuario}
                          </h3>
                          <p className="text-gray-600 text-sm">{item.cargo}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                          item.estado
                        )}`}
                      >
                        {item.estado}
                      </span>
                    </div>

                    {/* FECHA */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{formatearFecha(item.fecha)}</span>
                    </div>

                    {/* LUGAR */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium line-clamp-1">{item.lugar}</span>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="mb-6">
                      <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                        {item.descripcion}
                      </p>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow font-semibold text-sm flex items-center gap-2"
                      >
                        Abrir
                      </button>
                      <button
                        onClick={() => descargarPDF(item)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow flex items-center gap-2 font-semibold text-sm"
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
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, reportesFiltrados.length)} de {reportesFiltrados.length} reportes
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 1}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <FaChevronLeft className="text-sm" />
                      Anterior
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPaginas)].map((_, i) => {
                        const pagina = i + 1;
                        // Mostrar páginas cercanas a la actual
                        if (
                          pagina === 1 ||
                          pagina === totalPaginas ||
                          (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)
                        ) {
                          return (
                            <button
                              key={i}
                              onClick={() => cambiarPagina(pagina)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                                paginaActual === pagina
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {pagina}
                            </button>
                          );
                        } else if (pagina === paginaActual - 2 || pagina === paginaActual + 2) {
                          return <span key={i} className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Siguiente
                      <FaChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LectorListaReportes;