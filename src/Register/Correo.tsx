import React, { useState } from "react";
import { Link } from "react-router-dom";

const Correo: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const apiForgot = import.meta.env.VITE_API_FORGOT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiForgot, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico: correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data);
        alert(data.error || "No se pudo enviar el correo");
        return;
      }

      alert(data.message || "Correo de recuperación enviado");
    } catch (err) {
      console.error("Error en fetch:", err);
      alert("Error de conexión con el servidor");
    }
  };

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
            <Link
              to="/registro"
              className="px-4 py-2 font-medium text-sm text-white"
            >
              Registrar usuario
            </Link>
          </div>
        </div>
      </nav>

      {/* FORM */}
      <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* IZQUIERDA */}
          <div className="md:w-1/2 bg-gradient-to-br from-[#1E3A5F] via-[#162a44] to-[#0F1C2E] text-white flex flex-col items-center justify-center p-8 relative">
            <div className="text-center space-y-4 z-10">
              <h2 className="text-3xl font-bold text-white">¿Olvidaste tu contraseña?</h2>
              <p className="text-gray-200 text-sm">
                Ingresa tu correo y recibirás un enlace para restablecerla.
              </p>
            </div>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
                alt="Recuperar contraseña"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DERECHA */}
          <div className="md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-6 text-white text-center">
                Recuperar contraseña
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#1E3A5F] text-white font-semibold hover:bg-[#142943] transition"
                >
                  Enviar enlace de recuperación
                </button>

                <p className="text-sm text-center text-gray-200">
                  ¿Ya lo recordaste?{" "}
                  <Link to="/" className="text-blue-400 hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Correo;
