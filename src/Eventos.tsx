import React, { useEffect, useState } from "react";

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_Actividad: string;
  imagen: string;
  archivo: string;
  estado: string;
}

const EventTimeline: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const apiURL = import.meta.env.VITE_API_BLOGS; // GET /blogs

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(apiURL);
      const data = await res.json();
      setEventos(data);
    };
    fetchData();
  }, []);

  return (
    <div className="relative p-10">
      <h1 className="text-4xl font-bold text-center mb-12">📅 Eventos</h1>
      <div className="relative border-l-4 border-blue-500 ml-4">
        {eventos.map((evento, index) => (
          <div
            key={evento.id}
            className="mb-10 ml-6 relative group hover:scale-105 transition"
          >
            {/* Punto en la línea */}
            <div className="absolute -left-3 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>

            {/* Card del evento */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{evento.titulo}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-lg ${
                    evento.estado === "Finalizado"
                      ? "bg-green-200 text-green-800"
                      : evento.estado === "Pendiente"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {evento.estado}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{evento.descripcion}</p>
              <p className="text-gray-500 text-sm mt-2">
                {new Date(evento.fecha_Actividad).toLocaleDateString()}
              </p>

              {evento.imagen && (
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  className="mt-3 rounded-lg h-40 object-cover w-full"
                />
              )}

              {evento.archivo && (
                <a
                  href={evento.archivo}
                  download
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Descargar archivo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTimeline;
