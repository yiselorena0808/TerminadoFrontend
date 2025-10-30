import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CajaComentarios from "../components/CajaComentarios";

interface Reporte {
  id_reporte: number;
  id_usuario: number;
  nombre_usuario: string;
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

const DetalleReporte: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reporte = location.state as Reporte;

  const [form, setForm] = useState<Reporte>({
    ...reporte,
    comentario: reporte?.comentario || "",
  });
  const [loading, setLoading] = useState(false);
  const [huellaFile, setHuellaFile] = useState<File | null>(null);
  const [huellaPreview, setHuellaPreview] = useState<string | null>(null);
  const [huellaSGVA, setHuellaSGVA] = useState<string | null>(null);

  if (!reporte) return <p className="p-4">No hay datos para mostrar.</p>;

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleString("es-CO");
  };

  const handleFileChange = (file: File) => {
    setHuellaFile(file);
    const reader = new FileReader();
    reader.onload = () => setHuellaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ---------- OBTENER HUELLA SGVA ----------
  useEffect(() => {
    const fetchHuellaSGVA = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible");

        const res = await fetch(
          `https://backsst.onrender.com/huella/${form.id_usuario}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const text = await res.text(); // si no es JSON, evitamos crash
          console.error("Error obteniendo huella SGVA:", text);
          return;
        }

        const data = await res.json();
        setHuellaSGVA(data.huella);
      } catch (err) {
        console.error("Error obteniendo huella SGVA:", err);
      }
    };

    fetchHuellaSGVA();
  }, [form.id_usuario]);

  // ---------- VERIFICAR HUELLA ----------
  const verificarHuella = async () => {
    if (!huellaFile) return alert("Seleccione un archivo de huella antes de verificar");
    if (!huellaSGVA) return alert("No se pudo obtener la huella SGVA");

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const huellaBase64 = (reader.result as string).split(",")[1];
        if (!huellaBase64) {
          setLoading(false);
          return alert("No se pudo leer la huella");
        }

        try {
          const res = await fetch(
            `http://127.0.0.1:5000/compare`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                t1: huellaBase64,
                t2: huellaSGVA,
              }),
            }
          );

          if (!res.ok) {
            const data = await res.json().catch(() => ({ error: "Error en servidor" }));
            alert(`Error: ${data.error}`);
            return;
          }

          const data = await res.json();
          setForm(prev => ({ ...prev, estado: data.estado }));
          alert(`Reporte ${data.estado} (score: ${data.score})`);
        } catch (err) {
          console.error("Error verificando huella:", err);
          alert("Error verificando huella");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(huellaFile);
    } catch (err) {
      console.error(err);
      alert("Error leyendo el archivo de huella");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        {/* Detalle del Reporte */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-4xl font-bold">Detalle del Reporte</h2>
            <p className="text-blue-100 text-lg">Usuario: {form.nombre_usuario}</p>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Información del Usuario</h3>
              <p><strong>Nombre:</strong> {form.nombre_usuario}</p>
              <p><strong>Cargo:</strong> {form.cargo}</p>
              <p><strong>Cédula:</strong> {form.cedula}</p>
            </div>

            {/* Detalles del Reporte */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Detalles del Reporte</h3>
              <p><strong>Fecha:</strong> {formatFecha(form.fecha)}</p>
              <p><strong>Lugar:</strong> {form.lugar}</p>
              <p><strong>Estado actual:</strong> {form.estado}</p>

              <div className="mt-2">
                {form.imagen ? (
                  <a href={form.imagen} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Ver Imagen</a>
                ) : (<p className="text-gray-500 italic">No hay imagen adjunta</p>)}
              </div>

              <div className="mt-2">
                {form.archivos ? (
                  <a href={form.archivos} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Ver Archivo</a>
                ) : (<p className="text-gray-500 italic">No hay archivo adjunto</p>)}
              </div>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-line">{form.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Verificar huella */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🔒 Verificar Huella SGVA</h3>
          <input type="file" accept="image/*" disabled={loading} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileChange(file); }} />
          {huellaPreview && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Vista previa:</p>
              <img src={huellaPreview} alt="Huella Preview" className="w-40 h-40 object-contain border rounded-md" />
            </div>
          )}
          <button onClick={verificarHuella} disabled={loading || !huellaFile} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? "Verificando..." : "Verificar Huella"}
          </button>
        </div>

        {/* Comentarios */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">💬 Comentarios del Administrador</h3>
          <CajaComentarios idReporte={form.id_reporte} />
        </div>
      </div>
    </div>
  );
};

export default DetalleReporte;
