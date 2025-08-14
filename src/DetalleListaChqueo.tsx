import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  Car,
  Info,
  MapPin,
  FileText,
} from "lucide-react";

interface ListaChequeoDetalle {
  id: number;
  id_usuario: number;
  usuario_nombre: string;
  fecha: string;
  hora: string;
  modelo: string;
  marca: string;
  soat: string;
  tecnico: string;
  kilometraje: string;
}

const DetalleListaChequeo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*const lista: ListaChequeoDetalle | undefined = location.state as ListaChequeoDetalle;

  if (!lista) {
    return <p className="p-4">No hay datos para mostrar.</p>;
  }*/

    const lista: ListaChequeoDetalle = {
  id: 1,
  id_usuario: 101,
  usuario_nombre: "Carlos Ramírez",
  fecha: "2025-08-14",
  hora: "09:30",
  modelo: "Toyota Corolla",
  marca: "Toyota",
  soat: "Vigente",
  tecnico: "Luis Fernández",
  kilometraje: "120000 km",
};

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative px-6 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/90 border border-gray-300 rounded-xl shadow hover:bg-white transition"
        >
          ← Volver
        </button>

        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="text-4xl font-bold">📝 Detalle de Lista de Chequeo</h2>
            <p className="text-blue-100 text-lg">ID #{lista.id}</p>
          </div>

          {/* Body */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del usuario */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Usuario
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Nombre:</span>{" "}
                {lista.usuario_nombre}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">ID Usuario:</span>{" "}
                {lista.id_usuario}
              </p>
            </div>

            {/* Detalles del vehículo */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Información del Vehículo
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <Car className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Modelo:</span>{" "}
                {lista.modelo}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Car className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Marca:</span>{" "}
                {lista.marca}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">SOAT:</span>{" "}
                {lista.soat}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Técnico:</span>{" "}
                {lista.tecnico}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Kilometraje:</span>{" "}
                {lista.kilometraje}
              </p>
            </div>

            {/* Fecha y hora */}
            <div className="md:col-span-2 space-y-4 bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Fecha y Hora
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Fecha:</span>{" "}
                {formatearFecha(lista.fecha)}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Hora:</span>{" "}
                {lista.hora}
              </p>
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="bg-gray-50 px-10 py-6 flex flex-wrap gap-4 justify-end border-t">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-lg">
              <FileText className="w-5 h-5" /> Descargar Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleListaChequeo;
