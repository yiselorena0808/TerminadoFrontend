import React, { useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logosst.jpg";

const Registro: React.FC = () => {
  const navigate = useNavigate();

  // Datos API
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;

  // Estados
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  // Formulario general
  const [formData, setFormData] = useState({
    id_empresa: "",
    id_area: "",
    nombre: "",
    apellido: "",
    nombre_usuario: "",
    correo_electronico: "",
    cargo: "",
    contrasena: "",
    confirmacion: "",
  });

  // -------------------------------
  // LISTAR EMPRESAS
  // -------------------------------
  useEffect(() => {
    fetch(apiEmpresas, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data.datos || []))
      .catch(() => setEmpresas([]));
  }, []);

  // -------------------------------
  // LISTAR ÁREAS SEGÚN EMPRESA
  // -------------------------------
  useEffect(() => {
    if (!formData.id_empresa) {
      setAreas([]);
      return;
    }

    fetch(apiAreas, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtradas = Array.isArray(data)
          ? data.filter(
              (a: any) => a.idEmpresa === Number(formData.id_empresa)
            )
          : [];
        setAreas(filtradas);
      })
      .catch(() => setAreas([]));
  }, [formData.id_empresa]);


  // -------------------------------
  // MANEJO FORMULARIO
  // -------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // REGISTRAR USUARIO (SOLO NORMAL)
  // -------------------------------
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmacion)
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");

    try {
      const url = apiRegister;

      const body = {
        ...formData,
        id_empresa: Number(formData.id_empresa),
        id_area: Number(formData.id_area),
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Éxito", "Usuario registrado correctamente", "success");
        navigate("/registro");
      } else {
        Swal.fire("Error", data.error || "No se pudo registrar", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-5 bg-white shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src={logo} className="w-12 h-12 rounded-full" />
          <h1 className="text-xl font-bold text-blue-800">
            Sistema Integral de Seguridad Laboral
          </h1>
        </div>

        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <Link to="/registroEmpresa">Registrar Empresa</Link>
          <Link to="/registroArea">Registrar Área</Link>
          <Link to="/registro">Registrar Usuario</Link>
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-700 text-white px-6 py-2 rounded-xl"
        >
          Iniciar sesión
        </button>
      </header>

      {/* CONTENIDO */}
      <div className="flex flex-1 items-center justify-center p-6 w-screen mt-20">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-center mb-6">
            Registro de Usuario
          </h2>

          {/* FORMULARIO */}
          <form className="space-y-4" onSubmit={registrar}>
            
            <select
              name="id_empresa"
              value={formData.id_empresa}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Seleccione una Empresa</option>
              {empresas.map((e) => (
                <option key={e.idEmpresa} value={e.idEmpresa}>
                  {e.nombre}
                </option>
              ))}
            </select>

            <select
              name="id_area"
              value={formData.id_area}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Seleccione un Área</option>
              {areas.map((a) => (
                <option key={a.idArea} value={a.idArea}>
                  {a.descripcion}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <input
              type="text"
              name="nombre_usuario"
              placeholder="Nombre de usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <input
              type="email"
              name="correo_electronico"
              placeholder="Correo electrónico"
              value={formData.correo_electronico}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <input
              type="text"
              name="cargo"
              placeholder="Cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <input
              type="password"
              name="confirmacion"
              placeholder="Confirmar contraseña"
              value={formData.confirmacion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-700 text-white font-semibold mt-6"
            >
              Registrar Usuario
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-blue-900 text-center py-6 text-gray-200 text-sm">
        © 2025 Sistema Integral SST — Desarrollado por aprendices del SENA
      </footer>
    </div>
  );
};

export default Registro;
