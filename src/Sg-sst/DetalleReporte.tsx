import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Fingerprint, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import Swal from 'sweetalert2';
import CajaComentarios from "../components/CajaComentarios";

const API_BASE = "https://noncultured-unconsentient-talon.ngrok-free.dev";
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

interface UsuarioLogueado {
  id: number;
  nombre: string;
  cargo: string;
  nombreUsuario: string;
}

interface HuellaResult {
  resultado: string;
  score: number;
  calidad: number;
}

const DetalleReporte: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reporte = location.state as Reporte;

  const [form, setForm] = useState<Reporte>({
    ...reporte,
    comentario: reporte?.comentario || "",
  });

  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioLogueado | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultadoVerificar, setResultadoVerificar] = useState<HuellaResult | null>(null);

  useEffect(() => {
    // Obtener usuario logueado desde localStorage
    const datosUsuario = localStorage.getItem("usuario");
    if (datosUsuario) {
      try {
        const usuarioData = JSON.parse(datosUsuario);
        setUsuarioLogueado({
          id: usuarioData.id,
          nombre: usuarioData.nombre,
          cargo: usuarioData.cargo,
          nombreUsuario: usuarioData.nombreUsuario
        });
      } catch (error) {
        console.error("Error al parsear usuario del localStorage:", error);
      }
    }
  }, []);

  if (!reporte) return <p className="p-4">No hay datos para mostrar.</p>;

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    return d.toLocaleString("es-CO");
  };

  const verificarHuella = async () => {
    if (!usuarioLogueado?.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario no encontrado',
        text: 'No se encontró información del usuario logueado. Por favor, inicie sesión nuevamente.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setLoading(true);
    setResultadoVerificar(null);

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
        const res = await fetch(`${API_BASE}/huella/verificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_usuario: usuarioLogueado.id
        })
      });
  if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error en el servidor de huellas");
      }

      const resultado: HuellaResult = await res.json();
      setResultadoVerificar(resultado);

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
              <p class="text-sm text-gray-600 mb-4">Usuario verificado: <strong>${usuarioLogueado.nombre}</strong></p>
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
          confirmButtonText: 'Aprobar Reporte',
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
              <p class="text-sm text-gray-600 mb-4">Usuario intentado: <strong>${usuarioLogueado.nombre}</strong></p>
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
              <p class="text-sm text-gray-500 mt-4">
                Está verificando su propia huella como administrador. 
                Asegúrese de usar el mismo dedo registrado en su perfil.
              </p>
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
        errorMessage = error.response.data?.detail || error.response.data?.error || error.message;
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCalidadColor = (calidad: number) => {
    if (calidad >= 80) return "text-green-600";
    if (calidad >= 60) return "text-yellow-600";
    return "text-red-600";
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
            <p className="text-blue-100 text-lg">Reportante: {form.nombre_usuario}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="bg-blue-500 px-3 py-1 rounded-full">ID Reporte: {form.id_reporte}</span>
              <span className="bg-blue-500 px-3 py-1 rounded-full">ID Usuario Reportante: {form.id_usuario}</span>
              {usuarioLogueado && (
                <span className="bg-purple-500 px-3 py-1 rounded-full">Administrador: {usuarioLogueado.nombre}</span>
              )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Información del Reportante</h3>
              <div className="space-y-3 mt-4">
                <p><strong className="text-gray-700">Nombre:</strong> <span className="text-gray-900">{form.nombre_usuario}</span></p>
                <p><strong className="text-gray-700">Cargo:</strong> <span className="text-gray-900">{form.cargo}</span></p>
                <p><strong className="text-gray-700">Cédula:</strong> <span className="text-gray-900">{form.cedula}</span></p>
                <p><strong className="text-gray-700">ID Usuario:</strong> <span className="text-gray-900">{form.id_usuario}</span></p>
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
            <h3 className="text-2xl font-bold text-gray-800">Verificación Biométrica del Administrador</h3>
          </div>

          <div className="space-y-6">
            {/* Información de Verificación */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-3 text-lg">Información de Verificación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Reporte ID</p>
                  <p className="font-semibold text-gray-800">{form.id_reporte}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Reportante</p>
                  <p className="font-semibold text-gray-800">{form.nombre_usuario} (ID: {form.id_usuario})</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Administrador Verificador</p>
                  <p className="font-semibold text-gray-800">
                    {usuarioLogueado ? `${usuarioLogueado.nombre} (ID: ${usuarioLogueado.id})` : 'No identificado'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Servidor Huellas</p>
                  <p className="font-semibold text-gray-800 truncate text-xs">{API_BASE}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Se verificará la huella del <strong>administrador</strong> ({usuarioLogueado?.nombre}) 
                  para autorizar la aprobación del reporte, no la huella del reportante.
                </p>
              </div>
            </div>

            {/* Botón de Verificación */}
            <div className="text-center">
              <button
                onClick={verificarHuella}
                disabled={loading || !usuarioLogueado}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 font-semibold text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando Huella...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-6 h-6" />
                    {usuarioLogueado ? `Verificar Mi Huella (${usuarioLogueado.nombre})` : 'Cargando usuario...'}
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Verifique su huella digital como administrador para autorizar la aprobación de este reporte
              </p>
            </div>

            {/* Resultados */}
            {resultadoVerificar && (
              <div className={`p-6 rounded-xl border-2 ${
                resultadoVerificar.resultado === "Coincide" 
                  ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300" 
                  : "bg-gradient-to-r from-red-50 to-red-100 border-red-300"
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  {resultadoVerificar.resultado === "Coincide" ? (
                    <>
                      <CheckCircle className="w-10 h-10 text-green-600" />
                      <div>
                        <h4 className="text-2xl font-bold text-green-700">✓ Huella Verificada</h4>
                        <p className="text-green-600">Administrador verificado: <strong>{usuarioLogueado?.nombre}</strong></p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-10 h-10 text-red-600" />
                      <div>
                        <h4 className="text-2xl font-bold text-red-700">✗ Huella No Coincide</h4>
                        <p className="text-red-600">Administrador no verificado: <strong>{usuarioLogueado?.nombre}</strong></p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Estado</p>
                    <p className={`text-2xl font-bold ${
                      resultadoVerificar.resultado === "Coincide" ? "text-green-600" : "text-red-600"
                    }`}>
                      {resultadoVerificar.resultado}
                    </p>
                  </div>
                  
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Score de Similitud</p>
                    <p className={`text-3xl font-bold ${getScoreColor(resultadoVerificar.score)}`}>
                      {resultadoVerificar.score}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${getScoreColor(resultadoVerificar.score).replace('text-', 'bg-')}`}
                        style={{ width: `${resultadoVerificar.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Calidad de Captura</p>
                    <p className={`text-3xl font-bold ${getCalidadColor(resultadoVerificar.calidad)}`}>
                      {resultadoVerificar.calidad}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${getCalidadColor(resultadoVerificar.calidad).replace('text-', 'bg-')}`}
                        style={{ width: `${resultadoVerificar.calidad}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Mensaje de Acción */}
                {resultadoVerificar.resultado === "Coincide" && (
                  <div className="mt-6 text-center">
                    <p className="text-green-700 font-semibold mb-3">
                      ✓ La huella del administrador coincide. Puede proceder a aprobar el reporte.
                    </p>
                    <button
                      onClick={actualizarEstadoReporte}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Aprobar Reporte
                    </button>
                  </div>
                )}
              </div>
            )}
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