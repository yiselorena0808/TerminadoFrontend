import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

const ListasActividadesLudicasEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const actividadesPorPagina = 9;

  const apiListarAct = import.meta.env.VITE_API_LISTARACTIVIDADES;
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const obtenerActividades = async () => {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token || !usuario) throw new Error("Usuario no autenticado");

      const response = await fetch(apiListarAct, {
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener actividades");
      const data = await response.json();

      const lista = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.datos)
        ? data.datos
        : Array.isArray(data)
        ? data
        : [];

      const actividadesEmpresa = lista.filter(
        (act) => act.idEmpresa === usuario.id_empresa
      );

      setActividades(actividadesEmpresa);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar actividades");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  const irCrear = () => navigate("/nav/crearActLudica");

  const actividadesFiltradas = actividades.filter(
    (act) =>
      act.nombreActividad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 Paginación
  const totalPaginas = Math.ceil(actividadesFiltradas.length / actividadesPorPagina);
  const indiceInicial = (paginaActual - 1) * actividadesPorPagina;
  const indiceFinal = indiceInicial + actividadesPorPagina;
  const actividadesPaginadas = actividadesFiltradas.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const descargarPDF = async (act: ActividadLudica) => {
    const doc = new jsPDF();
    const azul = [25, 86, 212];
    const blanco = [255, 255, 255];

    // Encabezado azul
    doc.setFillColor(...azul);
    doc.rect(0, 0, 220, 35, "F");
    doc.setTextColor(...blanco);
    doc.setFontSize(18);
    doc.text("Reporte de Actividad Lúdica", 20, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let y = 50;
    const espacio = 10;

    doc.text(`Nombre de la Actividad: ${act.nombreActividad}`, 20, y);
    y += espacio;
    doc.text(
      `Fecha de la Actividad: ${
        act.fechaActividad
          ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
          : "Sin fecha"
      }`,
      20,
      y
    );
    y += espacio;
    doc.text("Descripción:", 20, y);
    y += 8;
    doc.text(act.descripcion || "Sin descripción", 20, y, { maxWidth: 170 });
    y += 25;

    doc.text(`Nombre del Usuario: ${act.nombreUsuario}`, 20, y);
    y += espacio;
    doc.text(`ID Actividad: ${act.id}`, 20, y);
    y += espacio;
    doc.text(`ID Usuario: ${act.idUsuario}`, 20, y);
    y += espacio;
    doc.text(`ID Empresa: ${act.idEmpresa}`, 20, y);
    y += espacio;
    doc.text(`Creado en: ${new Date(act.createdAt).toLocaleString()}`, 20, y);
    y += espacio;
    doc.text(`Actualizado en: ${new Date(act.updatedAt).toLocaleString()}`, 20, y);
    y += espacio * 1.5;

    if (act.archivoAdjunto) {
      doc.text("Archivo Adjunto:", 20, y);
      y += 8;
      doc.textWithLink("Ver Archivo", 25, y, { url: act.archivoAdjunto });
      y += espacio;
    }

    if (act.imagenVideo) {
      try {
        const img = await fetch(act.imagenVideo);
        const blob = await img.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        doc.addImage(base64, "PNG", 20, y, 80, 60);
        y += 70;
      } catch {
        doc.text("No se pudo cargar la imagen.", 20, y);
      }
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sistema de Gestión SST - Actividades Lúdicas", 20, 280);
    doc.save(`actividad_${act.id}.pdf`);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaUserTie className="text-blue-700" /> 
            Actividades Lúdicas
          </h1>
          {/* CONTADOR DE ACTIVIDADES - EN EL HEADER */}
          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{actividadesFiltradas.length}</span> actividades
            </p>
          </div>
        </div>
        <button
          onClick={irCrear}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus /> Nueva Actividad
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
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
        </div>

        {/* LISTA DE ACTIVIDADES */}
        {cargando ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <p className="text-gray-500">Cargando actividades...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
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
              {actividadesPaginadas.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-500" />
                          {act.nombreActividad}
                        </h3>
                        <p className="text-gray-600 text-sm">{act.nombreUsuario}</p>
                      </div>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      {act.fechaActividad
                        ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
                        : "Sin fecha"}
                    </p>

                    {/* DESCRIPCIÓN */}
                    <p className="text-gray-700 mb-6 line-clamp-3">
                      {act.descripcion || "Sin descripción"}
                    </p>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate("/nav/detalleActLudica", { state: act })}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm flex items-center gap-2"
                      >
                        <FaEye /> Abrir
                      </button>
                      <button
                        onClick={() => descargarPDF(act)}
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

export default ListasActividadesLudicasEmpresa;