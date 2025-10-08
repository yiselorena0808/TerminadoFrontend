import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const apiReset = import.meta.env.VITE_API_RESET;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(apiReset, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nueva_contrasena: password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.message);
      } else {
        setMensaje(data.error);
      }
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
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
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Guardar contraseña
            </button>
          </form>

          {mensaje && (
            <p className="mt-4 text-center text-white font-medium">{mensaje}</p>
          )}
        </div>
      </div>
    </div>
  );
}
