import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHardHat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
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

const ListarReportes: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 9;

  const estados = ["Todos", "Pendiente", "Revisado", "Finalizado"];
  const apiListarReportes = import.meta.env.VITE_API_LISTARREPORTES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
  }, []);

  const obtenerListas = async () => {
    if (!usuario) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(apiListarReportes, {
        method: "GET",
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
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
      month: "short",
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

  // 🔹 PAGINACIÓN
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
        return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "Revisado":
        return "bg-blue-100 text-blue-800 border-blue-400";
      case "Finalizado":
        return "bg-green-100 text-green-800 border-green-400";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div>
      <div className="bg-blue-600 to-black text-white rounded-2xl shadow-lg p-6 mb-6 flex items-center gap-3">
        <FaHardHat className="text-3xl text-white" />
        <div>
          <h2 className="text-2xl font-bold">SST - Reportes</h2>
          <p className="text-gray-300">Control y seguimiento de incidentes</p>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg p-6 mx-auto max-w-6xl bg-white">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
          <input
            type="text"
            placeholder="Buscar reporte..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-3 py-2 border rounded-md flex-1 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate("/nav/crearReportes")}
            className="px-3 py-2 bg-blue-700 text-white rounded-md text-sm shadow hover:bg-blue-600 transition"
          >
            + Crear
          </button>
        </div>

        {reportesPaginados.length === 0 ? (
          <p className="text-center text-gray-500 mt-4 flex items-center justify-center gap-2 text-sm">
            <FaExclamationTriangle className="text-yellow-500" />
            No hay reportes registrados
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              {reportesPaginados.map((item) => (
                <div
                  key={item.id_reporte}
                  className="p-6 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
                >
                  <div className="mb-2">
                    <h4 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                      {item.nombre_usuario}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${getBadgeColor(
                          item.estado
                        )}`}
                      >
                        {item.estado}
                      </span>
                    </h4>
                    <p className="text-xs text-gray-600">
                      {formatearFecha(item.fecha)}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm mb-1 flex items-center">
                    <FaMapMarkerAlt className="text-yellow-600 mr-2" />
                    {item.lugar}
                  </p>

                  <p className="text-gray-600 text-xs mb-2">
                    {item.descripcion.length > 80
                      ? item.descripcion.substring(0, 80) + "..."
                      : item.descripcion}
                  </p>

                  <div className="flex justify-end gap-1 mt-1">
                    <button
                      onClick={() => abrirDetalle(item)}
                      className="bg-blue-700 text-white px-3 py-1 text-xs rounded hover:bg-blue-800 transition"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => descargarPDF(item)}
                      className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 flex items-center gap-1 transition"
                    >
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔹 PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => cambiarPagina(i + 1)}
                    className={`px-3 py-1 rounded ${
                      paginaActual === i + 1
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListarReportes;
