import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import logo from "../assets/logosst.jpg";

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
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
  const [isSGVA, setIsSGVA] = useState(false);
  const [metodoHuella, setMetodoHuella] = useState<"camara" | "huellero" | "archivo" | "">("");
  const [huella, setHuella] = useState<string | null>(null);

  // APIs
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiRegisterSGVA = import.meta.env.VITE_API_REGISTROSGVA;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;

  // Cargar empresas
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch(apiEmpresas);
        const data = await res.json();
        setEmpresas(Array.isArray(data.datos) ? data.datos : []);
      } catch (error) {
        console.error("Error cargando empresas:", error);
        setEmpresas([]);
      }
    };
    fetchEmpresas();
  }, []);

  // Cargar áreas según empresa
  useEffect(() => {
    const fetchAreas = async () => {
      if (!formData.id_empresa) {
        setAreas([]);
        setFormData((prev) => ({ ...prev, id_area: "" }));
        return;
      }
      try {
        const res = await fetch(apiAreas);
        const data = await res.json();
        const filteredAreas = Array.isArray(data)
          ? data.filter((area: any) => area.idEmpresa === Number(formData.id_empresa))
          : [];
        setAreas(filteredAreas);
        setFormData((prev) => ({ ...prev, id_area: "" }));
      } catch (error) {
        console.error("Error cargando áreas:", error);
        setAreas([]);
      }
    };
    fetchAreas();
  }, [formData.id_empresa]);

  // Manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const capturarHuellaHuellero = async () => {
  try {
    Swal.fire({
      title: "Coloca el dedo en el lector...",
      icon: "info",
      showConfirmButton: false,
      timer: 2500
    });

    const capturarHuellaHuellero = async () => {
  const res = await fetch("http://127.0.0.1:5000/capturar_huella", {
    method: "POST",
  });
  const data = await res.json();
  console.log(data);
};

    Swal.fire({
      icon: "success",
      title: "Huella capturada correctamente",
      showConfirmButton: false,
      timer: 1500
    });

  } catch (err) {
    Swal.fire("Error", "No se pudo conectar con el servicio de huellas", "error");
  }
};

  // Registrar usuario o SGVA
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSGVA && !huella) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe capturar la huella para SGVA",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!isSGVA && formData.contrasena !== formData.confirmacion) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const url = isSGVA ? apiRegisterSGVA : apiRegister;

      const body = isSGVA
        ? {
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo_electronico: formData.correo_electronico,
            cargo: formData.cargo,
            contrasena: formData.contrasena,
            id_empresa: Number(formData.id_empresa),
            id_area: Number(formData.id_area),
            huella, // base64
          }
        : {
            ...formData,
            id_empresa: Number(formData.id_empresa),
            id_area: Number(formData.id_area),
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Usuario registrado!",
          text: "El usuario se registró correctamente",
          confirmButtonColor: "#3085d6",
        });

        setFormData({
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
        setHuella(null);
        setIsSGVA(false);
        setMetodoHuella("");
        navigate("/registro");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "No se pudo registrar el usuario",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-inter text-gray-800">
      {/* HEADER */}
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

      {/* FORM */}
      <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen mt-16">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* IZQUIERDA */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-900 via-[#162a44] to-[#0F1C2E] text-white flex flex-col items-center justify-center p-8">
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

          {/* DERECHA */}
          <div className="md:w-1/2 p-8 flex items-center">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-6 text-black text-center">
                Registro de Usuario
              </h3>

              <form className="space-y-4" onSubmit={registrar}>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={isSGVA}
                    onChange={(e) => setIsSGVA(e.target.checked)}
                    className="w-5 h-5"
                  />
                  Es SGVA (Registro con huella)
                </label>

                {isSGVA ? (
                  // SGVA
                  <div>
                    <select
                      name="id_empresa"
                      value={formData.id_empresa}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F]"
                      required
                    >
                      <option value="">Seleccione una Empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                          {empresa.nombre}
                        </option>
                      ))}
                    </select>

                    <select
                      name="id_area"
                      value={formData.id_area}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] mt-3"
                      required
                    >
                      <option value="">Seleccione un Área</option>
                      {areas.map((area) => (
                        <option key={area.idArea} value={area.idArea}>
                          {area.descripcion}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border mt-3"
                      required
                    />

                    <input
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border mt-3"
                      required
                    />

                    <input
                      type="email"
                      name="correo_electronico"
                      placeholder="Correo electrónico"
                      value={formData.correo_electronico}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border mt-3"
                      required
                    />

                    <input
                      type="text"
                      name="cargo"
                      placeholder="Cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border mt-3"
                    />

                    {/* Métodos de huella */}
                    <label className="font-medium text-gray-700 mt-4 block">Método de registro de huella:</label>
                    <select
                      value={metodoHuella}
                      onChange={(e) => setMetodoHuella(e.target.value as any)}
                      className="w-full px-4 py-2 rounded-lg border mt-2"
                      required
                    >
                      <option value="">Seleccione un método</option>
                      <option value="camara">Cámara</option>
                      <option value="huellero">Huellero</option>
                      <option value="archivo">Archivo</option>
                    </select>

                    {metodoHuella === "camara" && (

                      <div className="flex flex-col items-center gap-2 mt-2">
                        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg" />
                        <button
                          type="button"
                        
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Capturar Huella
                        </button>
                        {huella && <img src={huella} alt="Huella capturada" className="mt-2 w-32 h-32 border rounded-lg" />}
                      </div>
                    )}

                    {metodoHuella === "huellero" && (
                  <div className="mt-3 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={capturarHuellaHuellero}
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                    >
                      Capturar Huella con Lector USB
                    </button>

                    {huella && (
                      <p className="text-green-600 font-semibold">
                        ✅ Huella registrada correctamente
                      </p>
                    )}
                  </div>
                )}
                  </div>
                ) : (
                  // Registro normal
                  <>
                    <select
                      name="id_empresa"
                      value={formData.id_empresa}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F]"
                      required
                    >
                      <option value="">Seleccione una Empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                          {empresa.nombre}
                        </option>
                      ))}
                    </select>

                    <select
                      name="id_area"
                      value={formData.id_area}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F]"
                      required
                    >
                      <option value="">Seleccione un Área</option>
                      {areas.map((area) => (
                        <option key={area.idArea} value={area.idArea}>
                          {area.descripcion}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="px-4 py-2 rounded-lg border"
                        required
                      />
                      <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="px-4 py-2 rounded-lg border"
                        required
                      />
                    </div>

                    <input
                      type="text"
                      name="nombre_usuario"
                      placeholder="Nombre de usuario"
                      value={formData.nombre_usuario}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                      required
                    />

                    <input
                      type="email"
                      name="correo_electronico"
                      placeholder="Correo electrónico"
                      value={formData.correo_electronico}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                      required
                    />

                    <input
                      type="text"
                      name="cargo"
                      placeholder="Cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                    />

                    <input
                      type="password"
                      name="contrasena"
                      placeholder="Contraseña"
                      value={formData.contrasena}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                      required
                    />

                    <input
                      type="password"
                      name="confirmacion"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmacion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                      required
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#1E3A5F] text-white font-semibold hover:bg-[#142943] transition"
                >
                  Registrar Usuario
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-center py-6 text-gray-200 text-sm border-t border-blue-800">
        © 2025 Sistema Integral SST — Desarrollado por aprendices del SENA
      </footer>
    </div>
  );
};

export default Registro;
