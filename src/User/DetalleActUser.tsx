import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  FileText,
  Image as ImageIcon,
  FileDown,
  Activity,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Tipo de actividad
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

const MiDetalleActividadLudica: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const actividad = location.state as ActividadLudica | undefined;

  const [descripcion, setDescripcion] = useState(actividad?.descripcion || "");
  const [respuestaAdmin, setRespuestaAdmin] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Simulación de usuario admin
  const isAdmin = true; // reemplaza con tu lógica de autenticación

  if (!actividad) {
    return <p className="p-6 text-center text-white">No hay datos.</p>;
  }

  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);
    return isNaN(d.getTime())
      ? fecha || "Sin fecha"
      : d.toLocaleDateString("es-CO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  // Función para enviar comentario del admin
  const handleEnviarRespuesta = async () => {
    if (!respuestaAdmin.trim()) {
      setMensaje("El comentario no puede estar vacío");
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/actividad/${actividad.id}/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: respuestaAdmin }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Respuesta enviada correctamente");
        setRespuestaAdmin("");
      } else {
        setMensaje(data.mensaje || "Error al enviar respuesta");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión");
    }
  };

  // Función para descargar PDF
  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Detalle Actividad Lúdica", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre de la actividad: ${actividad.nombreActividad}`, 20, 35);
    doc.text(`Usuario: ${actividad.nombreUsuario}`, 20, 45);
    doc.text(`Fecha: ${formatearFecha(actividad.fechaActividad)}`, 20, 55);
    doc.text("Descripción:", 20, 65);
    doc.text(doc.splitTextToSize(descripcion || "Sin descripción", 170), 20, 72);

    if (actividad.imagenVideo) {
      doc.text(`Imagen/Video: ${actividad.imagenVideo}`, 20, 100);
    }
    if (actividad.archivoAdjunto) {
      doc.text(`Archivo adjunto: ${actividad.archivoAdjunto}`, 20, 110);
    }

    doc.save(`actividad_${actividad.id}.pdf`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://onesoluciones.co/wp-content/uploads/2021/04/Pausas-1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white/90 text-gray-800 rounded-lg shadow hover:bg-white"
        >
          ← Volver
        </button>

        {/* Card principal */}
        <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden border">
          {/* Header */}
          <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🎨 {actividad.nombreActividad}</h2>
              <p className="text-pink-100">{actividad.nombreUsuario}</p>
            </div>
            <button
              onClick={descargarPDF}
              className="px-4 py-2 bg-red-600 rounded-lg shadow hover:bg-red-700 text-white"
            >
              Descargar PDF
            </button>
          </div>

          {/* Body de la actividad */}
          <div className="p-8 space-y-5">
            <p className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Usuario:</span> {actividad.nombreUsuario}
            </p>

            <p className="flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Actividad:</span> {actividad.nombreActividad}
            </p>

            <p className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-pink-600" />
              <span className="font-semibold">Fecha:</span> {formatearFecha(actividad.fechaActividad)}
            </p>

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-pink-600" />
                <span className="font-semibold">Descripción:</span>
              </p>
              <textarea
                className="w-full border rounded-lg p-3"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* Imagen/Video */}
            {actividad.imagenVideo && (
              <div className="flex items-center gap-4">
                <ImageIcon className="w-5 h-5 text-pink-600" />
                <a
                  href={actividad.imagenVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver Imagen/Video
                </a>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = actividad.imagenVideo;
                    link.download = `media_${actividad.id}`;
                    link.click();
                  }}
                  className="text-green-600 underline"
                >
                  Descargar
                </button>
              </div>
            )}

            {/* Archivo adjunto */}
            {actividad.archivoAdjunto && (
              <div className="flex items-center gap-4">
                <FileDown className="w-5 h-5 text-pink-600" />
                <a
                  href={actividad.archivoAdjunto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver Archivo
                </a>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = actividad.archivoAdjunto;
                    link.download =
                      actividad.archivoAdjunto.split("/").pop() || `archivo_${actividad.id}`;
                    link.click();
                  }}
                  className="text-green-600 underline"
                >
                  Descargar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sección de comentario del administrador */}
        {isAdmin && (
          <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Comentario del Administrador</h3>
            <textarea
              className="w-full border rounded-lg p-3"
              rows={4}
              value={respuestaAdmin}
              onChange={(e) => setRespuestaAdmin(e.target.value)}
              placeholder="Escribe tu comentario..."
            />
            <button
              onClick={handleEnviarRespuesta}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Enviar Respuesta
            </button>
          </div>
        )}

        {/* Mensaje */}
        {mensaje && (
          <div className="mt-4 px-8 text-center text-green-700 font-semibold">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiDetalleActividadLudica;
