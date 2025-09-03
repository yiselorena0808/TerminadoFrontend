import React, { useState } from "react"

export default function BlogFormulario() {
  const [form, setForm] = useState({
    id_usuario:"",
    nombre_usuario: "",
    titulo: "",
    fecha_Actividad: "",
    descripcion: "",
    imagen: "",
    archivo: "",
  })

  const API_CREAR = import.meta.env.VITE_API_CREAREVENTO

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(API_CREAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Error al crear publicación")

      alert("Publicación creada con éxito")
      setForm({
        id_usuario: "",
        nombre_usuario: "",
        titulo: "",
        fecha_Actividad: "",
        descripcion: "",
        imagen: "",
        archivo: "",
      })
    } catch (error) {
      console.error(error)
      alert(" No se pudo crear la publicación")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-2">Crear publicación</h2>

      <input
        type="text"
        name="nombre_usuario"
        value={form.nombre_usuario}
        onChange={handleChange}
        placeholder="Tu nombre"
        className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
      />

      <input
        type="text"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        placeholder="Título de la actividad"
        className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
      />

      <input
        type="date"
        name="fecha_Actividad"
        value={form.fecha_Actividad}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
      />

      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción de la actividad"
        className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
      />

      <input
        type="text"
        name="imagen"
        value={form.imagen}
        onChange={handleChange}
        placeholder="URL de imagen (opcional)"
        className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
      />

      <input
        type="text"
        name="archivo"
        value={form.archivo}
        onChange={handleChange}
        placeholder="Archivo (ej: URL o nombre de archivo)"
        className="w-full p-3 border rounded-xl focus:ring focus:ring-blue-300"
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow hover:scale-105 transform transition"
      >
         Publicar
      </button>
    </form>
  )
}
