import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaFileExcel,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import ActualizarUsuarioModal from "../Admin/Actualizarusuarios";
import UploadExcel from "../Admin/Excel";
import RegistrarUsuario from "./CrearUsuario";

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

interface Area {
  idArea: number;
  descripcion: string;
}

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

const AdmUsuariosCompleto: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] =
    useState<UsuarioToken | null>(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const apiListar = import.meta.env.VITE_API_LISTARUSUARIOS;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARUSUARIO;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiBulk = import.meta.env.VITE_API_BULK;

  const obtenerUsuarios = async (id_empresa?: number) => {
    const empresaId = id_empresa || usuarioLogueado?.id_empresa;
    if (!empresaId)
      return Swal.fire("Error", "No se encontró la empresa del usuario", "error");

    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Usuario no autenticado", "error");

    try {
      const base = apiListar.endsWith("/") ? apiListar : `${apiListar}/`;
      const res = await fetch(`${base}${empresaId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
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
      setUsuarioLogueado(u);
      obtenerUsuarios(u.id_empresa);
    }
  }, []);

  const eliminarUsuario = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));


      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
      Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
  };

  const actualizarUsuario = (usuarioActualizado: Usuario) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
    );
    setUsuarioAEditar(null);
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
      u.id.toString().includes(filtro)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* 🔸 TÍTULO PRINCIPAL */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaUsers className="text-blue-600" /> Administración de Usuarios
        </h1>
        <button
          onClick={() => setMostrarModalCrear(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition"
        >
          <FaPlus className="inline mr-2" /> Crear Usuario
        </button>
      </div>

      {/* 🔸 SECCIÓN DE BUSCADOR */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-500" /> Buscar Usuarios
        </h2>
        <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o ID..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full bg-transparent border-0 focus:ring-0 text-gray-700"
          />
        </div>
      </div>

      {/* 🔸 SECCIÓN DE CARGA MASIVA */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaFileExcel className="text-green-600" /> Registra usuarios desde Excel
        </h2>
        <UploadExcel
          apiBulk={apiBulk}
          onUsuariosCreados={() => obtenerUsuarios(usuarioLogueado?.id_empresa)}
        />
      </div>

      {/* 🔸 TABLA DE USUARIOS */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUsers className="text-blue-600" /> Lista de Usuarios Registrados
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="min-w-full text-sm text-gray-800 border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Apellido</th>
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Cargo</th>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Área</th>
                <th className="px-4 py-3 text-center" colSpan={2}>
                  Acciones
                </th>
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
                    <button
                      onClick={() => setUsuarioAEditar(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-xl transition shadow"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition shadow"
                    >
                      <FaTrash />
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
      </div>

      {/* 🔸 MODALES */}
      {usuarioAEditar && (
        <ActualizarUsuarioModal
          usuario={usuarioAEditar}
          onClose={() => setUsuarioAEditar(null)}
          onUpdate={actualizarUsuario}
        />
      )}

      {mostrarModalCrear && (
        <RegistrarUsuario
          onClose={() => setMostrarModalCrear(false)}
          onUsuarioCreado={() => obtenerUsuarios(usuarioLogueado?.id_empresa)}
          apiEmpresas={apiEmpresas}
          apiAreas={apiAreas}
          apiRegister={apiRegister}
          mostrarComoModal={true}
        />
      )}
    </div>
  );
};

export default AdmUsuariosCompleto;
