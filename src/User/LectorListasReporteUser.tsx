import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHardHat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
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

  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 6; // 2 filas de 3 tarjetas cada una

  const estados = ["Todos", "Pendiente", "Revisado", "Finalizado"];
  const apiListarReportes = import.meta.env.VITE_API_MISREPORTES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
  }, []);

  const obtenerListas = async () => {
    if (!usuario) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("q", busqueda);
      if (estadoFiltro !== "Todos") params.append("estado", estadoFiltro);

      const res = await fetch(`${apiListarReportes}?${params.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener reportes");

      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const reportes: Reporte[] = data.data.map((r: any) => ({
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
    }
  };

  useEffect(() => {
    if (usuario) obtenerListas();
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
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("INFORME DE REPORTE SST", 20, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let y = 45;
    const margenIzq = 20;
    const agregar = (titulo: string, valor: string | number | null | undefined) => {
      doc.text(`${titulo}: ${valor ?? "-"}`, margenIzq, y);
      y += 8;
    };

    agregar("Usuario", `${reporte.nombre_usuario}`);
    agregar("Cédula", `${reporte.cedula}`);
    agregar("Cargo", `${reporte.cargo}`);
    agregar("Fecha", `${formatearFecha(reporte.fecha)}`);
    agregar("Lugar", `${reporte.lugar}`);
    agregar("Descripción", `${reporte.descripcion}`);
    agregar("Estado", `${reporte.estado}`);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sistema de Gestión SST - Generado automáticamente", 20, 280);
    doc.save(`Reporte_${reporte.nombre_usuario}_${reporte.id_reporte}.pdf`);
  };

  const reportesFiltrados = listas.filter(
    (item) =>
      (estadoFiltro === "Todos" || item.estado === estadoFiltro) &&
      `${item.nombre_usuario} ${item.cargo} ${item.fecha}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  // Paginación
  const totalPaginas = Math.ceil(reportesFiltrados.length / ITEMS_POR_PAGINA);
  const reportesPaginados = reportesFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (num: number) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaActual(num);
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
      <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">SST - Reportes de Seguridad</h2>
          <p className="text-white">Prevención, control y seguimiento de incidentes</p>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar reporte por usuario, cargo o fecha..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate("/nav/creaListRepo")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-400 transition"
          >
            + Crear Reporte
          </button>
        </div>

        {reportesPaginados.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            No hay reportes registrados
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportesPaginados.map((item) => (
              <div
                key={item.id_reporte}
                className="p-6 rounded-xl border shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    {item.nombre_usuario}
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full border ${getBadgeColor(
                        item.estado
                      )}`}
                    >
                      {item.estado}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600">{formatearFecha(item.fecha)}</p>
                </div>

                <p className="text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-yellow-600" />
                  {item.lugar}
                </p>
                <p className="text-gray-600 text-sm mb-4">{item.descripcion}</p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => abrirDetalle(item)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Abrir
                  </button>
                  <button
                    onClick={() => descargarPDF(item)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <FaFilePdf /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`px-3 py-1 rounded transition ${
                  paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectorListaReportes;
