import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

const ListasActividadesLudicasEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const actividadesPorPagina = 9;

  const apiListarAct = import.meta.env.VITE_API_LISTARACTIVIDADES;
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const obtenerActividades = async () => {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token || !usuario) throw new Error("Usuario no autenticado");

      const response = await fetch(apiListarAct, {
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener actividades");
      const data = await response.json();

      const lista = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.datos)
        ? data.datos
        : Array.isArray(data)
        ? data
        : [];

      const actividadesEmpresa = lista.filter(
        (act) => act.idEmpresa === usuario.id_empresa
      );

      setActividades(actividadesEmpresa);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar actividades");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  const irCrear = () => navigate("/nav/crearActLudica");

  const actividadesFiltradas = actividades.filter(
    (act) =>
      act.nombreActividad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 Paginación
  const totalPaginas = Math.ceil(actividadesFiltradas.length / actividadesPorPagina);
  const indiceInicial = (paginaActual - 1) * actividadesPorPagina;
  const indiceFinal = indiceInicial + actividadesPorPagina;
  const actividadesPaginadas = actividadesFiltradas.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const descargarPDF = async (act: ActividadLudica) => {
    const doc = new jsPDF();
    const azul = [25, 86, 212];
    const blanco = [255, 255, 255];

    // Encabezado azul
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
    doc.text("Descripción:", 20, y);
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
      } catch {
        doc.text("No se pudo cargar la imagen.", 20, y);
      }
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sistema de Gestión SST - Actividades Lúdicas", 20, 280);
    doc.save(`actividad_${act.id}.pdf`);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-blue-600 to-black text-white rounded-2xl shadow-lg p-6 mb-6 flex items-center gap-3">
        <FaUserTie className="text-4xl text-yellow-400" />
        <div>
          <h2 className="text-2xl font-bold">SST - Actividades Lúdicas</h2>
          <p className="text-gray-300">Visualiza todas las actividades de tu empresa</p>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-7xl bg-white border border-gray-200">
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
            className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition flex items-center gap-2"
          >
            <FaPlus /> Nueva Actividad
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-gray-500">Cargando actividades...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : actividadesPaginadas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No hay actividades registradas</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actividadesPaginadas.map((act) => (
                <div
                  key={act.id}
                  className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between h-[260px]"
                >
                  <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      {act.nombreActividad}
                    </h3>
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Usuario:</strong> {act.nombreUsuario}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Fecha:</strong>{" "}
                      {act.fechaActividad
                        ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
                        : "Sin fecha"}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {act.descripcion?.length > 80
                        ? act.descripcion.substring(0, 80) + "..."
                        : act.descripcion || "Sin descripción"}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() =>
                        navigate("/nav/detalleActLudica", { state: act })
                      }
                      className="bg-blue-700 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 transition flex items-center gap-1"
                    >
                      <FaEye /> Abrir
                    </button>
                    <button
                      onClick={() => descargarPDF(act)}
                      className="bg-red-500 text-white px-4 py-1 text-sm rounded hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔹 Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => cambiarPagina(i + 1)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      paginaActual === i + 1
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListasActividadesLudicasEmpresa;
