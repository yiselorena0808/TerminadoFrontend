import React, { useEffect, useState } from "react";
import { FaFilePdf, FaPlus, FaEye, FaSearch, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaRunning, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

interface ActividadLudica {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreActividad: string;
  fechaActividad: string | null;
  descripcion: string;
  imagenVideo: string;
  archivoAdjunto: string;
  idEmpresa: number;
  createdAt: string;
  updatedAt: string;
}

const LectorListasActividadesLudicas: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const actividadesPorPagina = 9;

  const apiListarAct = import.meta.env.VITE_API_MISACTIVIDADES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    else setError("No se encontró información del usuario.");
  }, []);

  const obtenerActividades = async (idUsuario: number) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(apiListarAct, {
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener actividades");

      const data = await response.json();

      const soloMias = Array.isArray(data.data)
        ? data.data.filter((act: ActividadLudica) => act.idUsuario === idUsuario)
        : [];

      setActividades(soloMias);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar actividades");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario?.id) obtenerActividades(usuario.id);
  }, [usuario]);

  const irCrear = () => navigate("/nav/creaActUser");

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

  const descargarPDF = (act: ActividadLudica) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte Actividad Lúdica", 20, 20);
    doc.setFontSize(12);
    doc.text(`Actividad: ${act.nombreActividad}`, 20, 40);
    doc.text(`Usuario: ${act.nombreUsuario}`, 20, 50);
    doc.text(`Fecha: ${formatearFecha(act.fechaActividad)}`, 20, 60);
    doc.text(`Descripción: ${act.descripcion || "Sin descripción"}`, 20, 80);
    doc.save(`actividad_${act.id}.pdf`);
  };

  const actividadesFiltradas = actividades.filter(
    (act) =>
      act.nombreActividad.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 PAGINACIÓN
  const totalPaginas = Math.ceil(actividadesFiltradas.length / actividadesPorPagina);
  const indiceInicial = (paginaActual - 1) * actividadesPorPagina;
  const indiceFinal = indiceInicial + actividadesPorPagina;
  const actividadesPaginadas = actividadesFiltradas.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaRunning className="text-blue-700" /> 
            Mis Actividades Lúdicas
          </h1>

          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{actividadesFiltradas.length}</span> actividades
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={irCrear}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Nueva Actividad
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar actividad..."
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
              <option>Todas las actividades</option>
            </select>
          </div>
        </div>

        {/* LISTA DE ACTIVIDADES */}
        {cargando ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-red-300" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Error al cargar</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : actividadesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {actividades.length === 0 ? "No hay actividades registradas" : "No se encontraron actividades"}
            </h3>
            <p className="text-gray-500">
              {actividades.length === 0 
                ? "Crea la primera actividad usando el botón 'Nueva Actividad'" 
                : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE ACTIVIDADES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actividadesPaginadas.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {item.nombreActividad}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          <FaUser className="inline mr-1 text-blue-500" />
                          {item.nombreUsuario}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                        Lúdica
                      </span>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      <FaCalendarAlt className="inline mr-2 text-gray-400" />
                      {formatearFecha(item.fechaActividad)}
                    </p>

                    {/* DESCRIPCIÓN */}
                    <div className="mb-6">
                      <p className="text-gray-700 line-clamp-3 leading-relaxed">
                        {item.descripcion || "Sin descripción disponible"}
                      </p>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate("/nav/MidetalleAct", { state: item })}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm flex items-center gap-2"
                      >
                        <FaEye /> Ver Detalle
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

export default LectorListasActividadesLudicas;