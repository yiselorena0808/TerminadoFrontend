import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logosst.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiForgot = import.meta.env.VITE_API_FORGOT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(apiForgot, {
        method: "POST",
        headers: { 
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ correo_electronico: email }),
      });

      const data = await res.json();
      
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Código enviado",
          text: "Si el correo existe, se ha enviado un código de 6 dígitos a tu correo",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          // Redirigir a la pantalla de verificación de código
          navigate(`/verify-code?email=${encodeURIComponent(email)}`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al procesar la solicitud",
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
          onClick={() => navigate("/login")}
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
          Recuperar Contraseña
        </h2>
        <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">
          Ingresa tu correo electrónico para recibir un código de 6 dígitos
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando código...
              </>
            ) : (
              "Enviar código de verificación"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <span 
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-black transition cursor-pointer text-sm underline"
          >
            ¿Recordaste tu contraseña? Inicia sesión
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-8">v1.0.0</p>
      </div>
    </div>
  );
}