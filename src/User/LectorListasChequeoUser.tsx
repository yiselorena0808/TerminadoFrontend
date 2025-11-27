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
  FaUser,
  FaCalendarAlt,
  FaCog
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

const LectorChequeo: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<ListaChequeo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const listasPorPagina = 9;

  const apiListarCheq = import.meta.env.VITE_API_LISTARMISCHEQUEOS;

  const obtenerListas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarCheq, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`
        },
      });

      const texto = await res.text();
      console.log("Respuesta cruda:", texto);

      const data = JSON.parse(texto);

      if (data.data && Array.isArray(data.data)) {
        setListas(data.data);
      } else {
        console.warn("No se recibieron datos válidos de la API");
        setListas([]);
      }
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
    navigate("/nav/MidetalleChe", { state: item });
  };

  const irCrear = () => navigate("/nav/creaListChe");

  const formatearFecha = (fechaIso: string) => {
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

  const descargarPDF = (lista: ListaChequeo) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lista de Chequeo - Vehículo", 20, 20);
    doc.setFontSize(12);
    doc.text(`Usuario: ${lista.usuario_nombre}`, 20, 40);
    doc.text(`Fecha: ${formatearFecha(lista.fecha)}`, 20, 50);
    doc.text(`Marca: ${lista.marca}`, 20, 60);
    doc.text(`Modelo: ${lista.modelo}`, 20, 70);
    doc.text(`Kilometraje: ${lista.kilometraje}`, 20, 80);
    doc.text(`Técnico: ${lista.tecnico}`, 20, 90);
    doc.text(`SOAT: ${lista.soat}`, 20, 100);
    doc.save(`lista_chequeo_${lista.id}.pdf`);
  };

  const listasFiltradas = listas.filter((item) =>
    `${item.usuario_nombre} ${item.modelo} ${item.marca} ${item.tecnico}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // 🔹 PAGINACIÓN
  const totalPaginas = Math.ceil(listasFiltradas.length / listasPorPagina);
  const indiceInicial = (paginaActual - 1) * listasPorPagina;
  const indiceFinal = indiceInicial + listasPorPagina;
  const listasPaginadas = listasFiltradas.slice(indiceInicial, indiceFinal);

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
            Mis Listas de Chequeo
          </h1>

          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{listasFiltradas.length}</span> listas
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={irCrear}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Nueva Lista
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR Y FILTROS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar lista de chequeo..."
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
              <option>Todos los estados</option>
            </select>
          </div>
        </div>

        {/* LISTA DE CHEQUEOS */}
        {listasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {listas.length === 0 ? "No hay listas de chequeo registradas" : "No se encontraron listas"}
            </h3>
            <p className="text-gray-500">
              {listas.length === 0 
                ? "Crea la primera lista usando el botón 'Nueva Lista'" 
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
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {item.usuario_nombre}
                        </h3>
                        <p className="text-gray-600 text-sm">Técnico: {item.tecnico}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        Chequeo
                      </span>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      <FaCalendarAlt className="inline mr-2 text-gray-400" />
                      {formatearFecha(item.fecha)}
                    </p>

                    {/* VEHÍCULO */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaCarSide className="text-yellow-500" />
                      <span className="text-sm font-medium">{item.marca} {item.modelo}</span>
                    </div>

                    {/* INFORMACIÓN ADICIONAL */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCog className="text-gray-400 text-sm" />
                        <span className="text-sm">KM: {item.kilometraje}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUser className="text-gray-400 text-sm" />
                        <span className="text-sm">SOAT: {item.soat}</span>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm"
                      >
                        Ver Detalle
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

export default LectorChequeo;