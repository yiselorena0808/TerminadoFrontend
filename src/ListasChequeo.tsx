import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaHardHat, FaCarSide, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

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

  const listasFiltradas = listas.filter((item) =>
    `${item.usuario_nombre} ${item.modelo} ${item.marca}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

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
          <h2 className="text-3xl font-bold">SST - Listas de Chequeo</h2>
          <p className="text-yellow-200">Control y revisión de vehículos y equipos</p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {/* Filtros y acción */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar por usuario, marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={irCrear}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition flex items-center gap-2"
          >
            <FaPlus /> Crear Lista
          </button>
        </div>

        {/* Listado */}
        {listasFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            No hay listas registradas
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {listasFiltradas.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-xl border shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
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
                <p className="text-gray-600 text-sm mb-2">Kilometraje: {item.kilometraje}</p>
                <p className="text-gray-600 text-sm mb-2">Técnico: {item.tecnico}</p>
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
      </div>
    </div>
  );
};

export default ListasChequeoRecibidas;

//crearListasChequeo
//ListasChequeoRecibidas