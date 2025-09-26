import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsuarioFromToken } from "./utils/auth";

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

  // Extraer usuario del token
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

      // Limpiar formulario
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Crear Evento</h2>

      {usuario && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p>
            <strong>Usuario:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>ID Empresa:</strong> {usuario.id_empresa}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 resize-none h-24"
        />
        <input
          type="date"
          value={fechaActividad}
          onChange={(e) => setFechaActividad(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <div>
          <label className="block mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Archivo</label>
          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Crear Evento
        </button>
      </form>
    </div>
  );
};

export default CrearEvento;
