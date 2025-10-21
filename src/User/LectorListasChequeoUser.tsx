import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaHardHat,
  FaCarSide,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 6; // 2 filas de 3 tarjetas cada una

  const apiListarCheq = import.meta.env.VITE_API_LISTARMISCHEQUEOS;

  const obtenerListas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarCheq, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        setListas(data.data);
      } else {
        setListas([]);
        console.warn("No se recibieron datos válidos de la API");
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
    });
  };

  const listasFiltradas = listas.filter((item) =>
    `${item.usuario_nombre} ${item.modelo} ${item.marca}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // Paginación
  const totalPaginas = Math.ceil(listasFiltradas.length / ITEMS_POR_PAGINA);
  const listasPaginadas = listasFiltradas.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (num: number) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaActual(num);
  };

  return (
    <div>
      {/* Encabezado SST */}
      <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4 backdrop-blur-sm bg-opacity-90">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">SST - Listas de Chequeo</h2>
          <p className="text-white">Control y revisión de vehículos y equipos</p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white bg-opacity-95 backdrop-blur-sm">
        {/* Filtros y acción */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center flex-1 relative">
            <FaSearch className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por usuario, marca o modelo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <button
            onClick={irCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-600 transition flex items-center gap-2 justify-center"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listasPaginadas.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FaCarSide className="text-yellow-600" />
                    {item.usuario_nombre}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatearFecha(item.fecha)} - {item.hora}
                  </p>
                </div>

                <p className="text-gray-700 mb-2">
                  Marca: <span className="font-semibold">{item.marca}</span> | Modelo:{" "}
                  <span className="font-semibold">{item.modelo}</span>
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Kilometraje: {item.kilometraje}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Técnico: {item.tecnico}
                </p>
                <p className="text-gray-500 text-sm">SOAT: {item.soat}</p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => abrirDetalle(item)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Abrir
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

export default LectorChequeo;
