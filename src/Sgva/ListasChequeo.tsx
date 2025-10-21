import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaHardHat,
  FaCarSide,
  FaExclamationTriangle,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

interface ListaChequeo {
  id: number;
  id_usuario: number;
  usuario_nombre: string;
  fecha: string;
  hora: string;
  modelo: string;
  marca: string;
  soat: string;
  tecnico: string;
  kilometraje: string;
  id_empresa: number;
}

const ListasChequeoRecibidas: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<ListaChequeo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 6;

  const apiListarCheq = import.meta.env.VITE_API_LISTARCHEQUEO;

  const obtenerListas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarCheq, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setListas(data.datos && Array.isArray(data.datos) ? data.datos : []);
    } catch (error) {
      console.error("Error al obtener listas:", error);
      setListas([]);
    }
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    obtenerListas();
  }, []);

  const abrirDetalle = (item: ListaChequeo) => {
    navigate("/nav/detalleListasChequeo", { state: item });
  };

  const irCrear = () => {
    navigate("/nav/crearListasChequeo");
  };

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const descargarPDF = (lista: ListaChequeo) => {
    const doc = new jsPDF();
    const azul = [25, 86, 212];
    const negro = [0, 0, 0];

    // Encabezado
    doc.setFillColor(...azul);
    doc.rect(0, 0, 220, 35, "F");
    doc.setTextColor(...negro);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SISTEMA SST - LISTA DE CHEQUEO", 20, 22);

    // Contenido
    doc.setFontSize(12);
    let y = 50;
    const esp = 10;
    doc.text(`Usuario: ${lista.usuario_nombre}`, 20, y);
    y += esp;
    doc.text(`Fecha: ${formatearFecha(lista.fecha)} ${lista.hora}`, 20, y);
    y += esp;
    doc.text(`Marca: ${lista.marca}`, 20, y);
    y += esp;
    doc.text(`Modelo: ${lista.modelo}`, 20, y);
    y += esp;
    doc.text(`Kilometraje: ${lista.kilometraje}`, 20, y);
    y += esp;
    doc.text(`Técnico: ${lista.tecnico}`, 20, y);
    y += esp;
    doc.text(`SOAT: ${lista.soat}`, 20, y);

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("© Sistema de Gestión SST - Seguridad Industrial", 20, 280);

    doc.save(`lista_chequeo_${lista.id}.pdf`);
  };

  // 🔹 Filtrado y paginación
  const listasFiltradas = listas.filter((item) =>
    `${item.usuario_nombre} ${item.modelo} ${item.marca}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(listasFiltradas.length / porPagina);
  const indiceInicio = (paginaActual - 1) * porPagina;
  const indiceFin = indiceInicio + porPagina;
  const listasPaginadas = listasFiltradas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-3">
        <FaHardHat className="text-4xl text-yellow-400" />
        <div>
          <h2 className="text-2xl font-bold">SST - Listas de Chequeo</h2>
          <p className="text-gray-300 text-sm">
            Control y revisión de vehículos y equipos
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-2xl shadow-2xl p-6 mx-auto max-w-7xl bg-white border border-gray-200">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <input
            type="text"
            placeholder="Buscar por usuario, marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={irCrear}
            className="px-5 py-2 bg-blue-700 text-white font-medium rounded-lg shadow hover:bg-blue-800 transition flex items-center gap-2"
          >
            <FaPlus /> Crear Lista
          </button>
        </div>

        {/* Listado */}
        {listasPaginadas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            No hay listas registradas
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listasPaginadas.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between h-[220px]"
                >
                  <div>
                    <h4 className="font-semibold text-base text-blue-700 flex items-center gap-2 mb-1">
                      <FaCarSide className="text-blue-500 text-lg" />
                      {item.usuario_nombre}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {formatearFecha(item.fecha)} - {item.hora}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Marca: <span className="font-medium">{item.marca}</span> |{" "}
                      Modelo: <span className="font-medium">{item.modelo}</span>
                    </p>
                    <p className="text-gray-600 text-xs">
                      Kilometraje: {item.kilometraje}
                    </p>
                    <p className="text-gray-600 text-xs">
                      Técnico: {item.tecnico}
                    </p>
                    <p className="text-gray-500 text-xs">SOAT: {item.soat}</p>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => abrirDetalle(item)}
                      className="bg-blue-700 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-800 transition"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={() => descargarPDF(item)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-xs hover:bg-red-700 transition flex items-center gap-1"
                    >
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔹 Paginación numerada */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>

                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => cambiarPagina(i + 1)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
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
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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

export default ListasChequeoRecibidas;
