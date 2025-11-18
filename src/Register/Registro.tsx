import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import logo from "../assets/logosst.jpg";

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  // Datos API
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiRegisterSGVA = import.meta.env.VITE_API_REGISTROSGVA;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;

  // Estados
  const [modo, setModo] = useState<"normal" | "sgva">("normal");
  const [metodoHuella, setMetodoHuella] = useState<
    "camara" | "archivo" | "huellero" | ""
  >("");
  const [huella, setHuella] = useState<string | null>(null);
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
  // MANEJO FORM
  // -------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // HUELLAS
  // -------------------------------
  const capturarHuellaCamara = () => {
    if (webcamRef.current) {
      const img = webcamRef.current.getScreenshot();
      setHuella(img);
    }
  };

  const capturarHuellaArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setHuella(reader.result as string);
    reader.readAsDataURL(file);
  };

  const capturarHuellaHuellero = async () => {
    try {
      Swal.fire({
        title: "Coloca el dedo en el lector...",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
      });

      const res = await fetch("http://127.0.0.1:5000/capturar_huella", {
        method: "POST",
      });

      const data = await res.json();
      if (data.huella) {
        setHuella(data.huella);
      }

      Swal.fire({
        icon: "success",
        title: "Huella capturada",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo conectar con el lector", "error");
    }
  };

  // -------------------------------
  // REGISTRAR USUARIO
  // -------------------------------
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modo === "sgva" && !huella)
      return Swal.fire("Error", "Debe capturar la huella", "error");

    if (modo === "normal" && formData.contrasena !== formData.confirmacion)
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");

    try {
      const url = modo === "sgva" ? apiRegisterSGVA : apiRegister;

      const body =
        modo === "sgva"
          ? {
              ...formData,
              id_empresa: Number(formData.id_empresa),
              id_area: Number(formData.id_area),
              huella,
            }
          : {
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

          {/* BOTONES DE TIPO */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setModo("normal")}
              className={`px-6 py-2 rounded-lg font-semibold ${
                modo === "normal"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Registro Normal
            </button>

            <button
              onClick={() => setModo("sgva")}
              className={`px-6 py-2 rounded-lg font-semibold ${
                modo === "sgva"
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Registro SGVA
            </button>
          </div>

          <form className="space-y-4" onSubmit={registrar}>
            {/* CAMPOS COMPARTIDOS */}
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

            {/* REGISTRO NORMAL */}
            {modo === "normal" && (
              <>
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
              </>
            )}

            {/* REGISTRO SGVA */}
            {modo === "sgva" && (
              <div className="mt-4">
                <label className="font-medium block mb-2">
                  Método de captura de huella:
                </label>

                <select
                  value={metodoHuella}
                  onChange={(e) => setMetodoHuella(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="camara">Cámara</option>
                  <option value="archivo">Archivo</option>
                  <option value="huellero">Lector USB</option>
                </select>

                {/* CÁMARA */}
                {metodoHuella === "camara" && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={capturarHuellaCamara}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg"
                    >
                      Capturar Huella
                    </button>

                    {huella && (
                      <img
                        src={huella}
                        className="w-32 h-32 mt-2 border rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* ARCHIVO */}
                {metodoHuella === "archivo" && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={capturarHuellaArchivo}
                      className="w-full"
                    />

                    {huella && (
                      <img
                        src={huella}
                        className="w-32 h-32 mt-2 border rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* HUELLLERO */}
                {metodoHuella === "huellero" && (
                  <div className="mt-4 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={capturarHuellaHuellero}
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg"
                    >
                      Capturar con Lector USB
                    </button>

                    {huella && (
                      <p className="text-green-600 font-semibold mt-2">
                        Huella capturada correctamente ✓
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-700 text-white font-semibold mt-6"
            >
              Registrar Usuario
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-center py-6 text-gray-200 text-sm">
        © 2025 Sistema Integral SST — Desarrollado por aprendices del SENA
      </footer>
    </div>
  );
};

export default Registro;
