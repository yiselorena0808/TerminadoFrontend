import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Reporte {
  id_reporte: number;
  id_usuario: number;
  nombreUsuario: string;
  cargo: string;
  cedula: number;
  fecha: string;
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
      const res = await fetch(apiListarReportes);
      const data = await res.json();
      setListas(data.datos);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  useEffect(() => {
    obtenerListas();
  }, []);

  const abrirDetalle = (item: Reporte) => {
    navigate("/nav/detalleReportes", { state: item });
  };

  const formatearFecha = (fechaIso: string): string => {
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
    doc.text(`Usuario: ${reporte.nombreUsuario}`, 20, 40);
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
      `${item.nombreUsuario} ${item.cargo} ${item.fecha}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-cover bg-center"
    style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      }}>
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 mx-auto max-w-5xl">
        <h3 className="font-extrabold text-center mb-6 text-3xl text-gray-800">
          📋 Listado de Reportes
        </h3>

        <button
          onClick={() => navigate("/nav/crearReportes")}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Crear Reporte
        </button>

        {/* Barra de búsqueda + filtro */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Buscar */}
          <div className="flex w-full md:w-96 shadow-md rounded-lg overflow-hidden border border-gray-300">
            <input
              type="text"
              className="flex-1 px-5 py-2 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="bg-gray-100 flex items-center justify-center px-4 border-l border-gray-300 text-gray-600">
              🔍
            </span>
          </div>

          {/* Filtro por estado */}
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow bg-white text-gray-700"
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Listado */}
        {reportesFiltrados.length === 0 ? (
          <p className="text-gray-600 italic text-center">
            No hay reportes disponibles.
          </p>
        ) : (
          reportesFiltrados.map((item) => (
            <div
              key={item.id_reporte}
              className="flex justify-between items-center p-4 my-3 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
              <div>
                <div className="font-bold text-gray-800">
                  {item.nombreUsuario} – {formatearFecha(item.fecha)}
                </div>
                <div className="text-gray-600 text-sm">
                  Cargo: {item.cargo} | Estado:{" "}
                  <span className="font-semibold text-indigo-600">
                    {item.estado}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => abrirDetalle(item)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl shadow-lg transition"
                >
                  Abrir
                </button>

                {/* Descargar PDF */}
                <button
                  onClick={() => descargarPDF(item)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition"
                  title="Descargar PDF"
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
