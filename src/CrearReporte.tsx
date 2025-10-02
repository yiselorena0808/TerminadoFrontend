import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";
import Swal from "sweetalert2";
import { FaHardHat, FaPaperPlane } from "react-icons/fa";

const CrearReporte: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const [formData, setFormData] = useState({
    cargo: "",
    cedula: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    estado: "Pendiente",
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [archivos, setArchivos] = useState<File | null>(null);

  const apiCrearReporte = import.meta.env.VITE_API_REGISTROREPORTE;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (!u) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Usuario no autenticado. Inicia sesión.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/login");
      return;
    }
    setUsuario(u);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    setTimeout(() => {
      navigate("/nav/reportesC");
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) return showToast("error", "Usuario no autenticado");

    const token = localStorage.getItem("token");
    if (!token) return showToast("error", "No hay token en localStorage");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      if (imagen) data.append("imagen", imagen);
      if (archivos) data.append("archivos", archivos);

      data.append("id_usuario", usuario.id.toString());
      data.append("nombre_usuario", usuario.nombre);
      data.append("id_empresa", usuario.id_empresa.toString());

      const res = await fetch(apiCrearReporte, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const result = await res.json();
        return showToast("error", result.error || "Error al enviar reporte");
      }

      showToast("success", "Reporte creado correctamente ✅");
      navigate("/nav/crearReportes");
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showToast("error", "Ocurrió un error al enviar el reporte");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/fotos-premium/equipos-proteccion-personal-para-la-seguridad-industrial_1033579-251259.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-yellow-900/40 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-yellow-500"
      >
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <FaHardHat className="text-yellow-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Crear Reporte SST</h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="lugar"
            placeholder="Lugar"
            value={formData.lugar}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />

          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="border p-3 rounded-xl col-span-2 focus:ring-2 focus:ring-yellow-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Revisado">Revisado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-3 rounded-xl w-full mt-4 focus:ring-2 focus:ring-yellow-500"
          rows={4}
        />

        {/* Archivos */}
        <div className="mt-4">
          <label className="font-semibold text-gray-700">Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Archivos:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setArchivos(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <FaPaperPlane /> Enviar Reporte
        </button>
      </form>
    </div>
  );
};

export default CrearReporte;
