import React from "react";
import { FaHardHat, FaRegClipboard, FaRegSmileBeam } from "react-icons/fa";

const Bienvenida: React.FC = () => {
  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-8 text-black bg-cover bg-center"
      style={{
        backgroundImage: "url('/ruta/tu-imagen.jpg')", // Cambia por tu imagen real
      }}
    >
      {/* Título y descripción */}
      <div className="text-center mb-12 bg-white/70 p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold">
          Bienvenidos al Sistema SST
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Una plataforma integral para garantizar el bienestar, la prevención y
          la seguridad de todos nuestros colaboradores.
        </p>

        {/* Video */}
        <div className="mt-8 mb-8">
          <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/WFeuK53MPyU"
              title="Video de presentación"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Botón */}
        <a
          href="/dashboard"
          className="inline-block bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Ir al Panel Principal
        </a>
      </div>

      {/* Secciones de información */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
        <div className="bg-white/70 p-6 rounded-lg shadow-lg">
          <FaHardHat size={50} className="mb-3 text-yellow-500 mx-auto" />
          <h4 className="text-xl font-semibold">Prevención</h4>
          <p className="text-gray-600 mt-2">
            Accede a listas de chequeo, capacitaciones y protocolos de
            seguridad.
          </p>
        </div>
        <div className="bg-white/70 p-6 rounded-lg shadow-lg">
          <FaRegClipboard size={50} className="mb-3 text-blue-500 mx-auto" />
          <h4 className="text-xl font-semibold">Gestión</h4>
          <p className="text-gray-600 mt-2">
            Registra reportes, gestiona tus EPPs y mantén actualizada la
            información.
          </p>
        </div>
        <div className="bg-white/70 p-6 rounded-lg shadow-lg">
          <FaRegSmileBeam size={50} className="mb-3 text-green-500 mx-auto" />
          <h4 className="text-xl font-semibold">Bienestar</h4>
          <p className="text-gray-600 mt-2">
            Participa en actividades lúdicas y programas de salud para tu
            desarrollo integral.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
