import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import Webcam from "react-webcam";
import logo from "../assets/logosst.jpg";

const Login: React.FC = () => {
  const [correo_electronico, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [loadingFace, setLoadingFace] = useState(false);
  const navigate = useNavigate();
  const apiLogin = import.meta.env.VITE_API_LOGIN;
  
  const API_BASE = "https://facialsst-production.up.railway.app";

  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "user",
  };

  const captureFaceImage = (): string | null => {
    const imageSrc = webcamRef.current?.getScreenshot();
    return imageSrc || null;
  };

  const guardarDatosUsuario = (data: any) => {
    // Guardar token
    localStorage.setItem("token", data.token);
    
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
      console.log("✅ userData guardado en localStorage:", data.user);
    }
    
    localStorage.setItem("usuario", JSON.stringify(data.user));
    localStorage.setItem("auth", "true");
    
    if (data.user?.idEmpresa) {
      localStorage.setItem("idEmpresa", data.user.idEmpresa.toString());
    }
  };

  const manejarLoginExitoso = (data: any, tipoLogin: string = "tradicional") => {
    console.log(`✅ Login ${tipoLogin} exitoso`);
    
    guardarDatosUsuario(data);
    
    const obtenerRutaSegunRol = (cargo: string) => {
      if (["superadmin", "SuperAdmin"].includes(cargo)) {
        return "/nav/admEmpresas";
      }
      if (["administrador", "Administrador"].includes(cargo)) {
        return "/nav/Admusuarios";
      }
      if (["SG-SST", "sg-sst"].includes(cargo)) {
        return "/nav/inicio";
      }
      return "/nav/inicioUser";
    };

    Swal.fire({
      icon: "success",
      title: `Login ${tipoLogin === "facial" ? "Facial " : ""}Exitoso`,
      text: `Bienvenido ${data.user.nombre} ${data.user.apellido || ''}`,
      timer: 1800,
      showConfirmButton: false,
    }).then(() => {
      const rutaInicial = obtenerRutaSegunRol(data.user.cargo);
      console.log(`📍 Redirigiendo a: ${rutaInicial}`);
      navigate(rutaInicial, { replace: true });
    });
  };

  const handleFaceLogin = async () => {
    const imageSrc = captureFaceImage();
    if (!imageSrc) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo capturar la imagen" });
      return;
    }

    setLoadingFace(true);
    try {
      console.log("📸 Imagen capturada, convirtiendo a Blob...");
      
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, "face-login.jpg");

      console.log('📤 Enviando verificación facial a FastAPI...');
      
      const API_FACE = "https://facialsst-production.up.railway.app";
      const faceResponse = await fetch(`${API_FACE}/face/login`, {
        method: 'POST',
        body: formData,
      });

      if (!faceResponse.ok) {
        const errorText = await faceResponse.text();
        throw new Error(`Error en reconocimiento: ${errorText}`);
      }

      const faceData = await faceResponse.json();
      console.log('🔑 Respuesta de reconocimiento facial:', faceData);

      if (faceData.authenticated && faceData.id_usuario) {
        console.log('✅ Rostro reconocido, ID usuario:', faceData.id_usuario);
        
        console.log('🔐 Obteniendo token JWT de Adonis...');
        
        const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/face-login`, { 
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          body: JSON.stringify({ 
            usuario_id: faceData.id_usuario 
          }),
        });

        console.log('📡 Respuesta login facial Adonis:', loginResponse.status);

        if (!loginResponse.ok) {
          const errorText = await loginResponse.text();
          throw new Error(`Error en login: ${errorText}`);
        }

        const loginData = await loginResponse.json();
        console.log('🎉 Login facial exitoso:', loginData);

        manejarLoginExitoso(loginData, "facial");

      } else {
        Swal.fire({ 
          icon: "error", 
          title: "Rostro no reconocido", 
          text: faceData.message || "No se pudo identificar tu rostro." 
        });
      }
    } catch (error: any) {
      console.error('❌ Error en login facial:', error);
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: error.message || "Error en el reconocimiento facial" 
      });
    } finally {
      setLoadingFace(false);
      setShowCamera(false);
    }
  };

  const Enviar = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch(apiLogin, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ correo_electronico, contrasena }),
      });

      const data = await res.json();
      const mensaje = data.mensaje || data.msj || "Error de correo o contraseña.";

      if (!res.ok || mensaje !== "Login correcto") {
        Swal.fire({ icon: "error", title: "Error", text: mensaje });
        return;
      }

      console.log("✅ Login tradicional exitoso:", data);
      
      manejarLoginExitoso(data, "tradicional");

    } catch (error) {
      console.error("❌ Error de conexión:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center to-white">
      
      {/* 🔹 Modal de Cámara para Face ID */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Iniciar Sesión con Rostro
              </h3>
              <button
                onClick={() => setShowCamera(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loadingFace}
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
                onClick={handleFaceLogin}
                disabled={loadingFace}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
              >
                {loadingFace ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    <FaCamera className="mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCamera(false)}
                disabled={loadingFace}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tarjeta de login */}
      <div
        className="bg-white/80 backdrop-blur-md border border-gray-200 
        rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo SST"
            className="w-28 h-28 rounded-full object-cover shadow-md border border-gray-300"
          />
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">
          Bienvenido
        </h2>
        <p className="text-gray-500 text-sm mb-8 text-center">
          Inicia sesión para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={Enviar} className="w-full space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo_electronico}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-700"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500 text-lg" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-700"
            />
          </div>

          {/* Recordar sesión y enlace */}
          <div className="flex justify-between text-sm text-gray-600">
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer hover:text-black underline"
            >
              ¿Olvidó su contraseña?
            </span>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="accent-black" />
              <label>Recordar sesión</label>
            </div>
          </div>

          {/* Botón Login Tradicional */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-400 text-white py-2.5 rounded-lg font-semibold shadow-md transition"
          >
            Iniciar Sesión
          </button>

          {/* 🔹 Separador */}
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* 🔹 Botón Login Facial */}
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-semibold shadow-md transition flex items-center justify-center"
          >
            <FaCamera className="mr-2" />
            Iniciar con Rostro
          </button>

          {/* Registro */}
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes una cuenta?{" "}
            <span
              onClick={() => navigate("/registro")}
              className="text-black font-semibold cursor-pointer hover:underline"
            >
              Regístrate ahora
            </span>
          </p>
        </form>

        {/* Versión */}
        <p className="text-xs text-gray-400 mt-8">v1.0.0</p>
      </div>
    </div>
  );
};

export default Login;