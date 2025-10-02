import React, { useEffect, useState } from "react";
import ActualizarUsuarioModal from "./Actualizarusuarios";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";
import { FaUsers, FaPlus, FaSearch } from "react-icons/fa";

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

interface Area {
  idArea: number;
  descripcion: string;
}

interface Usuario {
  id: number;
  idEmpresa: number;
  idArea: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  createdAt: string;
  updatedAt: string;
  empresa?: Empresa;
  area?: Area;
}

const AdmUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioToken | null>(null);

  const apiListar = import.meta.env.VITE_API_LISTARUSUARIOS;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARUSUARIO;
  const apiActualizar = import.meta.env.VITE_API_ACTUALIZARUSUARIO;

  const obtenerUsuarios = async (id_empresa?: number) => {
    const empresaId = id_empresa || usuarioLogueado?.idEmpresa;
    if (!empresaId) return alert("No se encontró la empresa del usuario");

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const url = `${apiListar}${empresaId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUsuarios(Array.isArray(data.datos) ? data.datos : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      const usuario = { ...u, idEmpresa: u.id_empresa };
      setUsuarioLogueado(usuario);
      obtenerUsuarios(usuario.idEmpresa);
    }
  }, []);

  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerUsuarios();
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
    }
  };

  const actualizarUsuario = async (usuario: Usuario) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch(`${apiActualizar}${usuario.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    setUsuarioAEditar(null);
    obtenerUsuarios();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
};

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
      u.id.toString().includes(filtro)
  );

  return (
    <div
      className="min-h-screen p-8 relative"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUsers className="text-yellow-500" /> Administración de Usuarios
          </h1>
          <button
            onClick={() => (window.location.href = "/registro")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow transition"
          >
            <FaPlus className="inline mr-2" /> Crear Usuario
          </button>
        </div>

        {/* BARRA DE BUSQUEDA */}
        <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-md mb-6">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full border-0 focus:ring-0 text-gray-700"
          />
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Apellido</th>
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Cargo</th>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Área</th>
                <th className="px-4 py-3 text-center" colSpan={2}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, idx) => (
                <tr
                  key={u.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.nombre}</td>
                  <td className="px-4 py-2">{u.apellido}</td>
                  <td className="px-4 py-2">{u.nombreUsuario}</td>
                  <td className="px-4 py-2">{u.correoElectronico}</td>
                  <td className="px-4 py-2">{u.cargo}</td>
                  <td className="px-4 py-2">{u.empresa?.nombre || "-"}</td>
                  <td className="px-4 py-2">{u.area?.descripcion || "-"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setUsuarioAEditar(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {usuarioAEditar && (
          <ActualizarUsuarioModal
            usuario={usuarioAEditar}
            onClose={() => setUsuarioAEditar(null)}
            onUpdate={actualizarUsuario}
          />
        )}
      </div>
    </div>
  );
};

export default AdmUsuarios;
