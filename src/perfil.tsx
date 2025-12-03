import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import ActualizarUsuarioModal from "./Admin/Actualizarusuarios";

const API_BASE = "http://127.0.0.1:8000";
const API_HUELLA = "https://noncultured-unconsentient-talon.ngrok-free.dev";

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

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idUsuario, setIdUsuario] = useState("");
  const [mensajeGuardar, setMensajeGuardar] = useState("");
  const [urlHuella, setUrlHuella] = useState("");
  const [resultadoVerificar, setResultadoVerificar] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [calidad, setCalidad] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // NUEVOS ESTADOS PARA FACE ID
  const [loadingFace, setLoadingFace] = useState(false);
  const [mensajeFace, setMensajeFace] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<"register" | "verify">("register");

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    if (datos) {
      const usuarioData = JSON.parse(datos);
      setUsuario(usuarioData);
      setIdUsuario(usuarioData.id.toString());
    }
  }, []);

  const handleActualizar = (usuarioActualizado: Usuario) => {
    if (!usuario) return;
    const nuevoUsuario = { ...usuario, ...usuarioActualizado };
    setUsuario(nuevoUsuario);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    
    // SweetAlert para éxito en actualización
    Swal.fire({
      title: "¡Perfil actualizado!",
      text: "Los cambios se han guardado correctamente.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar"
    });
  };

  const handleGuardar = async () => {
    if (!idUsuario) {
      Swal.fire({
        title: "Campo requerido",
        text: "Por favor ingresa el ID del usuario",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar"
      });
      return;
    }
    
    setLoading(true);
    setMensajeGuardar("");
    setResultadoVerificar("");
    
    try {
      const response = await fetch(`${API_HUELLA}/huella/guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ id_usuario: idUsuario }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || "Error en la solicitud");
      }

      const data = await response.json();
      setMensajeGuardar(data.mensaje);
      setUrlHuella(data.url);
      
      // SweetAlert para éxito en guardado
      Swal.fire({
        title: "¡Huella guardada!",
        text: data.mensaje,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar"
      });
      
    } catch (error: any) {
      console.error(error);
      
      // SweetAlert para error
      Swal.fire({
        title: "Error al guardar huella",
        text: error.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async () => {
    if (!idUsuario) {
      Swal.fire({
        title: "Campo requerido",
        text: "Por favor ingresa el ID del usuario",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar"
      });
      return;
    }
    
    setLoading(true);
    setMensajeGuardar("");
    setResultadoVerificar("");
    
    try {
      const response = await fetch(`${API_HUELLA}/huella/verificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ id_usuario: idUsuario }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || "Error en la solicitud");
      }

      const data = await response.json();
      setResultadoVerificar(data.resultado);
      setScore(data.score);
      setCalidad(data.calidad);
      
      // SweetAlert para resultado de verificación
      if (data.resultado === "Coincide") {
        Swal.fire({
          title: "¡Huella verificada!",
          html: `
            <div style="text-align: left;">
              <p><strong>Estado:</strong> <span style="color: #28a745;">${data.resultado}</span></p>
              <p><strong>Score:</strong> ${data.score}%</p>
              <p><strong>Calidad:</strong> ${data.calidad}%</p>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#28a745",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          title: "Huella no coincide",
          html: `
            <div style="text-align: left;">
              <p><strong>Estado:</strong> <span style="color: #dc3545;">${data.resultado}</span></p>
              <p><strong>Score:</strong> ${data.score}%</p>
              <p><strong>Calidad:</strong> ${data.calidad}%</p>
            </div>
          `,
          icon: "warning",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
      }
      
    } catch (error: any) {
      console.error(error);
      
      // SweetAlert para error
      Swal.fire({
        title: "Error al verificar huella",
        text: error.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 NUEVAS FUNCIONES PARA FACE ID
  const captureFaceImage = (): string | null => {
    const imageSrc = webcamRef.current?.getScreenshot();
    return imageSrc || null;
  };

  const handleOpenCamera = (mode: "register" | "verify") => {
    setCameraMode(mode);
    setShowCamera(true);
    setMensajeFace("");
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setMensajeFace("");
  };

  const handleCaptureFace = async () => {
    const imageSrc = captureFaceImage(); 
    if (!imageSrc) {
      Swal.fire({
        title: "Error",
        text: "No se pudo capturar la imagen",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    setLoadingFace(true);
    try {
      const base64Data = imageSrc.split(',')[1]; 
      
      const formData = new FormData();
      formData.append('id_usuario', usuario!.id.toString());
      formData.append('image', base64Data); 

      const API_FACE = "http://127.0.0.1:8000";
      
      const response = await fetch(`${API_FACE}/face/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || "Error en el registro facial");
      }

      const data = await response.json();
      setMensajeFace(data.message || "Rostro registrado correctamente");
      
      // SweetAlert para éxito en registro facial
      Swal.fire({
        title: "¡Rostro registrado!",
        text: data.message || "Rostro registrado correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar"
      });
      
    } catch (error: any) {
      console.error('❌ Error:', error);
      setMensajeFace("Error: " + (error.message || "Error desconocido"));
      
      // SweetAlert para error en registro facial
      Swal.fire({
        title: "Error al registrar rostro",
        text: error.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoadingFace(false);
      setShowCamera(false);
    }
  };

  // Función para verificar rostro
  const handleVerifyFace = async () => {
    const imageSrc = captureFaceImage();
    if (!imageSrc) {
      Swal.fire({
        title: "Error",
        text: "No se pudo capturar la imagen",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    setLoadingFace(true);
    try {
      const base64Data = imageSrc.split(',')[1];
      const formData = new FormData();
      formData.append('image', base64Data);

      const API_FACE = "http://127.0.0.1:8000";
      const response = await fetch(`${API_FACE}/face/verify`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || "Error en la verificación facial");
      }

      const data = await response.json();

      if (data.verified) {
        Swal.fire({
          title: "¡Rostro verificado!",
          html: `
            <div style="text-align: left;">
              <p><strong>Usuario:</strong> ${data.user_name}</p>
              <p><strong>Confianza:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
              <p><strong>Mensaje:</strong> ${data.message}</p>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#28a745",
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          title: "Rostro no reconocido",
          text: data.message || "No se pudo verificar el rostro",
          icon: "warning",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error al verificar rostro",
        text: error.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setLoadingFace(false);
      setShowCamera(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCalidadColor = (calidad: number | null) => {
    if (!calidad) return "text-gray-600";
    if (calidad >= 80) return "text-green-600";
    if (calidad >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // 🔹 FUNCIÓN PARA VERIFICAR SI EL USUARIO TIENE ACCESO A GESTIÓN DE HUELLAS
  const tieneAccesoHuellas = () => {
    if (!usuario) return false;
    return usuario.cargo === "SG-SST";
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 🔹 MODAL DE CÁMARA PARA FACE ID */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {cameraMode === "register" ? "Registrar Rostro" : "Verificar Rostro"}
              </h3>
              <button
                onClick={handleCloseCamera}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <Webcam
              audio={false}
              height={300}
              screenshotFormat="image/jpeg"
              width={300}
              ref={webcamRef}
              videoConstraints={videoConstraints}
              className="rounded-lg w-full"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={cameraMode === "register" ? handleCaptureFace : handleVerifyFace}
                disabled={loadingFace}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
              >
                {loadingFace ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loadingFace ? "Procesando..." : cameraMode === "register" ? "Registrar Rostro" : "Verificar Rostro"}
              </button>
              <button
                onClick={handleCloseCamera}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Tarjeta de Perfil del Usuario */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 p-6 text-white relative">
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
                usuario.cargo === "SG-SST" 
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

              {/* Gestión de Huellas - SOLO PARA SG-SST */}
              {tieneAccesoHuellas() ? (
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
                // Mensaje para usuarios que NO son SG-SST
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Gestión de Huellas Digitales</h3>
                    <p className="text-gray-500 text-sm">
                      Esta funcionalidad está disponible exclusivamente para el personal del área de SG-SST.
                    </p>
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-700 text-xs">
                        <strong>Tu cargo:</strong> {usuario.cargo}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 🔹 NUEVA SECCIÓN: RECONOCIMIENTO FACIAL (PARA TODOS LOS USUARIOS) */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <label className="block text-gray-600 font-semibold mb-4 text-lg">Reconocimiento Facial</label>
              
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    Registra o verifica tu rostro usando la cámara de tu dispositivo
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleOpenCamera("register")}
                    disabled={loadingFace}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Registrar Rostro
                  </button>
                  
                  <button
                    onClick={() => handleOpenCamera("verify")}
                    disabled={loadingFace}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verificar Rostro
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados de Huellas - SOLO SE MUESTRA SI TIENE ACCESO */}
            {tieneAccesoHuellas() && (
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

            {/* 🔹 RESULTADOS DE FACE ID (PARA TODOS LOS USUARIOS) */}
            {mensajeFace && (
              <div className={`border-l-4 p-4 rounded-r-lg mb-6 ${
                mensajeFace.includes("✅") || mensajeFace.includes("éxito") || mensajeFace.includes("Bienvenido")
                  ? "bg-green-50 border-green-500" 
                  : mensajeFace.includes("❌") || mensajeFace.includes("Error") || mensajeFace.includes("reconocido")
                  ? "bg-red-50 border-red-500"
                  : "bg-purple-50 border-purple-500"
              }`}>
                <div className="flex items-start">
                  <svg className={`w-5 h-5 mt-0.5 mr-3 ${
                    mensajeFace.includes("✅") || mensajeFace.includes("éxito") || mensajeFace.includes("Bienvenido")
                      ? "text-green-500" 
                      : mensajeFace.includes("❌") || mensajeFace.includes("Error") || mensajeFace.includes("reconocido")
                      ? "text-red-500"
                      : "text-purple-500"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong className={`block ${
                      mensajeFace.includes("✅") || mensajeFace.includes("éxito") || mensajeFace.includes("Bienvenido")
                        ? "text-green-800" 
                        : mensajeFace.includes("❌") || mensajeFace.includes("Error") || mensajeFace.includes("reconocido")
                        ? "text-red-800"
                        : "text-purple-800"
                    }`}>
                      {mensajeFace}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator - SOLO SE MUESTRA SI TIENE ACCESO */}
            {tieneAccesoHuellas() && loading && (
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
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center"
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