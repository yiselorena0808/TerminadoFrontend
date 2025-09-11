import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
}

const ListarReportes: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const estados = ["Todos", "Pendiente", "Revisado", "Finalizado"];
  const apiListarReportes = import.meta.env.VITE_API_LISTARREPORTES;

  const obtenerListas = async () => {
    try {
      const res = await fetch(apiListarReportes, { credentials: 'include' });
      const data = await res.json();
      if (data.datos && Array.isArray(data.datos)) {
        setListas(data.datos);
      } else {
        setListas([]);
        console.warn("No se recibieron datos válidos de la API");
      }
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      setListas([]);
    }
  };

  useEffect(() => {
    obtenerListas();
  }, []);

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
    doc.text("Reporte de Incidente", 20, 20);
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

  return (
    <div className="p-6 min-h-screen">
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-5xl">
        <h3 className="font-extrabold text-center mb-6 text-3xl text-gray-800">
          📋 Listado de Reportes
        </h3>

        <button
          onClick={() => navigate("/nav/crearReportes")}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Crear Reporte
        </button>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {reportesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No hay reportes disponibles</p>
        ) : (
          reportesFiltrados.map((item) => (
            <div
              key={item.id_reporte}
              className="flex justify-between items-center p-4 mb-3 border rounded-xl bg-gray-50"
            >
              <div>
                <p className="font-bold">
                  {item.nombre_usuario} – {formatearFecha(item.fecha)}
                </p>
                <p>
                  Cargo: {item.cargo} | Estado: {item.estado}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirDetalle(item)}
                  className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
                >
                  Abrir
                </button>
                <button
                  onClick={() => descargarPDF(item)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  <FaFilePdf />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListarReportes;
