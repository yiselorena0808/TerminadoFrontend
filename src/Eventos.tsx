import React, { useState } from "react"

const CrearEvento: React.FC = () => {
  const apiCrearEvento = import.meta.env.VITE_API_CREAREVENTO
  const token = localStorage.getItem("token") // 👈 el token guardado tras login

  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fechaActividad, setFechaActividad] = useState("")
  const [imagen, setImagen] = useState<File | null>(null)
  const [archivo, setArchivo] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("titulo", titulo)
      formData.append("descripcion", descripcion)
      formData.append("fecha_actividad", fechaActividad)
      if (imagen) formData.append("imagen", imagen)
      if (archivo) formData.append("archivo", archivo)

      const res = await fetch(apiCrearEvento, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // 👈 importantísimo
        },
        body: formData, // 👈 no usar JSON.stringify aquí
      })

      if (!res.ok) {
        const error = await res.json()
        console.error("Error en crear publicación:", error)
        return
      }

      const data = await res.json()
      console.log("Publicación creada ✅", data)
      alert("Evento creado correctamente")
    } catch (err) {
      console.error("Error en crear publicación:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <input
        type="date"
        value={fechaActividad}
        onChange={(e) => setFechaActividad(e.target.value)}
        required
      />
      <input type="file" onChange={(e) => setImagen(e.target.files?.[0] || null)} />
      <input type="file" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
      <button type="submit">Crear evento</button>
    </form>
  )
}

export default CrearEvento
