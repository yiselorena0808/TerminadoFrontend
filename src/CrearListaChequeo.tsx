import React, { useState } from "react"

const CrearListaChequeo: React.FC = () => {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    modelo: "",
    marca: "",
    soat: "",
    tecnico: "",
    kilometraje: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const resp = await fetch("http://localhost:3333/crearListaChequeo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ obligatorio
        },
        body: JSON.stringify(form),
      })

      if (!resp.ok) throw new Error("Error al crear lista")

      const data = await resp.json()
      alert("Lista creada correctamente ✅")
      console.log("Nueva lista:", data)
    } catch (err: any) {
      console.error("Error:", err.message)
      alert("Error al crear lista ❌")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="fecha" type="date" onChange={handleChange} />
      <input name="hora" type="time" onChange={handleChange} />
      <input name="modelo" placeholder="Modelo" onChange={handleChange} />
      <input name="marca" placeholder="Marca" onChange={handleChange} />
      <input name="soat" placeholder="SOAT" onChange={handleChange} />
      <input name="tecnico" placeholder="Técnico" onChange={handleChange} />
      <input
        name="kilometraje"
        type="number"
        placeholder="Kilometraje"
        onChange={handleChange}
      />
      <button type="submit">Guardar</button>
    </form>
  )
}

export default CrearListaChequeo
