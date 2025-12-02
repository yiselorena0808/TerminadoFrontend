import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logosst.jpg";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const apiReset = import.meta.env.VITE_API_RESET;

  useEffect(() => {
    if (!token || token.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: "El código de recuperación no es válido",
        background: '#f8f9fa',
        color: '#333',
      }).then(() => {
        navigate("/forgot-password");
      });
    }
  }, [token, navigate]);

  const validatePassword = (pass: string) => {
    const errors = [];
    
    if (pass.length < 8) errors.push("Mínimo 8 caracteres");
    if (!/[a-z]/.test(pass)) errors.push("Al menos una letra minúscula");
    if (!/[A-Z]/.test(pass)) errors.push("Al menos una letra mayúscula");
    if (!/[0-9]/.test(pass)) errors.push("Al menos un número");
    if (!/[^A-Za-z0-9]/.test(pass)) errors.push("Al menos un carácter especial");
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Código faltante",
        text: "No se encontró un código válido",
        background: '#f8f9fa',
        color: '#333',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Las contraseñas ingresadas deben ser iguales",
        background: '#f8f9fa',
        color: '#333',
      });
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        html: `<div class="text-left"><strong>La contraseña debe tener:</strong><br>• ${errors.join('<br>• ')}</div>`,
        background: '#f8f9fa',
        color: '#333',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiReset, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify({ 
          token, 
          contrasena: password
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Contraseña actualizada!",
          text: "Tu contraseña ha sido restablecida correctamente",
          timer: 3000,
          showConfirmButton: false,
          background: '#f8f9fa',
          color: '#333',
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "El código ha expirado o es inválido",
          background: '#f8f9fa',
          color: '#333',
        }).then(() => {
          navigate("/forgot-password");
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        background: '#f8f9fa',
        color: '#333',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Logo SST"
              className="w-24 h-24 rounded-full object-cover shadow-md border border-gray-300"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            Código Inválido
          </h2>
          
          <p className="text-gray-600 text-center mb-8">
            El código de recuperación no es válido o ha expirado.
          </p>
          
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition flex items-center justify-center gap-2"
          >
            Solicitar nuevo código
          </button>
          
          <div className="text-center mt-6">
            <span 
              onClick={() => navigate("/login")}
              className="text-gray-500 hover:text-black transition cursor-pointer text-sm underline"
            >
              ← Volver al inicio de sesión
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center relative">
        
        {/* Botón de volver */}
        <button
          onClick={() => navigate("/verify-code")}
          className="absolute top-6 left-6 text-gray-500 hover:text-black transition flex items-center gap-2 text-sm"
        >
          <FaArrowLeft />
          Volver
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo SST"
            className="w-24 h-24 rounded-full object-cover shadow-md border border-gray-300"
          />
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">
          Nueva Contraseña
        </h2>
        
        <p className="text-gray-500 text-sm mb-8 text-center">
          Ingresa y confirma tu nueva contraseña
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Nueva contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa nueva contraseña"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Indicadores de seguridad */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  Mínimo 8 caracteres
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                  Letra minúscula
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                  Letra mayúscula
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                  Número
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                  Carácter especial
                </span>
              </div>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Validación de coincidencia */}
            {confirmPassword && (
              <div className="mt-2">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {password === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Botón de guardar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Actualizando...
              </>
            ) : (
              "Guardar nueva contraseña"
            )}
          </button>
        </form>

        {/* Enlaces */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-500 text-sm">
            ¿Problemas con el código?
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Solicitar nuevo código
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <span 
              onClick={() => navigate("/login")}
              className="text-gray-500 hover:text-black transition cursor-pointer text-sm underline"
            >
              ← Volver al inicio de sesión
            </span>
          </div>
        </div>

        {/* Versión */}
        <p className="text-xs text-gray-400 mt-8">v1.0.0</p>
      </div>
    </div>
  );
}