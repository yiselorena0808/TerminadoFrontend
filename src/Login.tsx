import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("auth", "true");

      if (data.user?.idEmpresa) {
        localStorage.setItem("idEmpresa", data.user.idEmpresa.toString());
      }

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al sistema",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/nav/inicio", { replace: true });
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
    <div className="flex items-center justify-center w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage:
        "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('https://cdn2.hubspot.net/hubfs/3530961/Blogs-Pensemos-23_07_18.jpg')" 
      }}
    >
      <div className="flex w-11/12 md:w-4/5 lg:w-2/3 bg-transparent text-white rounded-lg overflow-hidden">
        <div className="hidden md:flex flex-col justify-center w-1/2 p-10">
          <h1 className="text-4xl font-bold mb-4">Bienvenido de nuevo</h1>
          <p className="text-sm mb-6 opacity-80 leading-relaxed">
            Ingresa con tus credenciales para acceder al sistema.
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-white bg-opacity-10 backdrop-blur-md p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
          <form onSubmit={Enviar} className="flex flex-col">
            <label className="mb-1 text-sm">Correo electrónico</label>
            <input type="email" placeholder="Escribe tu correo"
              value={correo_electronico}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="mb-4 p-3 rounded bg-white text-black focus:outline-none"
            />

            <label className="mb-1 text-sm">Contraseña</label>
            <input type="password" placeholder="Escribe tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="mb-4 p-3 rounded bg-white text-black focus:outline-none"
            />

            <div className="flex items-center justify-between mb-4 text-sm">
              <a href="#" className="underline hover:text-gray-300">¿Olvidaste tu contraseña?</a>
              <span onClick={() => navigate("/registro")}
                className="underline hover:text-gray-300 cursor-pointer">Registrarse</span>
            </div>

            <button type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-bold mb-4">
              Iniciar sesión ahora
            </button>

            <p className="text-xs text-gray-300">
              Al hacer clic en "Iniciar sesión ahora" aceptas nuestros{" "}
              <a href="#" className="underline">Términos de servicio</a> |{" "}
              <a href="#" className="underline">Política de privacidad</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
