import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaKey, FaEnvelope } from "react-icons/fa";
import logo from "../assets/logosst.jpg";

export default function VerifyCode() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  
  const apiVerify = import.meta.env.VITE_API_RESET; // Usaremos el mismo endpoint de reset
  const apiResend = import.meta.env.VITE_API_FORGOT; // Para reenviar código

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      // Si no hay email, redirigir a forgot-password
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  // Contador para reenviar código
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Solo aceptar números
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = numericValue;
    setCode(newCode);

    // Auto-focus siguiente input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Flechas para navegar
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    const newCode = [...code];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    
    setCode(newCode);
    
    // Focus en el último input con dato
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Código incompleto",
        text: "Por favor ingresa los 6 dígitos del código",
      });
      return;
    }

    setLoading(true);

    try {
      // Primero verificamos que el código sea válido
      const res = await fetch(apiVerify, {
        method: "POST",
        headers: { 
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          token: fullCode,
          contrasena: "temporal123" // Contraseña temporal solo para verificar
        }),
      });

      const data = await res.json();
      
      if (res.status === 400 && data.error?.includes('La contraseña debe')) {
        // Esto significa que el token ES VÁLIDO (falla en validación de contraseña)
        // Redirigir a la pantalla de restablecer contraseña
        navigate(`/reset-password?token=${fullCode}`);
      } else if (res.ok || (res.status === 400 && data.error === 'Token inválido')) {
        // Si la respuesta es ok o dice token inválido
        if (data.error === 'Token inválido') {
          Swal.fire({
            icon: "error",
            title: "Código inválido",
            text: "El código ingresado no es válido o ha expirado",
          });
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        } else {
          // Caso inesperado
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Error al verificar el código",
          });
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    
    try {
      const res = await fetch(apiResend, {
        method: "POST",
        headers: { 
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ correo_electronico: email }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Código reenviado",
          text: "Se ha enviado un nuevo código a tu correo",
          timer: 2000,
          showConfirmButton: false,
        });
        setResendCooldown(60); // 60 segundos de cooldown
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo reenviar el código",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center to-white">
      <div
        className="bg-white/80 backdrop-blur-md border border-gray-200 
        rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center relative"
      >
        
        <button
          onClick={() => navigate("/forgot-password")}
          className="absolute top-6 left-6 text-gray-500 hover:text-black transition flex items-center gap-2 text-sm"
        >
          <FaArrowLeft />
          Volver
        </button>

        <div className="flex justify-center mb-6 mt-4">
          <img
            src={logo}
            alt="Logo SST"
            className="w-28 h-28 rounded-full object-cover shadow-md border border-gray-300"
          />
        </div>

        <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">
          Verificar Código
        </h2>
        
        <div className="flex items-center gap-2 mb-4">
          <FaEnvelope className="text-gray-500" />
          <p className="text-gray-600 text-sm">{email}</p>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">
          Ingresa el código de 6 dígitos que enviamos a tu correo
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Inputs del código */}
          <div className="flex justify-center gap-3 mb-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Botón de verificar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verificando...
              </>
            ) : (
              <>
                <FaKey />
                Verificar código
              </>
            )}
          </button>
        </form>

        {/* Reenviar código */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm mb-2">
            ¿No recibiste el código?
          </p>
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || loading}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 
              ? `Reenviar código en ${resendCooldown}s`
              : "Reenviar código"
            }
          </button>
        </div>

        {/* Volver al login */}
        <div className="text-center mt-4">
          <span 
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-black transition cursor-pointer text-sm underline"
          >
            ← Volver al inicio de sesión
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-8">v1.0.0</p>
      </div>
    </div>
  );
}