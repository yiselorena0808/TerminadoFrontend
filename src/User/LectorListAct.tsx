import React, { useEffect, useState } from "react";
import { FaFilePdf, FaPlus, FaEye, FaCalendarAlt, FaRunning } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

interface ActividadLudica {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreActividad: string;
  fechaActividad: string | null;
  descripcion: string;
  imagenVideo: string;
  archivoAdjunto: string;
  idEmpresa: number;
  createdAt: string;
  updatedAt: string;
}

const LectorListasActividadesLudicas: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 6; // 2 filas de 3 tarjetas cada una

  const apiListarAct = import.meta.env.VITE_API_MISACTIVIDADES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    else setError("No se encontró información del usuario.");
  }, []);

  const obtenerActividades = async (idUsuario: number) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(apiListarAct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener actividades");

      const data = await response.json();

      const soloMias = Array.isArray(data.data)
        ? data.data.filter((act: ActividadLudica) => act.idUsuario === idUsuario)
        : [];

      setActividades(soloMias);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar actividades");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario?.id) obtenerActividades(usuario.id);
  }, [usuario]);

  const irCrear = () => navigate("/nav/creaActUser");

  const actividadesFiltradas = actividades.filter(
    (act) =>
      act.nombreActividad.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const totalPaginas = Math.ceil(actividadesFiltradas.length / ITEMS_POR_PAGINA);
  const actividadesPaginadas = actividadesFiltradas.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (num: number) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaActual(num);
  };

  const descargarPDF = async (act: ActividadLudica) => {
    const doc = new jsPDF();
    const azul = [25, 86, 212];
    const blanco = [255, 255, 255];

    doc.setFillColor(...azul);
    doc.rect(0, 0, 220, 35, "F");

    doc.setTextColor(...blanco);
    doc.setFontSize(18);
    doc.text("Reporte de Actividad Lúdica", 20, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let y = 50;
    const espacio = 10;

    doc.text(`Nombre de la Actividad: ${act.nombreActividad}`, 20, y);
    y += espacio;
    doc.text(
      `Fecha de la Actividad: ${
        act.fechaActividad
          ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
          : "Sin fecha"
      }`,
      20,
      y
    );
    y += espacio;
    doc.text(`Descripción:`, 20, y);
    y += 8;
    doc.text(act.descripcion || "Sin descripción", 20, y, { maxWidth: 170 });
    y += 25;

    doc.text(`Nombre del Usuario: ${act.nombreUsuario}`, 20, y);
    y += espacio;

    doc.text(`ID Actividad: ${act.id}`, 20, y);
    y += espacio;

    doc.text(`ID Usuario: ${act.idUsuario}`, 20, y);
    y += espacio;

    doc.text(`ID Empresa: ${act.idEmpresa}`, 20, y);
    y += espacio;

    doc.text(`Creado en: ${new Date(act.createdAt).toLocaleString()}`, 20, y);
    y += espacio;

    doc.text(`Actualizado en: ${new Date(act.updatedAt).toLocaleString()}`, 20, y);
    y += espacio * 1.5;

    if (act.archivoAdjunto) {
      doc.text("Archivo Adjunto:", 20, y);
      y += 8;
      doc.textWithLink("Ver Archivo", 25, y, { url: act.archivoAdjunto });
      y += espacio;
    }

    if (act.imagenVideo) {
      try {
        const img = await fetch(act.imagenVideo);
        const blob = await img.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        doc.addImage(base64, "PNG", 20, y, 80, 60);
        y += 70;
      } catch (e) {
        doc.text("No se pudo cargar la imagen.", 20, y);
      }
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sistema de Gestión SST - Actividades Lúdicas", 20, 280);

    doc.save(`actividad_${act.id}.pdf`);
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Encabezado */}
      <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
        <FaRunning className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">Mis Actividades Lúdicas</h2>
          <p className="text-blue-200">
            Promoviendo bienestar, creatividad y trabajo en equipo
          </p>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white border border-blue-100">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={irCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus /> Nueva Actividad
          </button>
        </div>

        {/* Tarjetas */}
        {actividadesPaginadas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No tienes actividades registradas.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividadesPaginadas.map((act) => (
              <div
                key={act.id}
                className="p-6 rounded-2xl border border-blue-200 shadow hover:shadow-lg transition bg-white flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    {act.nombreActividad}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Usuario:</strong> {act.nombreUsuario}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Fecha:</strong>{" "}
                    {act.fechaActividad
                      ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
                      : "Sin fecha"}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate("/nav/MidetalleAct", { state: act })}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1"
                  >
                    <FaEye /> Abrir
                  </button>
                  <button
                    onClick={() => descargarPDF(act)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <FaFilePdf /> PDF
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

export default LectorListasActividadesLudicas;
