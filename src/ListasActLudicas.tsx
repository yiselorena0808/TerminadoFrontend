import React, { useEffect, useState } from "react";
import { FaTrash, FaDownload, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ActividadLudica {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreActividad: string;
  fechaActividad: string;
  descripcion: string;
  imagenVideo: string;
  archivoAdjunto: string;
}

const ListasActividadesLudicas: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const apiEliminarAct= import.meta.env.VITE_API_ELIMINARACTIVIDAD
  const apiListarAct= import.meta.env.VITE_API_LISTARACTIVIDADES

  const obtenerActividades = async () => {
    try {
      const res = await fetch(apiListarAct);
      const data = await res.json();
      setActividades(data.datos);
    } catch (error) {
      console.error("Error al obtener actividades lúdicas:", error);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  const ir = () => {
    navigate("/nav/crearActLudica");
  };

  const eliminarActividad = async (id: number) => {
    if (!window.confirm("¿Seguro deseas eliminar esta actividad?")) return;
    try {
      await fetch(apiEliminarAct + id, {
        method: "DELETE",
      });
      setActividades((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error eliminando actividad:", error);
    }
  };

  const actividadesFiltradas = actividades.filter((item) =>
    `${item.nombreUsuario} ${item.nombreActividad}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/foto-gratis/manos-sosteniendo-papel-ilustracion-iconos-diversion_53876-138841.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 mx-auto max-w-5xl">
        <h3 className="font-extrabold text-center mb-6 text-3xl text-indigo-900">
          🎉 Actividades Lúdicas
        </h3>
        <button
          onClick={ir}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus /> Crear Actividad
        </button>

        {/* Barra de búsqueda */}
        <div className="flex justify-end mb-6">
          <div className="flex w-80 shadow-lg rounded-full overflow-hidden border-2 border-indigo-300 bg-white">
            <input
              type="text"
              className="flex-1 px-5 py-2 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Buscar actividades..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="bg-indigo-100 flex items-center justify-center px-4 border-l border-indigo-300 text-indigo-500">
              🔍
            </span>
          </div>
        </div>

        {/* Lista de actividades */}
        {actividadesFiltradas.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            No se encontraron actividades.
          </p>
        ) : (
          actividadesFiltradas.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-5 my-4 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
              {/* Info de la actividad */}
              <div>
                <div className="font-bold text-gray-800 text-lg">
                  {item.nombreActividad}
                </div>
                <div className="text-sm text-gray-600">
                  Usuario:{" "}
                  <span className="font-medium">{item.nombreUsuario}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Fecha:{" "}
                  {item.fechaActividad
                    ? new Date(item.fechaActividad).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Sin fecha"}
                </div>
                <div className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {item.descripcion}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => navigate("/nav/detalleActLudica", { state: item })}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl shadow-lg transition flex items-center gap-1"
                >
                  <FaEye /> Ver
                </button>

                {item.archivoAdjunto && (
                  <a
                    href={item.archivoAdjunto}
                    download
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition"
                  >
                    <FaDownload />
                  </a>
                )}

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
    </div>
  );
};

export default ListasActividadesLudicas;
