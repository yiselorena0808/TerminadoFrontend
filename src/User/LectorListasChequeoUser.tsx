import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
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

  const apiListarCheq = import.meta.env.VITE_API_LISTARCHEQUEO;

  const obtenerListas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarCheq, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.datos && Array.isArray(data.datos)) {
        setListas(data.datos);
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

  const irCrear = () => {
    navigate("/nav/creaListChe");
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
const listasFiltradas = listas.filter((item) =>
  `${item.usuario_nombre} ${item.modelo} ${item.marca}`
    .toLowerCase()
    .includes(busqueda.toLowerCase())
);

  return (
    <div className="p-6 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-3xl text-gray-800">
            📋 Listas de Chequeo Recibidas
          </h3>
        </div>

        <button
          onClick={irCrear}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus /> Crear Lista de chequeo
        </button>

        {/* Barra búsqueda */}
        <div className="flex justify-end mb-6">
          <div className="flex w-80 shadow-lg rounded-full overflow-hidden border-2 border-indigo-300 bg-white">
            <input
              type="text"
              className="flex-1 px-5 py-2 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Buscar por marca.."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="bg-indigo-100 flex items-center justify-center px-4 border-l border-indigo-300 text-indigo-500">
              <FaSearch />
            </span>
          </div>
        </div>

        {/* Listado */}
        {listasFiltradas.length === 0 ? (
          <p className="text-gray-600 italic">
            No hay listas enviadas.
          </p>
        ) : (
          listasFiltradas.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 my-3 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
              <div>
                <div className="font-bold text-gray-800">
                  {item.usuario_nombre} – {formatearFecha(item.fecha)} {item.hora}
                </div>
                <div className="text-gray-600 text-sm">
                  Marca: {item.marca} | Modelo: {item.modelo} | KM: {item.kilometraje} | Técnico:{" "}
                  {item.tecnico}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  SOAT: {item.soat}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => abrirDetalle(item)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl shadow-lg transition"
                >
                  Abrir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LectorChequeo;
