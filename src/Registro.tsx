import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [idEmpresa, setIdEmpresa] = useState("");
  const [idArea, setIdArea] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [correo_electronico, setCorreoElectronico] = useState(""); 
  const [cargo, setCargo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contrasena !== confirmacion) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("https://backsst.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_empresa: idEmpresa, 
          id_area: idArea,       
          nombre,
          apellido,
          nombre_usuario,       
          correo_electronico,    
          cargo,
          contrasena,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuario registrado con éxito");
        navigate("/");
      } else {
        alert("Error en el registro: " + (data.mensaje || JSON.stringify(data)));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const links = [
    { path: "/registro", label: "Crear Usuario" },
    { path: "/registroEmpresa", label: "Crear Empresa" },
    { path: "/registroArea", label: "Crear área" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/512/185/desktop-wallpaper-business-office-office-desk.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Barra de navegación superior */}
      <nav className="bg-[#142943] shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-8 h-14 items-center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "bg-[#1E3A5F] text-white"
                    : "text-gray-200 hover:bg-[#1E3A5F] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenedor principal */}
      <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Lado izquierdo */}
          <div className="md:w-1/2 bg-gradient-to-br from-[#1E3A5F] via-[#162a44] to-[#0F1C2E] text-white flex flex-col items-center justify-center p-8 relative">
            <div className="text-center space-y-4 z-10">
              <h2 className="text-3xl font-bold text-white">
                ¡Registra un usuario!
              </h2>
              <p className="text-gray-200 text-sm">
                Forma parte de tu empresa en el sistema.
              </p>
            </div>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                alt="Usuario"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Lado derecho */}
          <div className="md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-6 text-white text-center">
                Registro de Usuario
              </h3>

              <form className="space-y-4" onSubmit={registrar}>
                <input
                  type="number"
                  placeholder="ID Empresa"
                  value={idEmpresa}
                  onChange={(e) => setIdEmpresa(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />

                <input
                  type="number"
                  placeholder="ID Área"
                  value={idArea}
                  onChange={(e) => setIdArea(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={nombre_usuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />

                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={correo_electronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />

                <input
                  type="text"
                  placeholder="Cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />

                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmacion}
                  onChange={(e) => setConfirmacion(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#1E3A5F] text-white font-semibold hover:bg-[#142943] transition"
                >
                  Registrar Usuario
                </button>

                <div className="text-center text-sm mt-4 text-gray-200">
                  ¿Ya tienes cuenta?{" "}
                  <a href="/" className="text-blue-200 font-semibold">
                    Inicia sesión
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
