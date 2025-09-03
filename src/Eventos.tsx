import React, { useState, useEffect } from "react"

interface Blog {
  id: number
  id_usuario: number
  nombre_usuario: string
  titulo: string
  fecha_Actividad: string
  descripcion: string
  imagen?: string
  archivo?: string
}

export default function BlogListaRealtime() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [notificacion, setNotificacion] = useState<Blog | null>(null)

  const API_LISTAR = import.meta.env.VITE_API_lISTARBLOG

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(API_LISTAR)
        const data = await res.json()


        if (blogs.length > 0 && data[0]?.id !== blogs[0]?.id) {
          setNotificacion(data[0])
          setTimeout(() => setNotificacion(null), 4000)
        }

        setBlogs(data)
      } catch (error) {
        console.error("Error al listar blogs:", error)
      }
    }

    fetchBlogs()
    const interval = setInterval(fetchBlogs, 5000) 
    return () => clearInterval(interval)
  }, [API_LISTAR, blogs])

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Blog de Actividades
      </h1>

      {/* 🔔 Notificación */}
      {notificacion && (
        <div className="fixed top-5 right-5 bg-white shadow-lg rounded-2xl p-4 border-l-4 border-blue-500 w-80 animate-slideIn">
          <h2 className="font-bold text-lg text-blue-600">
            Nueva actividad 🎉
          </h2>
          <p className="text-sm text-gray-700">{notificacion.titulo}</p>
          <span className="text-xs text-gray-500">
            {notificacion.nombre_usuario} •{" "}
            {new Date(notificacion.fecha_Actividad).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Lista de publicaciones */}
      <div className="space-y-6">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {b.imagen && (
              <img
                src={b.imagen}
                alt={b.titulo}
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {b.nombre_usuario[0]}
                </div>
                <div>
                  <p className="font-semibold">{b.nombre_usuario}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(b.fecha_Actividad).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">{b.titulo}</h2>
              <p className="text-gray-700 leading-relaxed">{b.descripcion}</p>
              {b.archivo && (
                <a
                  href={b.archivo}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  📎 Ver archivo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CSS animación */}
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  )
}
