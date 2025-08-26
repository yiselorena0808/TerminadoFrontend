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
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<Usuario>>({});

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    if (datos) {
      const usuarioParseado = JSON.parse(datos);
      setUsuario(usuarioParseado);
      setFormData(usuarioParseado);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!usuario) return;

    try {
      const res = await fetch(
        `http://localhost:3333/actualizarUsuario/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        const actualizado = await res.json();
        setUsuario(actualizado.datos); // 👈 backend devuelve { msj, datos }
        localStorage.setItem("usuario", JSON.stringify(actualizado.datos));
        setEditando(false);
      } else {
        console.error("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          {editando ? (
            <>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                className="border rounded px-3 py-1 mb-2"
              />
              <input
                type="text"
                name="apellido"
                value={formData.apellido || ""}
                onChange={handleChange}
                className="border rounded px-3 py-1 mb-2 ml-2"
              />
              <br />
              <input
                type="text"
                name="cargo"
                value={formData.cargo || ""}
                onChange={handleChange}
                className="border rounded px-3 py-1 mb-2"
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800">
                {usuario.nombre} {usuario.apellido}
              </h2>
              <p className="text-gray-500">@{usuario.nombreUsuario}</p>
              <span className="mt-3 inline-block bg-indigo-100 text-indigo-700 text-sm px-5 py-1 rounded-full font-medium">
                {usuario.cargo}
              </span>
            </>
          )}
        </div>

        {/* Info detallada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              📧 Información de contacto
            </h3>
            {editando ? (
              <input
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico || ""}
                onChange={handleChange}
                className="border rounded px-3 py-1 w-full"
              />
            ) : (
              <p>
                <strong>Correo:</strong> {usuario.correoElectronico}
              </p>
            )}
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

        {/* Botones */}
        <div className="text-center pb-8 space-x-3">
          {editando ? (
            <>
              <button
                onClick={handleGuardar}
                className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
              >
                💾 Guardar
              </button>
              <button
                onClick={() => setEditando(false)}
                className="px-6 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow-md transition"
              >
                ❌ Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
            >
              ✏️ Editar perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
