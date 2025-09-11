import React, { useEffect, useState } from "react";
import { FaTrash, FaDownload, FaEye, FaPlus, FaFilePdf } from "react-icons/fa";
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

  const apiListarAct = import.meta.env.VITE_API_LISTARACTIVIDADES;

  const obtenerActividades = async () => {
    try {
      const res = await fetch(apiListarAct);
      const data = await res.json();
      if (data.datos && Array.isArray(data.datos)) {
        setActividades(data.datos);
      } else {
        setActividades([]);
        console.warn("No se recibieron datos válidos de la API");
      }
    } catch (error) {
      console.error("Error al obtener actividades lúdicas:", error);
      setActividades([]);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  const descargarPDF = (actividad: ActividadLudica) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte Actividad Lúdica", 20, 20);

    doc.setFontSize(12);
    doc.text(`Actividad: ${actividad.nombre_actividad}`, 20, 40);
    doc.text(`Usuario: ${actividad.nombre_usuario}`, 20, 50);
    doc.text(
      `Fecha: ${
        actividad.fecha_actividad
          ? new Date(actividad.fecha_actividad).toLocaleDateString("es-CO")
          : "Sin fecha"
      }`,
      20,
      60
    );
    doc.text(doc.splitTextToSize(actividad.descripcion || "Sin descripción", 170), 20, 80);
    doc.save(`actividad_${actividad.id}.pdf`);
  };

  const irCrear = () => {
    navigate("/nav/crearActLudica");
  };

  // Filtramos por búsqueda y por empresa
  const actividadesFiltradas = actividades.filter(
    (item) =>
      item.id_empresa === idEmpresa &&
      `${item.nombre_usuario} ${item.nombre_actividad}`
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
        <h3 className="font-extrabold text-center mb-6 text-3xl text-indigo-900">
          🎉 Actividades Lúdicas
        </h3>

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
            No se encontraron actividades para esta empresa.
          </p>
        ) : (
          actividadesFiltradas.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-5 my-4 bg-white hover:bg-indigo-50 rounded-2xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
            >
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
                <div className="text-gray-500 text-sm mt-1 line-clamp-2">{item.descripcion}</div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 items-center">
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
