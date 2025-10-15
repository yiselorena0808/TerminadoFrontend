import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsuarioFromToken } from "../utils/auth";
import { FaCalendarPlus } from "react-icons/fa";

interface UsuarioToken {
  id: number;
  nombre: string;
  id_empresa: number;
}

const CrearEvento: React.FC = () => {
  const navigate = useNavigate();
  const apiCrearEvento = import.meta.env.VITE_API_CREAREVENTO;
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaActividad, setFechaActividad] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);

  useEffect(() => {
    const user = getUsuarioFromToken();
    setUsuario(user);
  }, []);

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
    if (icon === "success") {
      setTimeout(() => {
        navigate("/nav/blog");
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return showToast("error", "No hay token, inicia sesión");

    if (!usuario) return showToast("error", "Usuario no cargado");

    try {
      const formData = new FormData();
      formData.append("id_usuario", usuario.id.toString());
      formData.append("nombre_usuario", usuario.nombre);
      formData.append("id_empresa", usuario.id_empresa.toString());
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("fecha_actividad", fechaActividad);
      if (imagen) formData.append("imagen", imagen);
      if (archivo) formData.append("archivo", archivo);

      const res = await fetch(apiCrearEvento, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return showToast("error", data.message || "Error al crear el evento");
      }

      showToast("success", "Evento creado ✅");

      setTitulo("");
      setDescripcion("");
      setFechaActividad("");
      setImagen(null);
      setArchivo(null);
    } catch (error) {
      console.error("Error creando evento:", error);
      showToast("error", "No se pudo crear el evento");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/foto-gratis/concepto-fiesta-nochevieja_23-2147706044.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay amarillo */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      {/* Card central */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-yellow-500">
        <div className="flex items-center gap-3 mb-6">
          <FaCalendarPlus className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">📝 Crear Evento</h2>
        </div>

        {usuario && (
          <div className="mb-4 p-3 bg-blue-200 border border-blue-600 rounded-xl">
            <p className="text-gray-700">
              <strong>👤 Usuario:</strong> {usuario.nombre}
            </p>
            <p className="text-gray-700">
              <strong>🏢 Empresa:</strong> {usuario.id_empresa}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título del evento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <textarea
            placeholder="Descripción del evento"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm resize-none h-28 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            type="date"
            value={fechaActividad}
            onChange={(e) => setFechaActividad(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          <div>
            <label className="block mb-1 text-gray-700 font-medium">📷 Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files?.[0] || null)}
              className="w-full text-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">📎 Archivo</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="w-full text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-400 text-white py-3 rounded-xl font-semibold shadow-lg transition flex items-center justify-center gap-2"
          >
            <FaCalendarPlus /> Crear Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearEvento;
