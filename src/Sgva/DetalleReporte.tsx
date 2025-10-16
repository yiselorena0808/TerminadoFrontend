import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CajaComentarios from "../components/CajaComentarios";

interface Reporte {
  id_reporte: number;
  id_usuario: number;
  nombre_usuario: string;
  cargo: string;
  cedula: string | number;
  fecha: string;
  lugar: string;
  descripcion: string;
  imagen: string | null;
  archivos: string | null;
  estado: string;
  comentario?: string;
}

const DetalleReporte: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reporte = location.state as Reporte;

  if (!reporte) return <p className="p-4">No hay datos para mostrar.</p>;

  const [form, setForm] = useState<Reporte>({
    ...reporte,
    comentario: reporte.comentario || "",
  });

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleString("es-CO");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-4xl font-bold">Detalle del Reporte</h2>
            <p className="text-blue-100 text-lg">
              Usuario: {form.nombre_usuario}
            </p>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Usuario
              </h3>
              <p>
                <strong>Nombre:</strong> {form.nombre_usuario}
              </p>
              <p>
                <strong>Cargo:</strong> {form.cargo}
              </p>
              <p>
                <strong>Cédula:</strong> {form.cedula}
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles del Reporte
              </h3>
              <p>
                <strong>Fecha:</strong> {formatFecha(form.fecha)}
              </p>
              <p>
                <strong>Lugar:</strong> {form.lugar}
              </p>
              <p>
                <strong>Estado actual:</strong> {form.estado}
              </p>

              <div className="mt-2">
                {form.imagen ? (
                  <a
                    href={form.imagen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                  >
                    Ver Imagen
                  </a>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay imagen adjunta
                  </p>
                )}
              </div>

              <div className="mt-2">
                {form.archivos ? (
                  <a
                    href={form.archivos}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                  >
                    Ver Archivo
                  </a>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay archivo adjunto
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">
                Descripción
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {form.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            💬 Comentarios del Administrador
          </h3>

          <CajaComentarios idReporte={form.id_reporte} />
        </div>
      </div>
    </div>
  );
};

export default DetalleReporte;
