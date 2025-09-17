import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

const CrearReporte: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const [formData, setFormData] = useState({
    cargo: "",
    cedula: "",
    fecha: "",
    lugar: "",
    descripcion: "",
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [archivos, setArchivos] = useState<File | null>(null);

  const apiCrearReporte = import.meta.env.VITE_API_REGISTROREPORTE;

  
  useEffect(() => {
    const u = getUsuarioFromToken();
    if (!u) {
      alert("Usuario no autenticado. Por favor inicia sesión.");
      navigate("/login");
      return;
    }
    setUsuario(u);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) return alert("Usuario no autenticado");

    const token = localStorage.getItem("token");
    if (!token) return alert("No hay token en localStorage");

    try {
      const data = new FormData();

      // Agregar datos del formulario
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      // Agregar archivos
      if (imagen) data.append("imagen", imagen);
      if (archivos) data.append("archivos", archivos);

      // Agregar datos del usuario logueado
      data.append("id_usuario", usuario.id.toString());
      data.append("nombre_usuario", usuario.nombre);
      data.append("id_empresa", usuario.id_empresa.toString());

      // Enviar POST con token en Authorization
      const res = await fetch(apiCrearReporte, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Muy importante: solo el token
        },
        body: data,
      });

      if (!res.ok) {
        const result = await res.json();
        console.error(" Error en respuesta:", result);
        return alert(result.error || "Error al enviar reporte");
      }

      const result = await res.json();
      console.log("Reporte creado:", result);
      alert("Reporte creado correctamente");
      navigate("/nav/crearReportes");
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      alert("Ocurrió un error al enviar el reporte");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Crear Reporte</h2>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="cargo" placeholder="Cargo" value={formData.cargo} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleChange} className="border p-2 rounded" />
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="lugar" placeholder="Lugar" value={formData.lugar} onChange={handleChange} className="border p-2 rounded" />
        </div>

        <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="border p-2 rounded w-full mt-4" />

        <div className="mt-4">
          <label>Imagen:</label>
          <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files?.[0] || null)} />
        </div>

        <div className="mt-4">
          <label>Archivos:</label>
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => setArchivos(e.target.files?.[0] || null)} />
        </div>

        <button type="submit" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
          Enviar Reporte
        </button>
      </form>
    </div>
  );
};

export default CrearReporte;
