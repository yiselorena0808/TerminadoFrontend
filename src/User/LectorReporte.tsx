import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileCheck, ArrowLeft, Trash2 } from "lucide-react";

interface Reporte {
  idReporte: number;
  idUsuario: number;
  nombreUsuario: string;
  cargo: string;
  cedula: string;
  fecha: string;
  lugar: string;
  descripcion: string;
  imagen: string;
  archivos: string;
  estado: string;
}

const LectorReporte: React.FC = () => {
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
  });

  if (!reporte) {
    return <p className="p-4">No hay datos para mostrar.</p>;
  }

  const API_URL = "https://backsst.onrender.com";

  const eliminarReporte = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este reporte?")) return;

    try {
      const res = await fetch(`${API_URL}/eliminarReporte/${form.idReporte}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("📥 Respuesta backend:", data);

      if (res.ok) {
        alert(data.msj || "Reporte eliminado correctamente.");
        navigate(-1);
      } else {
        alert(data.error || "No se pudo eliminar el reporte.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
      }}
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="text-4xl font-bold">📋 Detalle del Reporte</h2>
            <p className="text-blue-100 text-lg">ID #{form.idReporte}</p>
          </div>

          {/* Body */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Usuario
              </h3>
              <input
                type="text"
                value={form.nombreUsuario}
                onChange={(e) =>
                  setForm({ ...form, nombreUsuario: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                value={form.cedula}
                onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Información del reporte */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Detalles del Reporte
              </h3>
              <input
                type="datetime-local"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                value={form.estado || ""}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Seleccionar estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Revisado">Revisado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">
                Descripción
              </h3>
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
              />
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="bg-gray-50 px-10 py-6 flex flex-wrap gap-4 justify-end border-t">
            <button
              onClick={eliminarReporte}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition text-lg"
            >
              <Trash2 className="w-5 h-5" /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectorReporte;
