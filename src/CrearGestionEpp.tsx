import React, { useEffect, useState } from "react"

export default function GestionEppForm() {
  const [formData, setFormData] = useState({
    cedula: "",
    id_cargo: "",
    productos: "",
    importancia: "",
    estado: "",
    fecha_creacion: "",
    nombre: "",
    apellido: "",
    id_empresa: "",
  })

  useEffect(() => {
    // Tomar datos del JWT en localStorage
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]))
        setFormData((prev) => ({
          ...prev,
          nombre: decoded.nombre || "",
          apellido: decoded.apellido || "",
          id_empresa: decoded.id_empresa || "",
        }))
      } catch (error) {
        console.error("Error decodificando token", error)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:3333/gestion-epp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()
    console.log(data)
    alert(data.mensaje || "Error al crear gestión")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Crear Gestión EPP</h2>

      {/* Datos del JWT */}
      <div>
        <label className="block">Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div>
        <label className="block">Apellido</label>
        <input type="text" name="apellido" value={formData.apellido} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div>
        <label className="block">ID Empresa</label>
        <input type="text" name="id_empresa" value={formData.id_empresa} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>

      {/* Campos que el usuario llena */}
      <div>
        <label className="block">Cédula</label>
        <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>

      <div>
        <label className="block">Cargo</label>
        <select name="id_cargo" value={formData.id_cargo} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Seleccione un cargo</option>
          <option value="1">Operario</option>
          <option value="2">Supervisor</option>
          <option value="3">Administrador</option>
          {/* Aquí puedes cargar cargos dinámicamente desde tu backend */}
        </select>
      </div>

      <div>
        <label className="block">Productos</label>
        <input type="text" name="productos" value={formData.productos} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>

      <div>
        <label className="block">Importancia</label>
        <select name="importancia" value={formData.importancia} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Seleccione</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div>
        <label className="block">Estado</label>
        <select name="estado" value={formData.estado} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Seleccione</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div>
        <label className="block">Fecha de creación</label>
        <input type="date" name="fecha_creacion" value={formData.fecha_creacion} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>

      <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded">
        Guardar
      </button>
    </form>
  )
}
