import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../assets/logosst.jpg";

const Login: React.FC = () => {
  const [correo_electronico, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const apiLogin = import.meta.env.VITE_API_LOGIN;

  const Enviar = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch(apiLogin, {
        method: "POST",
        headers: {"ngrok-skip-browser-warning": "true","Content-Type": "application/json" },
        body: JSON.stringify({ correo_electronico, contrasena }),
      });

      const data = await res.json();
      const mensaje = data.mensaje || data.msj || "Error de correo o contraseña.";

      if (!res.ok || mensaje !== "Login correcto") {
        Swal.fire({ icon: "error", title: "Error", text: mensaje });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("auth", "true");
      if (data.user?.idEmpresa) {
  localStorage.setItem("idEmpresa", data.user.idEmpresa.toString());
}
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
      title: "Inicio de sesión exitoso",
      text: "Bienvenido al Sistema SST",
      timer: 1800,
      showConfirmButton: false,
    }).then(() => {
      const rutaInicial = obtenerRutaSegunRol(data.user.cargo);
      navigate(rutaInicial, { replace: true });
    });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center to-white"
    >
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
              onClick={() => navigate("/forgot")}
              className="cursor-pointer hover:text-black underline"
            >
              ¿Olvidó su contraseña?
            </span>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="accent-black" />
              <label>Recordar sesión</label>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-400 text-white py-2.5 rounded-lg font-semibold shadow-md transition"
          >
            Iniciar Sesión
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

