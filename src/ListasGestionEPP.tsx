import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Gestion {
  id: number;
  nombre: string;
  apellido: string;
  cedula: number;
  cargo: string;
  productos: string;
  cantidad: number;
  importancia: string;
  fecha_creacion: string;
  estado: string;
  id_empresa: number; // <-- para filtrar
}

interface Props {
  idEmpresa: number; // ID de empresa para filtrar
}

const ListarGestiones: React.FC<Props> = ({ idEmpresa }) => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Gestion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const estados = ["Todos", "Pendiente", "Revisado", "Finalizado"];
  const apiListarGestiones = import.meta.env.VITE_API_LISTARGESTIONES;

  const obtenerListas = async () => {
    try {
      const res = await fetch(apiListarGestiones);
      const data = await res.json();
      if (data.datos && Array.isArray(data.datos)) {
        setListas(data.datos);
      } else {
        setListas([]);
      }
    } catch (error) {
      console.error("Error al obtener gestiones:", error);
      setListas([]);
    }
  };

  useEffect(() => {
    obtenerListas();
  }, []);

  const abrirDetalle = (item: Gestion) => {
    navigate("/nav/detalleGestionEpp", { state: item });
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

  const descargarPDF = (gestion: Gestion) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte Gestión EPP", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${gestion.nombre} ${gestion.apellido}`, 20, 40);
    doc.text(`Cédula: ${gestion.cedula}`, 20, 50);
    doc.text(`Cargo: ${gestion.cargo}`, 20, 60);
    doc.text(`Productos: ${gestion.productos}`, 20, 70);
    doc.text(`Cantidad: ${gestion.cantidad}`, 20, 80);
    doc.text(`Importancia: ${gestion.importancia}`, 20, 90);
    doc.text(`Fecha: ${formatearFecha(gestion.fecha_creacion)}`, 20, 100);
    doc.text(`Estado: ${gestion.estado}`, 20, 110);

    doc.save(`gestion_${gestion.id}.pdf`);
  };

  // Filtrar por estado, búsqueda y id_empresa
  const gestionesFiltradas = listas.filter(
    (item) =>
      item.id_empresa === idEmpresa &&
      (estadoFiltro === "Todos" || item.estado === estadoFiltro) &&
      `${item.nombre} ${item.apellido} ${item.cargo}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 mx-auto max-w-5xl">
        <h3 className="font-extrabold text-center mb-6 text-3xl text-gray-800">
          📋 Listas de Gestión
        </h3>

        <button
          onClick={() => navigate("/nav/crearGestionEpp")}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Crear Gestión
        </button>

        {/* Barra de búsqueda + filtro de estado */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex w-80 shadow-lg rounded-full overflow-hidden border-2 border-indigo-300 bg-white">
            <input
              type="text"
              className="flex-1 px-5 py-2 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Buscar ..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="bg-indigo-100 flex items-center justify-center px-4 border-l border-indigo-300 text-indigo-500">
              🔍
            </span>
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="ml-4 px-4 py-2 border border-indigo-300 rounded-lg shadow bg-white text-gray-700"
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Listado */}
        {gestionesFiltradas.length === 0 ? (
          <p className="text-gray-600 italic">
            No hay gestiones disponibles para esta empresa.
          </p>
        ) : (
          gestionesFiltradas.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 my-3 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
              <div>
                <div className="font-bold text-gray-800">
                  {item.nombre} {item.apellido} – {formatearFecha(item.fecha_creacion)}
                </div>
                <div className="text-gray-600 text-sm">
                  Cargo: {item.cargo} | Estado:{" "}
                  <span className="font-semibold text-indigo-600">{item.estado}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <button
                  onClick={() => abrirDetalle(item)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl shadow-lg transition"
                >
                  Abrir
                </button>

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

export default ListarGestiones;
