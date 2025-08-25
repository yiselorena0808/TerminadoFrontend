import React, { useEffect, useState } from "react";

interface Empresa {
  id_empresa: number;
  nombre: string;
  direccion: string;
}

interface Area {
  id_area: number;
  nombre_area: string;
  descripcion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  fotoPerfil?: string;
  empresa?: Empresa;
  area?: Area;
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    if (datos) {
      setUsuario(JSON.parse(datos));
    }
  }, []);

  if (!usuario) {
    return (
      <p className="text-center mt-10 text-gray-600">
        ⚠ No hay usuario logueado
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r to-purple-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-40 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={
                usuario.fotoPerfil ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* Info principal */}
        <div className="mt-20 text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {usuario.nombre} {usuario.apellido}
          </h2>
          <p className="text-gray-500">@{usuario.nombreUsuario}</p>
          <span className="mt-3 inline-block bg-indigo-100 text-indigo-700 text-sm px-5 py-1 rounded-full font-medium">
            {usuario.cargo}
          </span>
        </div>

        {/* Info detallada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              📧 Información de contacto
            </h3>
            <p>
              <strong>Correo:</strong> {usuario.correoElectronico}
            </p>
          </div>

          {usuario.empresa && (
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                🏢 Empresa
              </h3>
              <p>
                <strong>Nombre:</strong> {usuario.empresa.nombre}
              </p>
              <p>
                <strong>Dirección:</strong> {usuario.empresa.direccion}
              </p>
            </div>
          )}

          {usuario.area && (
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm md:col-span-2">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                📂 Área
              </h3>
              <p>
                <strong>Nombre:</strong> {usuario.area.nombre_area}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {usuario.area.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Botón editar */}
        <div className="text-center pb-8">
          <button className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition">
            ✏️ Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

