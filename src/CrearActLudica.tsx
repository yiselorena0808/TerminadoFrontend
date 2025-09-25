import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";
import Swal from "sweetalert2";

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
      navigate("/nav/actLudica"); 
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) return showToast("error", "Usuario no autenticado");

    const token = localStorage.getItem("token");
    if (!token) return showToast("error", "No hay token en localStorage");

    try {
      const data = new FormData();

      // Agregar datos del formulario
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      // Archivos
      if (imagenVideo) data.append("imagen_video", imagenVideo);
      if (archivoAdjunto) data.append("archivo_adjunto", archivoAdjunto);

      // Datos del usuario logueado
      data.append("id_usuario", usuario.id.toString());
      data.append("nombre_usuario", usuario.nombre);
      data.append("id_empresa", usuario.id_empresa.toString());

      const res = await fetch(apiCrearActividad, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const result = await res.json();
        console.error("Error en respuesta:", result);
        return showToast("error", result.error || "Error al crear actividad");
      }

      showToast("success", "Actividad lúdica creada 🎉");
    } catch (error) {
      console.error("Error al crear actividad:", error);
      showToast("error", "Ocurrió un error al crear la actividad");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🎭 Crear Actividad Lúdica
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre_actividad"
            placeholder="Nombre actividad"
            value={formData.nombre_actividad}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
          <input
            type="date"
            name="fecha_actividad"
            value={formData.fecha_actividad}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4"
        />

        <div className="mt-4">
          <label>Imagen / Video:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setImagenVideo(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mt-4">
          <label>Archivo adjunto:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setArchivoAdjunto(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Crear Actividad
        </button>
      </form>
    </div>
  );
};

export default CrearActividadLudica;
