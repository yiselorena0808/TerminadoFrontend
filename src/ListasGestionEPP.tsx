import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaHardHat, FaExclamationTriangle, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

interface EPP {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  fecha: string;
  id_usuario: number;
  usuario_nombre: string;
  id_empresa: number;
}

const GestionEPP: React.FC = () => {
  const navigate = useNavigate();
  const [epps, setEpps] = useState<EPP[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const apiListarEpp = import.meta.env.VITE_API_LISTARGESTIONES;

  const obtenerEpps = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarEpp, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Detectar estructura de la respuesta
      let lista: any[] = [];
      if (Array.isArray(data)) {
        lista = data;
      } else if (data.datos && Array.isArray(data.datos)) {
        lista = data.datos;
      }

      // Mapear campos a la interfaz EPP
      const eppsMapped: EPP[] = lista.map((item) => ({
        id: item.id,
        nombre: item.nombre || item.nombre_producto || "Sin nombre",
        descripcion: item.descripcion || item.descripcion_producto || "Sin descripción",
        cantidad: item.cantidad || 0,
        fecha: item.fecha_creacion || item.created_at || "",
        id_usuario: item.id_usuario,
        usuario_nombre: item.usuario?.nombre || item.usuario_nombre || "Desconocido",
        id_empresa: item.id_empresa,
      }));

      setEpps(eppsMapped);
    } catch (error) {
      console.error("Error al obtener EPP:", error);
      setEpps([]);
    }
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    obtenerEpps();
  }, []);

  const irCrear = () => navigate("/nav/creargestionEpp");

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const eppsFiltrados = epps.filter((item) =>
    `${item.nombre || ""} ${item.descripcion || ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div
      className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Encabezado SST */}
      <div className="bg-yellow-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">SST - Gestión de EPP</h2>
          <p className="text-yellow-200">Control y entrega de equipos de protección</p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {/* Filtros y acción */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar EPP por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <button
            onClick={irCrear}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition flex items-center gap-2"
          >
            <FaPlus /> Crear EPP
          </button>
        </div>

        {/* Listado */}
        {eppsFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" /> No hay equipos registrados
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {eppsFiltrados.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-xl border shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FaBox className="text-yellow-600" /> {item.nombre}
                  </h4>
                  <p className="text-sm text-gray-600">{formatearFecha(item.fecha)}</p>
                </div>

                <p className="text-gray-700 mb-2">{item.descripcion}</p>
                <p className="text-gray-600 text-sm mb-2">Cantidad: {item.cantidad}</p>
                <p className="text-gray-500 text-sm">Registrado por: {item.usuario_nombre}</p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate("/nav/detalleEpp", { state: item })}
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

export default GestionEPP;
