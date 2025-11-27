import React, { useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Fingerprint, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import Swal from 'sweetalert2';
import CajaComentarios from "../components/CajaComentarios";

const API_BASE = "http://127.0.0.1:8000";
const BACKEND_BASE = "https://unreproaching-rancorously-evelina.ngrok-free.dev";

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

interface HuellaResult {
  resultado: string;
  score: number;
  calidad: number;
  template?: string;
  image?: string; 
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
  const [resultadoVerificar, setResultadoVerificar] = useState<HuellaResult | null>(null);
  const [huellaImage, setHuellaImage] = useState<string | null>(null);

  if (!reporte) return <p className="p-4">No hay datos para mostrar.</p>;

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleString("es-CO");
  };

  const verificarHuella = async () => {
    if (!form.id_usuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario no encontrado',
        text: 'No se encontró ID de usuario para verificar.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setLoading(true);
    setResultadoVerificar(null);
    setHuellaImage(null);

    // Mostrar alerta de carga
    Swal.fire({
      title: 'Verificando Huella',
      text: 'Por favor coloque su dedo en el sensor...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await axios.post(`${API_BASE}/huella/verificar`, {
        id_usuario: form.id_usuario,
      });

      const resultado: HuellaResult = res.data;
      setResultadoVerificar(resultado);

      if (resultado.image) {
        setHuellaImage(resultado.image);
      } else {
        // Crear una imagen placeholder de huella
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fondo
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(0, 0, 200, 200);
          
          // Patrón de huella simulado
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 2;
          for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.arc(100, 100, 20 + i * 8, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          setHuellaImage(canvas.toDataURL());
        }
      }

      // Cerrar alerta de carga
      Swal.close();

      if (resultado.resultado === "Coincide") {
        // Mostrar resultado exitoso
        await Swal.fire({
          icon: 'success',
          title: '¡Huella Verificada!',
          html: `
            <div class="text-center">
              <div class="text-green-500 text-6xl mb-4">✓</div>
              <p class="text-lg font-semibold mb-2">Coincidencia encontrada</p>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="text-center">
                  <p class="text-sm text-gray-600">Score</p>
                  <p class="text-2xl font-bold text-green-600">${resultado.score}%</p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-600">Calidad</p>
                  <p class="text-2xl font-bold ${resultado.calidad >= 60 ? 'text-green-600' : 'text-yellow-600'}">${resultado.calidad}%</p>
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Actualizar Estado',
          cancelButtonText: 'Cerrar',
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#6b7280'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await actualizarEstadoReporte();
          }
        });

      } else {
        // Mostrar resultado fallido
        await Swal.fire({
          icon: 'error',
          title: 'Huella No Coincide',
          html: `
            <div class="text-center">
              <div class="text-red-500 text-6xl mb-4">✗</div>
              <p class="text-lg font-semibold mb-2">No se encontró coincidencia</p>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="text-center">
                  <p class="text-sm text-gray-600">Score</p>
                  <p class="text-2xl font-bold text-red-600">${resultado.score}%</p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-600">Calidad</p>
                  <p class="text-2xl font-bold ${resultado.calidad >= 60 ? 'text-green-600' : 'text-yellow-600'}">${resultado.calidad}%</p>
                </div>
              </div>
            </div>
          `,
          confirmButtonColor: '#ef4444'
        });
      }

    } catch (error: any) {
      Swal.close();
      
      console.error("❌ Error verificando huella:", error);
      
      let errorMessage = "Error desconocido";
      if (error.response) {
        errorMessage = error.response.data?.error || error.message;
      } else if (error.request) {
        errorMessage = "No se pudo conectar al servidor de huellas";
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error de Verificación',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      });
    }

    setLoading(false);
  };

  const actualizarEstadoReporte = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sesión Expirada',
        text: 'Por favor inicie sesión nuevamente',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    Swal.fire({
      title: 'Actualizando Estado...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const updateRes = await fetch(
        `${BACKEND_BASE}/actualizarReporte/${form.id_reporte}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            estado: "Aprobado"
          }),
        }
      );

      if (updateRes.ok) {
        const data = await updateRes.json();
        setForm((prev) => ({ ...prev, estado: "Aprobado" }));
        
        Swal.fire({
          icon: 'success',
          title: '¡Estado Actualizado!',
          text: 'El reporte ha sido aprobado exitosamente',
          confirmButtonColor: '#10b981'
        });
      } else {
        const errorData = await updateRes.json();
        throw new Error(errorData.error || "Error actualizando estado");
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Actualizar',
        text: error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="absolute inset-0 backdrop-blur-sm bg-blue-50/30"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        {/* DETALLE DEL REPORTE */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Fingerprint className="w-8 h-8" />
              <h2 className="text-4xl font-bold">Detalle del Reporte</h2>
            </div>
            <p className="text-blue-100 text-lg">Usuario: {form.nombre_usuario}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="bg-blue-500 px-3 py-1 rounded-full">ID Reporte: {form.id_reporte}</span>
              <span className="bg-blue-500 px-3 py-1 rounded-full">ID Usuario: {form.id_usuario}</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Información del Usuario</h3>
              <div className="space-y-3 mt-4">
                <p><strong className="text-gray-700">Nombre:</strong> <span className="text-gray-900">{form.nombre_usuario}</span></p>
                <p><strong className="text-gray-700">Cargo:</strong> <span className="text-gray-900">{form.cargo}</span></p>
                <p><strong className="text-gray-700">Cédula:</strong> <span className="text-gray-900">{form.cedula}</span></p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Detalles del Reporte</h3>
              <div className="space-y-3 mt-4">
                <p><strong className="text-gray-700">Fecha:</strong> <span className="text-gray-900">{formatFecha(form.fecha)}</span></p>
                <p><strong className="text-gray-700">Lugar:</strong> <span className="text-gray-900">{form.lugar}</span></p>
                <p><strong className="text-gray-700">Estado:</strong> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(form.estado)}`}>
                    {form.estado}
                  </span>
                </p>

                <div className="flex gap-2 mt-4">
                  {form.imagen && (
                    <a href={form.imagen} target="_blank" rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      📷 Ver Imagen
                    </a>
                  )}
                  {form.archivos && (
                    <a href={form.archivos} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      📄 Ver Archivo
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-line mt-4 leading-relaxed">{form.descripcion}</p>
            </div>
          </div>
        </div>

        {/* VERIFICACIÓN DE HUELLA */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-800">Verificación Biométrica</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Información de Verificación</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Reporte ID:</strong> {form.id_reporte}</p>
                  <p><strong>Usuario ID:</strong> {form.id_usuario}</p>
                  <p><strong>Servidor Huellas:</strong> {API_BASE}</p>
                </div>
              </div>

              <button
                onClick={verificarHuella}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    Verificar Huella
                  </>
                )}
              </button>
            </div>

            {/* VISUALIZACIÓN DE HUELLA */}
            <div className="space-y-4">
              | {huellaImage && (
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Huella Capturada</h4>
                <div className="bg-gray-100 rounded-xl p-4 border-2 border-dashed border-gray-300">
                  <img
                    src={huellaImage.startsWith("data:") ? huellaImage : `data:image/png;base64,${huellaImage}`}
                    alt="Huella digital capturada"
                    className="mx-auto max-w-full h-40 object-contain rounded-lg"
                  />
                </div>
                </div>
              )}

              {/* RESULTADOS */}
              {resultadoVerificar && (
                <div className={`p-4 rounded-xl border-2 ${
                  resultadoVerificar.resultado === "Coincide" 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {resultadoVerificar.resultado === "Coincide" ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <h4 className={`font-bold text-lg ${
                      resultadoVerificar.resultado === "Coincide" ? "text-green-700" : "text-red-700"
                    }`}>
                      {resultadoVerificar.resultado === "Coincide" ? "✓ Coincide" : "✗ No Coincide"}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Score</p>
                      <p className={`text-2xl font-bold ${
                        resultadoVerificar.score >= 80 ? "text-green-600" : 
                        resultadoVerificar.score >= 60 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {resultadoVerificar.score}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Calidad</p>
                      <p className={`text-2xl font-bold ${
                        resultadoVerificar.calidad >= 60 ? "text-green-600" : "text-yellow-600"
                      }`}>
                        {resultadoVerificar.calidad}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COMENTARIOS */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">💬 Comentarios del Administrador</h3>
          <CajaComentarios idReporte={form.id_reporte} backendBase={BACKEND_BASE} />
        </div>
      </div>
    </div>
  );
};

export default DetalleReporte;