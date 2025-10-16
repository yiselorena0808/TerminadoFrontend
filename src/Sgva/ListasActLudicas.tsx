import React, { useEffect, useState } from "react";
import { FaFilePdf, FaPlus, FaEye, FaCalendarAlt, FaUserTie } from "react-icons/fa";
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

  const apiListarAct = import.meta.env.VITE_API_LISTARACTIVIDADES;
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const obtenerActividades = async () => {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token || !usuario) throw new Error("Usuario no autenticado");

      const response = await fetch(apiListarAct, {
        headers: { Authorization: `Bearer ${token}` },
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

    // Contenido principal
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

    // Archivos y multimedia
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

    // Pie
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sistema de Gestión SST - Actividades Lúdicas", 20, 280);

    doc.save(`actividad_${act.id}.pdf`);
  };


  return (
    <div>
      <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 mb-6 flex items-center gap-3">
        <FaUserTie className="text-4xl" />
        <div>
          <h2 className="text-2xl font-bold">SST - Actividades Lúdicas</h2>
          <p className="text-blue-200">
            Visualiza todas las actividades de tu empresa
          </p>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white border border-blue-100">
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

        {actividadesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No hay actividades registradas</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividadesFiltradas.map((act) => (
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
                    onClick={() => navigate("/nav/detalleActLudica", { state: act })}
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
      </div>
    </div>
  );
};

export default ListasActividadesLudicasEmpresa;
