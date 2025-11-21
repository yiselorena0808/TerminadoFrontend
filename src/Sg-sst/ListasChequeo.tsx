import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaHardHat,
  FaCarSide,
  FaExclamationTriangle,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
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
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
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
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaHardHat className="text-blue-700" /> 
            Listas de Chequeo
          </h1>
          {/* CONTADOR DE LISTAS - EN EL HEADER */}
          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{listasFiltradas.length}</span> listas
            </p>
          </div>
        </div>
        <button
          onClick={irCrear}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus /> Crear Lista
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
                placeholder="Buscar por usuario, marca o modelo..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
          </div>
        </div>

        {/* LISTA DE CHEQUEOS */}
        {listasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {listas.length === 0 ? "No hay listas registradas" : "No se encontraron listas"}
            </h3>
            <p className="text-gray-500">
              {listas.length === 0 
                ? "Crea la primera lista usando el botón 'Crear Lista'" 
                : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE LISTAS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listasPaginadas.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                          <FaCarSide className="text-blue-500" /> 
                          {item.usuario_nombre}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {formatearFecha(item.fecha)} - {item.hora}
                        </p>
                      </div>
                    </div>

                    {/* INFORMACIÓN DEL VEHÍCULO */}
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-700 text-sm">
                        <strong>Marca:</strong> {item.marca}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Modelo:</strong> {item.modelo}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Kilometraje:</strong> {item.kilometraje}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Técnico:</strong> {item.tecnico}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>SOAT:</strong> {item.soat}
                      </p>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm"
                      >
                        Abrir
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

export default ListasChequeoRecibidas;