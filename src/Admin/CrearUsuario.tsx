import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistrarUsuario: React.FC = () => {
  const navigate = useNavigate();

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

  const apiRegister = import.meta.env.VITE_API_REGISTRAR_USUARIOS;
  const apiEmpresas = import.meta.env.VITE_API_LISTAR_EMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTAR_AREAS;

  // Cargar Empresas
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch(apiEmpresas);
        const data = await res.json();

        const lista = data.datos ?? data ?? [];

        setEmpresas(Array.isArray(lista) ? lista : []);
      } catch (error) {
        console.error("Error cargando empresas:", error);
        setEmpresas([]);
      }
    };
    fetchEmpresas();
  }, []);

  // Cargar Áreas cuando se seleccione la Empresa
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

        const listaAreas = Array.isArray(data.datos ?? data) ? (data.datos ?? data) : [];

        const filteredAreas = listaAreas.filter(
          (area: any) => area.idEmpresa === Number(formData.id_empresa)
        );

        setAreas(filteredAreas);
        setFormData((prev) => ({ ...prev, id_area: "" }));
      } catch (error) {
        console.error("Error cargando áreas:", error);
        setAreas([]);
      }
    };

    fetchAreas();
  }, [formData.id_empresa]);

  // Captura de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Registrar Usuario
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmacion) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      const res = await fetch(apiRegister, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_empresa: Number(formData.id_empresa),
          id_area: Number(formData.id_area),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Usuario registrado!",
          text: "El usuario se registró correctamente",
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

        navigate("/registro");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "No se pudo registrar el usuario",
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 w-screen h-screen">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* IZQUIERDA */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#1E3A5F] via-[#162a44] to-[#0F1C2E] text-white flex flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold text-white text-center">
            ¡Registra un usuario!
          </h2>
          <p className="text-gray-200 text-sm mt-2">
            Forma parte de tu empresa en el sistema.
          </p>
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
            <h3 className="text-2xl font-bold mb-6 text-white text-center">
              Registro de Usuario
            </h3>

            <form className="space-y-4" onSubmit={registrar}>

              {/* Empresa */}
              <select
                name="id_empresa"
                value={formData.id_empresa}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                required
              >
                <option value="">Seleccione una Empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>

              {/* Área */}
              <select
                name="id_area"
                value={formData.id_area}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                required
                disabled={!formData.id_empresa || areas.length === 0}
              >
                <option value="">Seleccione un Área</option>
                {areas.map((area) => (
                  <option key={area.idArea} value={area.idArea}>
                    {area.descripcion}
                  </option>
                ))}
              </select>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                  required
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                  required
                />
              </div>

              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre de usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                required
              />

              <input
                type="email"
                name="correo_electronico"
                placeholder="Correo electrónico"
                value={formData.correo_electronico}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                required
              />

              <input
                type="text"
                name="cargo"
                placeholder="Cargo"
                value={formData.cargo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
              />

              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                required
              />

              <input
                type="password"
                name="confirmacion"
                placeholder="Confirmar contraseña"
                value={formData.confirmacion}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[#1E3A5F] bg-white text-gray-900"
                required
              />

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
  );
};

export default RegistrarUsuario;
