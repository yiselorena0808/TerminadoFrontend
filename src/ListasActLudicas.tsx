import React, { useEffect, useState } from "react";
import { FaEye, FaPlus, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ActividadLudica {
  id: number;
  id_usuario: number;
  nombre_usuario: string;
  nombre_actividad: string;
  fecha_actividad: string | null;
  descripcion: string;
  imagen_video: string;
  archivo_adjunto: string;
  id_empresa: number;
}

interface Props {
  idEmpresa: number;
}

const ListasActividadesLudicas: React.FC<Props> = ({ idEmpresa }) => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const apiListarAct = import.meta.env.VITE_API_LISTARACTIVIDADES;

  const obtenerActividades = async () => {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuario no autenticado");
        setCargando(false);
        return;
      }

      const response = await fetch(apiListarAct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setCargando(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.datos && Array.isArray(data.datos)) {
        setActividades(data.datos);
      } else if (Array.isArray(data)) {
        setActividades(data);
      } else {
        setActividades([]);
        setError("No se recibieron datos válidos de la API");
      }
    } catch (error: any) {
      console.error("Error al obtener actividades lúdicas:", error);
      setError(error.message || "Error al cargar actividades");
      setActividades([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  const irCrear = () => {
    navigate("/nav/crearActLudica");
  };

  const actividadesFiltradas = actividades.filter(
    (item) =>
      item.id_empresa === idEmpresa &&
      `${item.nombre_usuario} ${item.nombre_actividad}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const descargarPDF = (actividad: ActividadLudica) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Detalle Actividad Lúdica", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nombre de la actividad: ${actividad.nombre_actividad || "Sin nombre"}`, 20, 35);
  doc.text(`Usuario: ${actividad.nombre_usuario || "Sin usuario"}`, 20, 45);
  doc.text(
    `Fecha: ${
      actividad.fecha_actividad
        ? new Date(actividad.fecha_actividad).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Sin fecha"
    }`,
    20,
    55
  );
  doc.text("Descripción:", 20, 65);
  doc.text(doc.splitTextToSize(actividad.descripcion || "Sin descripción", 170), 20, 72);

  if (actividad.imagen_video) {
    doc.text(`Imagen/Video: ${actividad.imagen_video}`, 20, 100);
  }
  if (actividad.archivo_adjunto) {
    doc.text(`Archivo adjunto: ${actividad.archivo_adjunto}`, 20, 110);
  }

  doc.save(`actividad_${actividad.id}.pdf`);
};


  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando actividades...</div>
      </div>
    );
  }

  return (
    <div
      className="p-3 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 mx-auto max-w-5xl">
        <h3 className="font-extrabold text-center mb-6 text-3xl text-indigo-900">
          🎉 Actividades Lúdicas
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={irCrear}
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
            {actividades.length === 0
              ? "No se encontraron actividades."
              : "No hay actividades que coincidan con la búsqueda."}
          </p>
        ) : (
          actividadesFiltradas.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 my-4 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
              <div className="flex-1 md:flex md:items-center gap-4">
                {/* Imagen o video */}
                {item.imagen_video && (
                  <div className="w-32 h-32 flex-shrink-0">
                    {item.imagen_video.endsWith(".mp4") || item.imagen_video.endsWith(".webm") ? (
                      <video
                        src={item.imagen_video}
                        controls
                        className="w-32 h-32 object-cover rounded"
                      />
                    ) : (
                      <img
                        src={item.imagen_video}
                        alt={item.nombre_actividad}
                        className="w-32 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                )}

                <div>
                  <div className="font-bold text-gray-800 text-lg">{item.nombre_actividad}</div>
                  <div className="text-sm text-gray-600">
                    Usuario: <span className="font-medium">{item.nombre_usuario}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Fecha:{" "}
                    {item.fecha_actividad
                      ? new Date(item.fecha_actividad).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Sin fecha"}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{item.descripcion}</div>

                  {/* Archivo adjunto */}
                  {item.archivo_adjunto && (
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={item.archivo_adjunto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Ver archivo adjunto
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-4 md:mt-0 items-center">
                <button
                  onClick={() =>
                    navigate("/nav/detalleActLudica", { state: item })
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-xl shadow-lg transition flex items-center gap-1"
                >
                  <FaEye /> Ver
                </button>

                <button
                  onClick={() => descargarPDF(item)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition"
                  title="Descargar PDF"
                >
                  <FaFilePdf />
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
