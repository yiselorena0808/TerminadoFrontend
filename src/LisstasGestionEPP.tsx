import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
}

const ListarGestiones: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Gestion[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const estados = ["Pendiente", "Revisado", "Finalizado"];

  const obtenerListas = async () => {
    try {
      const res = await fetch("http://localhost:3333/listarGestiones");
      const data = await res.json();
      setListas(data.datos);
    } catch (error) {
      console.error("Error al obtener gestiones:", error);
    }
  };

  useEffect(() => {
    obtenerListas();
  }, []);

  const abrirDetalle = (item: Gestion) => {
    navigate("/nav/detalleGestion", { state: item });
  };

  const formatearFecha = (fechaIso: string): string => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await fetch(`http://localhost:3333/actualizarGestion/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      setListas((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, estado: nuevoEstado } : item
        )
      );
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const eliminarGestion = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta gestión?")) return;
    try {
      await fetch(`http://localhost:3333/eliminarGestion/${id}`, {
        method: "DELETE",
      });
      setListas((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar gestión:", error);
    }
  };

  const filtrarPorEstado = (estado: string) =>
    listas.filter(
      (item) =>
        item.estado === estado &&
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

        {/* Barra de búsqueda */}
        <div className="flex justify-end mb-6">
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
        </div>

        {/* Listado por estados */}
        {estados.map((estado) => {
          const gestionesFiltradas = filtrarPorEstado(estado);
          return (
            <div key={estado} className="mb-8">
              <h4 className="font-semibold text-xl mb-4 text-indigo-700">
                {estado}
              </h4>

              {gestionesFiltradas.length === 0 ? (
                <p className="text-gray-600 italic">
                  No hay gestiones {estado.toLowerCase()}.
                </p>
              ) : (
                gestionesFiltradas.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 my-3 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
                  >
                    <div>
                      <div className="font-bold text-gray-800">
                        {item.nombre} {item.apellido} –{" "}
                        {formatearFecha(item.fecha_creacion)}
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

                      {/* Eliminar */}
                      <button
                        onClick={() => eliminarGestion(item.id)}
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

      {/* Estilos personalizados */}
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

export default ListarGestiones;
