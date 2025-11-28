import React, { useState, useEffect } from "react";
import axios from "axios";
import ActualizarUsuarioModal from "./Actualizarusuarios";
const API_BASE = "http://127.0.0.1:8000";

interface Empresa {
  id_empresa: number;
  nombre: string;
  direccion: string;
}

interface Area {
  id_area: number;
  nombre_area: string;
  descripcion: string;
}

interface Usuario {
  id: number;
  idArea: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  empresa?: Empresa;
  area?: Area;
}

const AdmUsuariosCompleto: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioToken | null>(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;
  const [refreshing, setRefreshing] = useState(false);

  const apiListar = import.meta.env.VITE_API_LISTARUSUARIOS;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARUSUARIO;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiBulk = import.meta.env.VITE_API_BULK;

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1f2937',
    });
  };

  const obtenerUsuarios = async (id_empresa?: number, showLoading: boolean = true) => {
    const empresaId = id_empresa || usuarioLogueado?.id_empresa;
    if (!empresaId) {
      showToast("error", "No se encontró la empresa del usuario");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "Usuario no autenticado");
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const base = apiListar.endsWith("/") ? apiListar : `${apiListar}/`;
      const res = await fetch(`${base}${empresaId}`, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // 🔹 FILTRAR SOLO USUARIOS DE LA MISMA EMPRESA
      const usuariosFiltrados = Array.isArray(data.datos) 
        ? data.datos.filter((usuario: Usuario) => 
            Number(usuario.idEmpresa) === Number(empresaId)
          )
        : [];
      
      setUsuarios(usuariosFiltrados);
      
      if (!showLoading) {
        showToast("success", "Lista actualizada");
      }
    } catch (error) {
      console.error(error);
      alert("Error guardando la huella: " + error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async () => {
    if (!idUsuario) return alert("Ingresa el ID del usuario");
    setLoading(true);
    setMensajeGuardar("");
    setResultadoVerificar("");
    try {
      const res = await axios.post(`${API_BASE}/huella/verificar`, { id_usuario: idUsuario });
      setResultadoVerificar(res.data.resultado);
      setScore(res.data.score);
      setCalidad(res.data.calidad);
    } catch (error) {
      console.error(error);
      alert("Error verificando la huella: " + error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCalidadColor = (calidad) => {
    if (!calidad) return "text-gray-600";
    if (calidad >= 80) return "text-green-600";
    if (calidad >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // 🔹 VERIFICAR SI EL USUARIO ES SG-SST
  const esSGSST = () => {
    return usuario?.cargo === "SG-SST";
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Tarjeta de Perfil del Usuario */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-white"
                alt="Avatar"
              />
            </div>
            <h2 className="text-3xl font-bold text-center">Perfil de Usuario</h2>
            <p className="text-blue-100 text-center mt-2">Sistema de Gestión Biométrica</p>
          </div>

          {/* Información del Usuario */}
          <div className="mt-20 px-6 pb-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{usuario.nombre} {usuario.apellido}</h2>
              <p className="text-gray-500 text-lg">@{usuario.nombreUsuario}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                esSGSST() 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
                {usuario.cargo}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-gray-600 font-semibold mb-2">Información Personal</label>
                  <div className="space-y-2">
                    <p><span className="font-medium text-gray-700">Correo:</span> {usuario.correoElectronico}</p>
                    <p><span className="font-medium text-gray-700">Cargo:</span> {usuario.cargo}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-gray-600 font-semibold mb-2">Información Laboral</label>
                  <div className="space-y-2">
                    <p><span className="font-medium text-gray-700">Empresa:</span> {usuario.empresa?.nombre || "No asignada"}</p>
                    <p><span className="font-medium text-gray-700">Área:</span> {usuario.area?.nombre_area || "No asignada"}</p>
                    <p><span className="font-medium text-gray-700">ID Usuario:</span> {usuario.id}</p>
                  </div>
                </div>
              </div>

              {/* 🔹 GESTIÓN DE HUELLAS - SOLO PARA SG-SST */}
              {esSGSST() ? (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <label className="block text-gray-600 font-semibold mb-4 text-lg">Gestión de Huellas Digitales</label>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="ID del usuario"
                        value={idUsuario}
                        onChange={(e) => setIdUsuario(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleGuardar}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {loading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                        )}
                        {loading ? "Procesando..." : "Guardar Huella"}
                      </button>
                      
                      <button
                        onClick={handleVerificar}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {loading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                        {loading ? "Verificando..." : "Verificar Huella"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // 🔹 CONTENIDO ALTERNATIVO PARA USUARIOS QUE NO SON SG-SST
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Perfil de Usuario</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Tu perfil está completo. Para gestionar huellas digitales, contacta al área de SG-SST.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <p className="text-blue-700 text-xs font-medium">
                        <strong>Tu rol:</strong> {usuario.cargo}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 🔹 RESULTADOS DE HUELLAS - SOLO PARA SG-SST */}
            {esSGSST() && (
              <div className="space-y-4 mb-6">
                {/* Resultado Guardar */}
                {mensajeGuardar && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <strong className="text-blue-800 block mb-1">{mensajeGuardar}</strong>
                        {urlHuella && (
                          <div className="mt-2">
                            <span className="text-blue-700 text-sm">URL de la huella:</span>
                            <a 
                              href={urlHuella} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800 underline text-sm break-all mt-1"
                            >
                              {urlHuella}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Resultado Verificar */}
                {resultadoVerificar && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="w-full">
                        <strong className="text-green-800 block mb-2">Resultado de Verificación</strong>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 font-medium">Estado</div>
                            <div className={`font-semibold ${resultadoVerificar === "Coincide" ? "text-green-600" : "text-red-600"}`}>
                              {resultadoVerificar}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 font-medium">Score</div>
                            <div className={`font-semibold ${getScoreColor(score)}`}>
                              {score !== null ? `${score}%` : "N/A"}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 font-medium">Calidad</div>
                            <div className={`font-semibold ${getCalidadColor(calidad)}`}>
                              {calidad !== null ? `${calidad}%` : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 🔹 LOADING INDICATOR - SOLO PARA SG-SST */}
            {esSGSST() && loading && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-700 font-medium">Procesando huella digital...</span>
                </div>
              </div>
            )}

            {/* Botón Editar Perfil */}
            <div className="text-center">
              <button
                onClick={() => setModalAbierto(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Actualización */}
      {modalAbierto && (
        <ActualizarUsuarioModal
          usuario={usuario}
          onClose={() => setModalAbierto(false)}
          onUpdate={handleActualizar}
        />
      )}
    </div>
  );
};

export default Perfil;