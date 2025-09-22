import React, { useState } from 'react'

interface FormDataState {
  titulo: string
  descripcion: string
  fecha_actividad: string
  imagen?: File | null
  archivo?: File | null
}

const CrearEventos: React.FC = () => {
  const [form, setForm] = useState<FormDataState>({
    titulo: '',
    descripcion: '',
    fecha_actividad: '',
    imagen: null,
    archivo: null,
  })
  const [mensaje, setMensaje] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('titulo', form.titulo)
      formData.append('descripcion', form.descripcion)
      formData.append('fecha_actividad', form.fecha_actividad)
      if (form.imagen) formData.append('imagen', form.imagen)
      if (form.archivo) formData.append('archivo', form.archivo)

      const token = localStorage.getItem('token') // ⚡ tu token JWT
      if (!token) {
        setMensaje('No estás autenticado')
        return
      }

      const res = await fetch('http://localhost:3333/crearBlog', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Error al crear publicación:', data)
        setMensaje(data.error || 'Error al crear publicación')
        return
      }

      console.log('Publicación creada:', data)
      setMensaje('Publicación creada con éxito!')
      setForm({
        titulo: '',
        descripcion: '',
        fecha_actividad: '',
        imagen: null,
        archivo: null,
      })
    } catch (error) {
      console.error('Error al crear publicación:', error)
      setMensaje('Error al crear publicación')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Crear Publicación</h2>
      {mensaje && <p className="mb-2 text-red-500">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="fecha_actividad"
          value={form.fecha_actividad}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="file"
          name="archivo"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Crear Publicación
        </button>
      </form>
    </div>
  )
}

export default CrearEventos
