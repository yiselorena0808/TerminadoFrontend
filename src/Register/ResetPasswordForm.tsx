import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiReset = import.meta.env.VITE_API_RESET;

  // Verificar si hay token
  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "El enlace de recuperación no es válido o ha expirado",
      }).then(() => {
        navigate("/forgot-password");
      });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token faltante",
        text: "El enlace no contiene un token válido",
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
          text: data.message,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || data.message || "Error al restablecer contraseña",
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/512/185/desktop-wallpaper-business-office-office-desk.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Enlace Inválido</h2>
          <p className="text-white mb-6">El enlace de recuperación no es válido o ha expirado.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/512/185/desktop-wallpaper-business-office-office-desk.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* NAV */}
      <nav className="bg-[#142943] shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-8 h-14 items-center">
            <Link to="/" className="px-4 py-2 font-medium text-sm text-white">
              Inicio
            </Link>
          </div>
        </div>
      </nav>

      {/* FORM */}
      <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Restablecer contraseña
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
              required
              minLength={8}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Guardar contraseña"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-white text-sm hover:underline">
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}