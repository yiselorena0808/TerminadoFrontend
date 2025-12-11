import React, { useEffect, useState} from "react";
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
  FaShieldAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { 
  getUsuarioFromToken, 
  type UsuarioToken,
  esUsuarioSGSST,
  getCargoUsuario,
} from "../utils/auth";

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

const ListarReportes: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  
  const [esSGSST, setEsSGSST] = useState(false);
  const [cargoUsuario, setCargoUsuario] = useState<string>("");
  

  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 9;

  const estados = ["Todos", "Pendiente", "Revisado", "Aprobado"];
  const apiListarReportes = import.meta.env.VITE_API_LISTARREPORTES;

  useEffect(() => {
    console.log("🔍 Iniciando verificación de usuario...");
    const u = getUsuarioFromToken();
    if (u) {
      setUsuario(u);
      console.log("👤 Usuario del token:", {
        nombre: u.nombre,
        apellido: u.apellido,
        id_empresa: u.id_empresa,
        cargo: u.cargo || "No especificado en token"
      });
    }
    
    const cargo = getCargoUsuario();
    setCargoUsuario(cargo || "");
    console.log("🎯 Cargo obtenido:", cargo);
    
    const esSGSSTVerificado = esUsuarioSGSST();
    console.log("✅ Es SG-SST?:", esSGSSTVerificado);
    setEsSGSST(esSGSSTVerificado);
    
    
  }, []);

  const obtenerListas = async () => {
    if (!usuario) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(apiListarReportes, {
        method: "GET",
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      const data = await res.json();

      if (data.datos && Array.isArray(data.datos)) {
        const filtrados: Reporte[] = data.datos
          .filter(
            (r: any) =>
              Number(r.idEmpresa ?? r.id_empresa) ===
              Number(usuario.id_empresa)
          )
          .map((r: any) => ({
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

        setListas(filtrados);
      } else {
        setListas([]);
      }
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      setListas([]);
    }
  };

  useEffect(() => {
    if (usuario) obtenerListas();
  }, [usuario]);

  const abrirDetalle = (item: Reporte) => {
    navigate("/nav/detalleReportes", { state: item });
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
    doc.setFontSize(18);
    doc.text("Reporte de Incidente - SST", 20, 20);
    doc.setFontSize(12);
    doc.text(`Usuario: ${reporte.nombre_usuario}`, 20, 40);
    doc.text(`Cédula: ${reporte.cedula}`, 20, 50);
    doc.text(`Cargo: ${reporte.cargo}`, 20, 60);
    doc.text(`Fecha: ${formatearFecha(reporte.fecha)}`, 20, 70);
    doc.text(`Lugar: ${reporte.lugar}`, 20, 80);
    doc.text(`Descripción: ${reporte.descripcion}`, 20, 90);
    doc.text(`Estado: ${reporte.estado}`, 20, 100);
    doc.save(`reporte_${reporte.id_reporte}.pdf`);
  };

  const reportesFiltrados = listas.filter(
    (item) =>
      (estadoFiltro === "Todos" || item.estado === estadoFiltro) &&
      `${item.nombre_usuario} ${item.cargo} ${item.fecha}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(reportesFiltrados.length / reportesPorPagina);
  const indiceInicial = (paginaActual - 1) * reportesPorPagina;
  const indiceFinal = indiceInicial + reportesPorPagina;
  const reportesPaginados = reportesFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Revisado":
        return "bg-blue-100 text-blue-800";
      case "Aprobado":
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
            <FaHardHat className="text-blue-700" /> 
            Reportes
          </h1>

          {/* 🔔 BADGE SG-SST */}
          {esSGSST && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl border-2 border-blue-300 flex items-center gap-2">
              <FaShieldAlt /> 
              <span className="font-bold">SG-SST</span>
            </div>
          )}

          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{reportesFiltrados.length}</span> reportes
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">

          {/* BOTÓN NUEVO REPORTE */}
          <button
            onClick={() => navigate("/nav/crearReportes")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Nuevo Reporte
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR Y FILTROS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar reporte..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
            
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LISTA DE REPORTES */}
        {reportesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {listas.length === 0 ? "No hay reportes registrados" : "No se encontraron reportes"}
            </h3>
            <p className="text-gray-500">
              {listas.length === 0 
                ? "Crea el primer reporte usando el botón 'Nuevo Reporte'" 
                : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE REPORTES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportesPaginados.map((item) => (
                <div
                  key={item.id_reporte}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {item.nombre_usuario}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.cargo}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                          item.estado
                        )}`}
                      >
                        {item.estado}
                      </span>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      {formatearFecha(item.fecha)}
                    </p>

                    {/* LUGAR */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="text-yellow-500" />
                      <span className="text-sm font-medium">{item.lugar}</span>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <p className="text-gray-700 mb-6 line-clamp-3">
                      {item.descripcion}
                    </p>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm"
                      >
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => descargarPDF(item)}
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

export default ListarReportes;