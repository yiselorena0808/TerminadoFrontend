import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const RegistroArea: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [nombreArea, setNombreArea] = useState("");
  const [responsableArea, setResponsableArea] = useState("");
  const [codigoArea, setCodigoArea] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3333/registro-area", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_area: nombreArea,
        responsable_area: responsableArea,
        codigo_area: codigoArea,
        descripcion,
      }),
    });

    const data = await res.json();
    if (data.mensaje === "Registro correcto") {
      alert("Área registrada con éxito");
      navigate("/");
    } else {
      alert("Error en el registro: " + (data.mensaje || JSON.stringify(data)));
    }
  };

  const links = [
    { path: "/registro", label: "Crear cuenta" },
    { path: "/registroEmpresa", label: "Crear empresa" },
    { path: "/registroArea", label: "Crear área" },
  ];

  return (
  <div
    className="min-h-screen flex flex-col"
    style={{
      backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/512/185/desktop-wallpaper-business-office-office-desk.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
       }}>      {/* Barra de navegación superior */}
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
                ¡Registra un área!
              </h2>
              <p className="text-gray-200 text-sm">
                Organiza y gestiona las áreas de tu empresa.
              </p>
            </div>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                alt="Área"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Lado derecho */}
          <div className="md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-6 text-white text-center">
                Registro de Área
              </h3>

              <form className="space-y-4" onSubmit={registrar}>
                <input
                  type="text"
                  placeholder="Nombre del área"
                  value={nombreArea}
                  onChange={(e) => setNombreArea(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] text-gray-900 placeholder-gray-500"
                  required
                />

                <input
                  type="text"
                  placeholder="Responsable del área"
                  value={responsableArea}
                  onChange={(e) => setResponsableArea(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] text-gray-900 placeholder-gray-500"
                  required
                />

                <input
                  type="text"
                  placeholder="Código del área"
                  value={codigoArea}
                  onChange={(e) => setCodigoArea(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] text-gray-900 placeholder-gray-500"
                />

                <textarea
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] text-gray-900 placeholder-gray-500"
                />

                <div className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 border-[#1E3A5F] text-[#1E3A5F] focus:ring-[#1E3A5F]"
                    required
                  />
                  <label htmlFor="terms" className="text-gray-200">
                    Acepto los{" "}
                    <a href="#" className="text-blue-200 underline">
                      Términos y condiciones
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#1E3A5F] text-white font-semibold hover:bg-[#142943] transition"
                >
                  Registrar Área
                </button>

                <div className="text-center text-sm mt-4 text-gray-200">
                  ¿Quieres ver las áreas registradas?{" "}
                  <a href="/areas" className="text-blue-200 font-semibold">
                    Ver lista
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

export default RegistroArea;
