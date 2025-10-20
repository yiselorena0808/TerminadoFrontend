import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaHardHat } from "react-icons/fa";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo_electronico, contrasena }),
      });

      const data = await res.json();
      const mensaje = data.mensaje || data.msj || "Error desconocido";

      if (!res.ok || mensaje !== "Login correcto") {
        Swal.fire({ icon: "error", title: "Error", text: mensaje });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("auth", "true");

      if (data.user?.id_empresa) {
        localStorage.setItem("idEmpresa", data.user.id_empresa.toString());
      }

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al Sistema SST",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate("/nav/", { replace: true });
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
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 relative overflow-hidden">
      {/* Fondo decorativo profesional */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581093588401-22b4787fdda3?auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>

      {/* Capa azul suave transparente */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Contenedor principal */}
      <div className="relative z-10 flex flex-col md:flex-row w-11/12 md:w-4/5 lg:w-3/4 rounded-3xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20">
        {/* Panel izquierdo - Bienvenida */}
        <div className="hidden md:flex flex-col justify-center w-1/2 bg-[#1E3A5F] p-10 text-white">
          <div className="flex items-center mb-5">
            <FaHardHat className="text-yellow-400 text-5xl mr-3" />
            <h1 className="text-3xl font-bold tracking-wide">Sistema SST</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-4 leading-snug">
            Bienvenido al Sistema Integral de Seguridad y Salud en el Trabajo
          </h2>

          <p className="text-sm text-gray-200 leading-relaxed mb-6">
            Este aplicativo permite gestionar, registrar y analizar todos los
            procesos relacionados con la seguridad y salud laboral de los
            colaboradores. Facilita la identificación de riesgos, reportes de
            incidentes, capacitaciones y planes de mejora para garantizar un
            entorno laboral seguro y saludable.
          </p>

          <p className="text-sm text-blue-100 border-t border-blue-300/30 pt-4">
            👷‍♀️ <span className="font-semibold">Nuestra meta:</span> proteger el bienestar de cada trabajador mediante la prevención y la cultura de seguridad.
          </p>
        </div>

        {/* Panel derecho - Login */}
        <div className="w-full md:w-1/2 bg-white p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#1E3A5F]">
            Iniciar sesión
          </h2>

          <form onSubmit={Enviar} className="flex flex-col space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="usuario@empresa.com"
                value={correo_electronico}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
              />
            </div>

            <div className="flex justify-between text-sm text-blue-700 font-medium">
              <span
                onClick={() => navigate("/forgot")}
                className="cursor-pointer hover:text-blue-900 underline"
              >
                ¿Olvidaste tu contraseña?
              </span>
              <span
                onClick={() => navigate("/registro")}
                className="cursor-pointer hover:text-blue-900 underline"
              >
                Registrarse
              </span>
            </div>

            <button
              type="submit"
              className="bg-[#1E3A5F] hover:bg-blue-800 transition-all text-white py-3 rounded-lg font-semibold shadow-md"
            >
              Iniciar sesión
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="underline text-blue-700">
                Términos de servicio
              </a>{" "}
              y{" "}
              <a href="#" className="underline text-blue-700">
                Política de privacidad
              </a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
