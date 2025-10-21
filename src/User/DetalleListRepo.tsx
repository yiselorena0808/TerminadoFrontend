import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

interface Reporte {
  idReporte: number;
  idUsuario: number;
  nombreUsuario: string;
  cargo: string;
  cedula: string;
  fecha: string;
  lugar: string;
  descripcion: string;
  imagen: string | null;
  archivos: string | null;
  estado: string;
  comentario?: string;
}

const MiDetalleReporte: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reporte: Reporte | undefined = location.state as Reporte;

  const formatFechaForInput = (fecha: string) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [form, setForm] = useState<Reporte>({
    ...reporte!,
    fecha: formatFechaForInput(reporte!.fecha),
    comentario: reporte?.comentario || "",
  });

  if (!reporte) return <p className="p-4">No hay datos para mostrar.</p>;

  const guardarCambios = async () => {
    try {
      const apiActualizar = import.meta.env.VITE_API_ACTUALIZARREPORTE;
      const res = await fetch(`${apiActualizar}/${form.idReporte}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: form.estado,
          comentario: form.comentario,
        }),
      });
      if (res.ok) {
        alert("Estado y comentario actualizados correctamente");
        navigate(-1);
      } else {
        alert("Error al actualizar el reporte");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-4xl font-bold">Detalle del Reporte</h2>
            <p className="text-blue-100 text-lg">
              Usuario: {form.nombreUsuario}
            </p>
          </div>

          {/* Body */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Usuario
              </h3>
              <p>
                <strong>Nombre:</strong> {form.nombreUsuario}
              </p>
              <p>
                <strong>Cargo:</strong> {form.cargo}
              </p>
              <p>
                <strong>Cédula:</strong> {form.cedula}
              </p>
            </div>

            {/* Información del reporte */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles del Reporte
              </h3>
              <p>
                <strong>Fecha:</strong> {form.fecha}
              </p>
              <p>
                <strong>Lugar:</strong> {form.lugar}
              </p>
              <p>
                <strong>Estado actual:</strong> {form.estado}
              </p>

              {/* Imagen */}
              <div className="mt-2">
                {form.imagen ? (
                  <div className="flex gap-2">
                    <a
                      href={form.imagen}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                    >
                      Ver Imagen
                    </a>
                    <a
                      href={form.imagen}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`reporte_${form.idReporte}_imagen`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                    >
                      Descargar Imagen
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay imagen adjunta</p>
                )}
              </div>

              {/* Archivo */}
              <div className="mt-2">
                {form.archivos ? (
                  <div className="flex gap-2">
                    <a
                      href={form.archivos}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                    >
                      Ver Archivo
                    </a>
                    <a
                      href={form.archivos}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`reporte_${form.idReporte}_archivo`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                    >
                      Descargar Archivo
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay archivo adjunto</p>
                )}
              </div>
            </div>

            {/* Descripción */}
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

        {/* Card de Admin: Cambiar estado y comentario */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ⚙️ Gestión Administrador
          </h3>

          {/* Estado */}
          <label className="block text-gray-700 font-semibold mb-2">
            Cambiar Estado
          </label>
          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Revisado">Revisado</option>
            <option value="Finalizado">Finalizado</option>
          </select>

          {/* Comentario */}
          <label className="block text-gray-700 font-semibold mb-2">
            Agregar Comentario
          </label>
          <textarea
            value={form.comentario}
            onChange={(e) => setForm({ ...form, comentario: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 min-h-[100px] mb-4"
            placeholder="Escribe un comentario sobre el reporte..."
          />

          {/* Guardar */}
          <button
            onClick={guardarCambios}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            <Save className="w-5 h-5" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiDetalleReporte;
