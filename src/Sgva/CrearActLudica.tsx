import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import Swal from "sweetalert2";
import { FaTheaterMasks, FaPaperPlane } from "react-icons/fa";

const CrearActividadLudica: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const [formData, setFormData] = useState({
    nombre_actividad: "",
    fecha_actividad: "",
    descripcion: "",
  });

  const [imagenVideo, setImagenVideo] = useState<File | null>(null);
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);

  const apiCrearActividad = import.meta.env.VITE_API_CREARACTIVIDAD;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (!u) {
      showToast("warning", "Usuario no autenticado. Inicia sesión.");
      navigate("/login");
      return;
    }
    setUsuario(u);
  }, []);

  const showToast = (
    icon: "success" | "error" | "warning" | "info",
    title: string
  ) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (imagenVideo) data.append("imagen_video", imagenVideo);
      if (archivoAdjunto) data.append("archivo_adjunto", archivoAdjunto);

      data.append("id_usuario", usuario.id.toString());
      data.append("nombre_usuario", usuario.nombre);
      data.append("id_empresa", usuario.id_empresa.toString());

      const res = await fetch(apiCrearActividad, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();

      if (!res.ok)
        return showToast("error", result.error || "Error al crear actividad");

      showToast("success", "Actividad lúdica creada 🎉");

      setTimeout(() => {
        navigate("/nav/actLudica");
      }, 1500);
    } catch (error) {
      console.error("Error al crear actividad:", error);
      showToast("error", "Ocurrió un error al crear la actividad");
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
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-blue-600"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTheaterMasks className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Crear Actividad Lúdica
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre_actividad"
            placeholder="Nombre de la Actividad"
            value={formData.nombre_actividad}
            onChange={handleChange}
            className="border p-3 rounded-xl col-span-2 focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="date"
            name="fecha_actividad"
            value={formData.fecha_actividad}
            onChange={handleChange}
            className="border p-3 rounded-xl col-span-2 focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-3 rounded-xl w-full mt-4 focus:ring-2 focus:ring-yellow-500"
          rows={4}
        />

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Imagen / Video:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setImagenVideo(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Archivo adjunto:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setArchivoAdjunto(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-400 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <FaPaperPlane /> Crear Actividad
        </button>
      </form>
    </div>
  );
};

export default CrearActividadLudica;
