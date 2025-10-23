import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import logo from '../assets/logosst.jpg'

const RegistroEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nit, setNit] = useState("");
  const [estado, setEstado] = useState(true);
  const [esquema, setEsquema] = useState("");
  const [alias, setAlias] = useState("");

  const apiRegisterEmpresa = import.meta.env.VITE_API_REGISTROEMPRESA;

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(apiRegisterEmpresa, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          direccion,
          nit,
          estado,
          esquema,
          alias,
        }),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      if (data.msj === "empresa creada") {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "La empresa fue registrada correctamente.",
          confirmButtonColor: "#1E3A5F",
          background: "#f8fafc",
        });
        setTimeout(() => navigate("/registro"), 1500);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: data.msj || "Verifica los datos ingresados",
          confirmButtonColor: "#f59e0b",
          background: "#fef3c7",
        });
      }
    } catch (error) {
      console.error("Error al registrar empresa:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor. Inténtalo nuevamente.",
        confirmButtonColor: "#b91c1c",
        background: "#fee2e2",
      });
    }
  };

  const links = [
    { path: "/registroEmpresa", label: "Registrar una empresa" },
    { path: "/registroArea", label: "Registrar una área" },
    { path: "/registro", label: "Registrar un usuario" },
  ];

  return (
   <div className="min-h-screen flex flex-col bg-white font-inter text-gray-800">
      {/* 🔷 HEADER IDÉNTICO AL INICIO */}
      <header className="flex justify-between items-center px-10 py-5 bg-white shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">
            Sistema Integral de Seguridad Laboral
          </h1>
        </div>

        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <Link to="/registroEmpresa" className="hover:text-blue-700 transition-colors">
            Registrar Empresa
          </Link>
          <Link to="/registroArea" className="hover:text-blue-700 transition-colors">
            Registrar Área
          </Link>
          <Link to="/registro" className="hover:text-blue-700 transition-colors">
            Registrar Usuario
          </Link>
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
        >
          Iniciar sesión
        </button>
      </header>


      {/* CONTENIDO */}
      <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* IZQUIERDA */}
          <div className="md:w-1/2 bg-gradient-to-br bg-blue-900 via-[#162a44] to-[#0F1C2E] text-white flex flex-col items-center justify-center p-8 relative">
            <div className="text-center space-y-4 z-10">
              <h2 className="text-3xl font-bold text-white">
                ¡Registra tu empresa!
              </h2>
              <p className="text-gray-200 text-sm">
                Ingresa los datos requeridos para registrar tu empresa en el sistema.
              </p>
            </div>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                alt="Tenant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DERECHA */}
          <div className="md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-6 text-black text-center">
                Registrar Empresa
              </h3>

              <form className="space-y-4" onSubmit={registrar}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900"
                  required
                />

                <input
                  type="text"
                  placeholder="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900"
                  required
                />

                <input
                  type="text"
                  placeholder="NIT"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900"
                  required
                />

                <input
                  type="text"
                  placeholder="Esquema"
                  value={esquema}
                  onChange={(e) => setEsquema(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900"
                />

                <input
                  type="text"
                  placeholder="Alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 text-gray-900"
                />

                <div className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    id="estado"
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                    className="w-4 h-4 border-[#1E3A5F] text-[#1E3A5F] focus:ring-[#1E3A5F]"
                  />
                  <label htmlFor="estado" className="text-gray-200">
                    Estado activo
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#1E3A5F] text-white font-semibold hover:bg-[#142943] transition"
                >
                  Registrar empresa
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
       {/* FOOTER */}
      <footer className="bg-blue-900 text-center py-6 text-gray-200 text-sm border-t border-blue-800">
        © 2025 Sistema Integral SST — Desarrollado por aprendices del SENA
      </footer>
    </div>
  );
};

export default RegistroEmpresa;
