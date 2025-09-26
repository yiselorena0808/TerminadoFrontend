import React, { useEffect, useState } from "react";
import ActualizarUsuarioModal from "./Actualizarusuarios";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

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

  // Función para obtener usuarios de la misma empresa
  const obtenerUsuarios = async (id_empresa?: number) => {
    const empresaId = id_empresa || usuarioLogueado?.idEmpresa;
    console.log("ID de empresa usado:", empresaId);

    if (!empresaId) return alert("No se encontró la empresa del usuario");

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const url = `${apiListar}${empresaId}`;
      console.log("URL fetch:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) return alert("Token inválido o expirado");

      const data = await res.json();
      console.log("Datos recibidos:", data);

      setUsuarios(Array.isArray(data.datos) ? data.datos : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuarios([]);
    }
  };

  // Obtener usuario logueado y cargar usuarios automáticamente
  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      const usuario = { ...u, idEmpresa: u.id_empresa };
      setUsuarioLogueado(usuario);
      obtenerUsuarios(usuario.idEmpresa);
    } else {
      const localUser = JSON.parse(localStorage.getItem("usuario") || "{}");
      if (localUser?.id_empresa) {
        const usuario = { ...localUser, idEmpresa: localUser.id_empresa };
        setUsuarioLogueado(usuario);
        obtenerUsuarios(usuario.idEmpresa);
      }
    }
  }, []);

  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      alert(data.mensaje);
      obtenerUsuarios();
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const actualizarUsuario = async (usuario: Usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(`${apiActualizar}${usuario.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      const data = await res.json();
      alert(data.mensaje);
      setUsuarioAEditar(null);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
      u.id.toString().includes(filtro)
  );

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-900 drop-shadow-md">
          Administración de Usuarios
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => (window.location.href = "/registro")}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            + Crear Usuario
          </button>

          <input
            type="text"
            placeholder="Buscar por nombre o usuario"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-4 py-2 rounded-xl border border-blue-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm w-full md:w-1/3"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl border border-blue-200">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Apellido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Correo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Cargo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Empresa</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Área</th>
                <th className="px-4 py-3 text-center text-sm font-semibold" colSpan={2}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-200">
              {usuariosFiltrados.map((u, idx) => (
                <tr
                  key={u.id}
                  className={idx % 2 === 0 ? "bg-blue-50 hover:bg-blue-100" : "bg-blue-100 hover:bg-blue-200"}
                >
                  <td className="px-4 py-2 text-sm text-blue-900 font-medium">{u.id}</td>
                  <td className="px-4 py-2 text-sm text-blue-800">{u.nombre}</td>
                  <td className="px-4 py-2 text-sm text-blue-800">{u.apellido}</td>
                  <td className="px-4 py-2 text-sm text-blue-700">{u.nombreUsuario}</td>
                  <td className="px-4 py-2 text-sm text-blue-700">{u.correoElectronico}</td>
                  <td className="px-4 py-2 text-sm text-blue-800">{u.cargo}</td>
                  <td className="px-4 py-2 text-sm text-blue-800">{u.empresa?.nombre || "-"}</td>
                  <td className="px-4 py-2 text-sm text-blue-800">{u.area?.descripcion || "-"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setUsuarioAEditar(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-xl shadow transition transform hover:scale-105"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-xl shadow transition transform hover:scale-105"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-blue-500 font-medium">
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
