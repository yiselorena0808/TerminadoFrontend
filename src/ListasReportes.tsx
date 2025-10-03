import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaHardHat, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.datos && Array.isArray(data.datos)) {
        const filtrados: Reporte[] = data.datos
          .filter((r: any) => Number(r.idEmpresa ?? r.id_empresa) === Number(usuario.id_empresa))
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
    <div
      className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      }}
    >
      {/* Encabezado estilo SST */}
      <div className="bg-yellow-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">SST - Reportes de Seguridad</h2>
          <p className="text-yellow-200">Prevención, control y seguimiento de incidentes</p>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {/* Filtros y acción */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar reporte por usuario, cargo o fecha..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-yellow-500"
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
            onClick={() => navigate("/nav/crearReportes")}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition"
          >
            + Crear Reporte
          </button>
        </div>

        {/* Reportes */}
        {reportesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            No hay reportes registrados
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reportesFiltrados.map((item) => (
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

                {/* ✅ Descripción resumida SOLO en la lista */}
                <p className="text-gray-600 text-sm mb-4">
                  {item.descripcion.length > 100
                    ? item.descripcion.substring(0, 100) + "..."
                    : item.descripcion}
                </p>

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
      </div>
    </div>
  );
};

export default ListarReportes;
