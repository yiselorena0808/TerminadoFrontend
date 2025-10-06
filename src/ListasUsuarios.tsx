import React, { useEffect, useState } from "react";
import ActualizarUsuarioModal from "./Actualizarusuarios";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";
import { FaUsers, FaPlus, FaSearch } from "react-icons/fa";

interface Empresa { idEmpresa: number; nombre: string; }
interface Area { idArea: number; descripcion: string; }

export interface Usuario {
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

  // Cargar usuarios
  const obtenerUsuarios = async (id_empresa?: number) => {
    const empresaId = id_empresa || usuarioLogueado?.id_empresa;
    if (!empresaId) return alert("No se encontró la empresa del usuario");

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(`${apiListar}${empresaId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
      setUsuarioLogueado({ ...u, id_empresa: u.id_empresa });
      obtenerUsuarios(u.id_empresa);
    }
  }, []);

  // Eliminar usuario
  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
    }
  };

  // Actualizar usuario: reemplaza solo el usuario editado
  const actualizarUsuario = (usuarioActualizado: Usuario) => {
    setUsuarios(prev => prev.map(u => u.id === usuarioActualizado.id ? usuarioActualizado : u));
    setUsuarioAEditar(null);
  };

  const usuariosFiltrados = usuarios.filter(
    u =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
      u.id.toString().includes(filtro)
  );

  return (
    <div className="min-h-screen p-8 relative" style={{
      backgroundImage: "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
      backgroundSize: "cover", backgroundPosition: "center"
    }}>
      <div className="max-w-7xl mx-auto">
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUsers className="text-yellow-500"/> Administración de Usuarios
          </h1>
          <button onClick={() => (window.location.href="/registro")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow transition">
            <FaPlus className="inline mr-2"/> Crear Usuario
          </button>
        </div>

        {/* BUSQUEDA */}
        <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-md mb-6">
          <FaSearch className="text-gray-400 mr-2"/>
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
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
                <tr key={u.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.nombre}</td>
                  <td className="px-4 py-2">{u.apellido}</td>
                  <td className="px-4 py-2">{u.nombreUsuario}</td>
                  <td className="px-4 py-2">{u.correoElectronico}</td>
                  <td className="px-4 py-2">{u.cargo}</td>
                  <td className="px-4 py-2">{u.empresa?.nombre || "-"}</td>
                  <td className="px-4 py-2">{u.area?.descripcion || "-"}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => setUsuarioAEditar(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow">
                      Editar
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => eliminarUsuario(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow">
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

        {/* MODAL */}
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
