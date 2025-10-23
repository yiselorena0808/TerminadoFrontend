import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logosst.jpg";

const RegistroArea: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_empresa, setIdEmpresa] = useState<number | "">("");
  const [estado, setEstado] = useState(true);
  const [esquema, setEsquema] = useState("");
  const [alias, setAlias] = useState("");
  const [empresas, setEmpresas] = useState<
    { id_empresa: number; nombre: string }[]
  >([]);

  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiCrearArea = import.meta.env.VITE_API_REGISTROAREA;

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch(apiEmpresas);
        const data = await res.json();

        console.log("🔍 Empresas recibidas del backend:", data);

        if (Array.isArray(data.datos)) {
          const empresasLimpias = data.datos
            .filter((e: any) => e.id_empresa || e.idEmpresa)
            .map((e: any) => ({
              id_empresa: Number(e.id_empresa ?? e.idEmpresa),
              nombre: e.nombre ?? e.nombre_empresa ?? "Sin nombre",
            }));

          setEmpresas(empresasLimpias);
        } else {
          console.error("Formato inesperado:", data);
        }
      } catch (err) {
        console.error("Error cargando empresas:", err);
      }
    };
    fetchEmpresas();
  }, []);

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id_empresa) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Debe seleccionar una empresa",
      });
      return;
    }

    try {
      const res = await fetch(apiCrearArea, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          codigo,
          descripcion,
          id_empresa,
          estado,
          esquema,
          alias,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Área registrada con éxito",
          confirmButtonColor: "#1E3A5F",
        }).then(() => {
          navigate("/registroArea");
        });

        setNombre("");
        setCodigo("");
        setDescripcion("");
        setIdEmpresa("");
        setEstado(true);
        setEsquema("");
        setAlias("");
      } else {
        console.error("Error al registrar área:", data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al registrar el área",
        });
      }
    } catch (err) {
      console.error("❌ Error en la petición:", err);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
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

      <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Lado izquierdo */}
          <div className="md:w-1/2 bg-gradient-to-br bg-blue-900 via-[#162a44] to-[#0F1C2E] text-white flex flex-col items-center justify-center p-8 relative">
            <div className="text-center space-y-4 z-10">
              <h2 className="text-3xl font-bold text-white">¡Registra un área!</h2>
              <p className="text-gray-200 text-sm">
                Ingresa los datos requeridos para crear un área dentro de tu empresa.
              </p>
            </div>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3449/3449677.png"
                alt="Área"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Lado derecho */}
          <div className="md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-6 text-black text-center">
                Registrar Área
              </h3>

              <form className="space-y-4" onSubmit={registrar}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] 
                  bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] 
                  text-gray-900 placeholder-gray-500"
                />

                <input
                  type="text"
                  placeholder="Código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] 
                  bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] 
                  text-gray-900 placeholder-gray-500"
                />

                <textarea
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] 
                  bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] 
                  text-gray-900 placeholder-gray-500"
                />

                <select
                  value={id_empresa === "" ? "" : String(id_empresa)}
                  onChange={(e) =>
                    setIdEmpresa(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] 
                  bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] 
                  text-gray-900 placeholder-gray-500"
                >
                  <option value="">-- Selecciona una empresa --</option>
                  {empresas.map((empresa) => (
                    <option
                      key={`empresa-${empresa.id_empresa}`}
                      value={empresa.id_empresa}
                    >
                      {empresa.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Esquema"
                  value={esquema}
                  onChange={(e) => setEsquema(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] 
                  bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] 
                  text-gray-900 placeholder-gray-500"
                />

                <input
                  type="text"
                  placeholder="Alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] 
                  bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] 
                  text-gray-900 placeholder-gray-500"
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
                  Registrar área
                </button>
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

export default RegistroArea;
