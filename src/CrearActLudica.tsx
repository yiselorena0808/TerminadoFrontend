import React, { useState } from 'react'

const CrearActividadLudica: React.FC = () => {
  const [nombreActividad, setNombreActividad] = useState('')
  const [fechaActividad, setFechaActividad] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenVideo, setImagenVideo] = useState<File | null>(null)
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null)
  const [previewImagen, setPreviewImagen] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_CREARACTIVIDAD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return alert('No hay token, inicia sesión')

    const formData = new FormData()
    formData.append('nombre_actividad', nombreActividad)
    formData.append('fecha_actividad', fechaActividad)
    formData.append('descripcion', descripcion)
    if (imagenVideo) formData.append('imagen_video', imagenVideo)
    if (archivoAdjunto) formData.append('archivo_adjunto', archivoAdjunto)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) return alert(data.error || 'Error al crear actividad')
      alert('Actividad creada correctamente')
      setNombreActividad('')
      setFechaActividad('')
      setDescripcion('')
      setImagenVideo(null)
      setArchivoAdjunto(null)
      setPreviewImagen(null)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleImagenChange = (file: File | null) => {
    setImagenVideo(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImagen(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreviewImagen(null)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Actividad Lúdica</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={nombreActividad}
          onChange={e => setNombreActividad(e.target.value)}
          placeholder="Nombre actividad"
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={fechaActividad}
          onChange={e => setFechaActividad(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div>
          <label className="block mb-1 font-semibold">Imagen / Video:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={e => handleImagenChange(e.target.files?.[0] ?? null)}
            className="mb-2"
          />
          {previewImagen && (
            <img
              src={previewImagen}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Archivo adjunto:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={e => setArchivoAdjunto(e.target.files?.[0] ?? null)}
            className="mb-2"
          />
          {archivoAdjunto && (
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="material-icons">attach_file</span>
              <span>{archivoAdjunto.name}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Crear Actividad
        </button>
      </form>
    </div>
  )
}

export default CrearActividadLudica
