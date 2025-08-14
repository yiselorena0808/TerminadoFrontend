import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ActividadLudica {
  id: number;
  nombre: string;
  responsable: string;
  fecha: string;
  descripcion: string;
  archivos?: string;
  estado: string;
}

const ListasActividadesLudicas: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const estados = ["Pendiente", "Revisado", "Finalizado"];

  // Obtener actividades desde backend
  const obtenerActividades = async () => {
    try {
      const res = await fetch("http://localhost:3333/listarActividadesLudicas");
      const data = await res.json();
      setActividades(data.datos);
    } catch (error) {
      console.error("Error al obtener actividades lúdicas:", error);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  // Abrir detalle
  const abrirDetalle = (item: ActividadLudica) => {
    navigate("/nav/detalleActividadLudica", { state: item });
  };

  // Formatear fecha
  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Cambiar estado
  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await fetch(`http://localhost:3333/actualizarActividadLudica/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      setActividades((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, estado: nuevoEstado } : item
        )
      );
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // Eliminar actividad
  const eliminarActividad = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta actividad lúdica?"))
      return;
    try {
      await fetch(`http://localhost:3333/eliminarActividadLudica/${id}`, {
        method: "DELETE",
      });
      setActividades((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    }
  };

  // Filtrar por estado y búsqueda
  const filtrarPorEstado = (estado: string) =>
    actividades.filter(
      (item) =>
        item.estado === estado &&
        `${item.nombre} ${item.responsable}`
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
          🎨 Actividades Lúdicas
        </h3>

        {/* Barra de búsqueda */}
        <div className="flex justify-end mb-6">
          <div className="flex w-80 shadow-lg rounded-full overflow-hidden border-2 border-indigo-300 bg-white">
            <input
              type="text"
              className="flex-1 px-5 py-2 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Buscar por nombre o responsable..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="bg-indigo-100 flex items-center justify-center px-4 border-l border-indigo-300 text-indigo-500">
              <FaSearch />
            </span>
          </div>
        </div>

        {/* Listado por estados */}
        {estados.map((estado) => {
          const actividadesFiltradas = filtrarPorEstado(estado);
          return (
            <div key={estado} className="mb-8">
              <h4 className="font-semibold text-xl mb-4 text-indigo-700">
                {estado}
              </h4>

              {actividadesFiltradas.length === 0 ? (
                <p className="text-gray-600 italic">
                  No hay actividades en estado {estado.toLowerCase()}.
                </p>
              ) : (
                actividadesFiltradas.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 my-3 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
                  >
                    <div>
                      <div className="font-bold text-gray-800">
                        {item.nombre} – {formatearFecha(item.fecha)}
                      </div>
                      <div className="text-gray-600 text-sm">
                        Responsable: {item.responsable}
                      </div>
                      {item.descripcion && (
                        <div className="text-gray-500 text-sm mt-1">
                          {item.descripcion}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 items-center">
                      {/* Abrir */}
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl shadow-lg transition"
                      >
                        Abrir
                      </button>

                      {/* Dropdown de estado */}
                      <div className="relative group">
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition">
                          Estado ▼
                        </button>
                        <div className="absolute hidden group-hover:block bg-white border border-indigo-300 rounded-lg shadow-lg mt-1 right-0 w-44 animate-[fadeIn] z-50">
                          {estados.map((e) => (
                            <button
                              key={e}
                              onClick={() => cambiarEstado(item.id, e)}
                              className={`block px-5 py-2 text-sm w-full text-left text-gray-800 transition hover:bg-indigo-100 ${
                                item.estado === e
                                  ? "font-bold text-indigo-600"
                                  : ""
                              }`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Descargar */}
                      {item.archivos && (
                        <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition">
                          <FaDownload />
                        </button>
                      )}

                      {/* Eliminar */}
                      <button
                        onClick={() => eliminarActividad(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ListasActividadesLudicas;
