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
<div className="p-8 min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200"
style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      }}
>
  {/* Encabezado */}
  <div className="bg-yellow-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
    🎉
    <div>
      <h2 className="text-3xl font-bold">SST - Actividades Lúdicas</h2>
      <p className="text-yellow-200">Bienestar, integración y recreación laboral</p>
    </div>
  </div>

  <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
    {/* Barra de acciones */}
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <input
        type="text"
        placeholder="Buscar actividad..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-yellow-500"
      />
      <button
        onClick={irCrear}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition flex items-center gap-2"
      >
        <FaPlus /> Crear Actividad
      </button>
    </div>

    {/* Estado de carga y error */}
    {error && (
      <div className="mb-4 p-3 bg-red-500/80 text-white rounded-lg text-center shadow">
        {error}
      </div>
    )}
    {cargando && (
      <p className="text-center text-yellow-300">Cargando actividades...</p>
    )}

    {/* Lista de actividades */}
    {actividadesFiltradas.length === 0 ? (
      <p className="text-center text-black mt-6 italic">
        No hay actividades disponibles
      </p>
    ) : (
      <div className="grid md:grid-cols-2 gap-6">
        {actividadesFiltradas.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-xl border shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
          >
            <div className="mb-4">
              <h4 className="font-bold text-lg text-yellow-100">
                {item.nombre_actividad}
              </h4>
              <p className="text-sm text-black">
                Usuario: <span className="font-semibold">{item.nombre_usuario}</span>
              </p>
              <p className="text-sm text-black">
                {item.fecha_actividad
                  ? new Date(item.fecha_actividad).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Sin fecha"}
              </p>
            </div>

            <p className="text-black text-sm mb-3">{item.descripcion}</p>

            {/* Imagen o video */}
            {item.imagen_video && (
              <div className="mb-3">
                {item.imagen_video.endsWith(".mp4") ||
                item.imagen_video.endsWith(".webm") ? (
                  <video
                    src={item.imagen_video}
                    controls
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />
                ) : (
                  <img
                    src={item.imagen_video}
                    alt={item.nombre_actividad}
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />
                )}
              </div>
            )}

            {/* Archivo adjunto */}
            {item.archivo_adjunto && (
              <a
                href={item.archivo_adjunto}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline block mb-3"
              >
                📎 Ver archivo adjunto
              </a>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  navigate("/nav/detalleActLudica", { state: item })
                }
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1"
              >
                <FaEye /> Ver
              </button>
              <button
                onClick={() => descargarPDF(item)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
              >
                <FaFilePdf /> PDF
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

export default ListasActividadesLudicas;
