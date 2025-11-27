import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaFileExcel,
  FaEdit,
  FaTrash,
  FaHashtag,
  FaBuilding,
  FaUserTie,
  FaEnvelope,
  FaIdBadge,
  FaChevronLeft,
  FaChevronRight,
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
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioToken | null>(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;
  const [refreshing, setRefreshing] = useState(false);

  const apiListar = import.meta.env.VITE_API_LISTARUSUARIOS;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARUSUARIO;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiBulk = import.meta.env.VITE_API_BULK;

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1f2937',
    });
  };

  const obtenerUsuarios = async (id_empresa?: number, showLoading: boolean = true) => {
    const empresaId = id_empresa || usuarioLogueado?.id_empresa;
    if (!empresaId) {
      showToast("error", "No se encontró la empresa del usuario");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "Usuario no autenticado");
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const base = apiListar.endsWith("/") ? apiListar : `${apiListar}/`;
      const res = await fetch(`${base}${empresaId}`, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // 🔹 FILTRAR SOLO USUARIOS DE LA MISMA EMPRESA
      const usuariosFiltrados = Array.isArray(data.datos) 
        ? data.datos.filter((usuario: Usuario) => 
            Number(usuario.idEmpresa) === Number(empresaId)
          )
        : [];
      
      setUsuarios(usuariosFiltrados);
      
      if (!showLoading) {
        showToast("success", "Lista actualizada");
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuarios([]);
      if (showLoading) {
        showToast("error", "Error cargando usuarios");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔹 AUTORECARGA CADA 30 SEGUNDOS
  useEffect(() => {
    if (!usuarioLogueado) return;

    obtenerUsuarios(usuarioLogueado.id_empresa);

    // Configurar intervalo de autorecarga
    const interval = setInterval(() => {
      obtenerUsuarios(usuarioLogueado.id_empresa, false);
    }, 30000); // 30 segundos

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [usuarioLogueado]);

  // 🔹 RECARGAR MANUALMENTE
  const recargarManual = () => {
    obtenerUsuarios(usuarioLogueado?.id_empresa, false);
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      setUsuarioLogueado(u);
    }
  }, []);

  const eliminarUsuario = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: "#ffffff",
      color: "#1f2937",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
       showToast("success", "Usuario eliminado correctamente");
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
      showToast("error", "No se pudo eliminar el usuario");
    }
  };

  const actualizarUsuario = (usuarioActualizado: Usuario) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
    );
    setUsuarioAEditar(null);
    showToast("success", "Usuario actualizado correctamente");
  };

  // 🔹 AGREGAR NUEVO USUARIO SIN RECARGAR
  const agregarNuevoUsuario = (nuevoUsuario: Usuario) => {
    setUsuarios((prev) => [nuevoUsuario, ...prev]);
    setMostrarModalCrear(false);
    showToast("success", "Usuario creado correctamente");
  };

  // 🔹 FILTRAR USUARIOS SOLO DE LA MISMA EMPRESA Y APLICAR BÚSQUEDA
  const usuariosFiltrados = usuarios
    .filter(usuario => 
      Number(usuario.idEmpresa) === Number(usuarioLogueado?.id_empresa)
    )
    .filter((u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
      u.correoElectronico.toLowerCase().includes(filtro.toLowerCase()) ||
      u.cargo.toLowerCase().includes(filtro.toLowerCase()) ||
      u.id.toString().includes(filtro)
    );

  // 🔹 PAGINACIÓN
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indiceInicial = (paginaActual - 1) * usuariosPorPagina;
  const indiceFinal = indiceInicial + usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <FaUsers className="text-white text-2xl" />
            </div>
            Administración de Usuarios
          </h1>
        </div>
        <button
          onClick={() => setMostrarModalCrear(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-lg" /> Nuevo Usuario
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuarios por nombre, apellido, usuario, correo, cargo o ID..."
              className="w-full px-4 py-4 pl-14 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
          </div>
        </div>
      </div>

      {/* CONTADOR Y CARGA MASIVA - MÁS COMPACTO */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* CONTADOR MÁS PEQUEÑO */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{usuariosFiltrados.length}</h3>
              <p className="text-blue-100 text-sm">Usuarios</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <FaHashtag className="text-lg" />
            </div>
          </div>
        </div>

        {/* CARGA MASIVA */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
              <FaFileExcel className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">
                Carga Masiva desde Excel
              </h2>
              <p className="text-gray-600 text-xs">
                Registra múltiples usuarios a la vez mediante un archivo Excel
              </p>
            </div>
            <UploadExcel
              apiBulk={apiBulk}
              onUsuariosCreados={() => obtenerUsuarios(usuarioLogueado?.id_empresa, false)}
            />
          </div>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-pulse">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                Cargando usuarios...
              </h3>
            </div>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              No hay usuarios
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {usuarios.length === 0 
                ? "Comienza registrando el primer usuario de tu empresa" 
                : "No se encontraron usuarios con los criterios de búsqueda"}
            </p>
            <button
              onClick={() => setMostrarModalCrear(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Crear Primer Usuario
            </button>
          </div>
        ) : (
          <>
            {/* TABLA */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <FaIdBadge />
                        ID
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <FaUserTie />
                        Información Personal
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <FaEnvelope />
                        Contacto
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <FaBuilding />
                        Empresa y Área
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Fecha Registro
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-sm">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuariosPaginados.map((usuario, index) => (
                    <tr 
                      key={usuario.id} 
                      className={`hover:bg-blue-50 transition-colors duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold text-sm">
                            #{usuario.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                          <div className="text-gray-600 mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                              {usuario.cargo}
                            </span>
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            @{usuario.nombreUsuario}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 text-sm">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-purple-500 text-xs" />
                            {usuario.correoElectronico}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FaBuilding className="text-blue-500 text-xs" />
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                              {usuario.empresa?.nombre || "Mi Empresa"}
                            </span>
                          </div>
                          {usuario.area && (
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs inline-block">
                              {usuario.area.descripcion}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-600 text-xs">
                          <div className="font-medium">Creado:</div>
                          <div>{formatearFecha(usuario.createdAt)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setUsuarioAEditar(usuario)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
                            title="Editar usuario"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => eliminarUsuario(usuario.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
                            title="Eliminar usuario"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 text-xs">
                    Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 1}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-2 rounded-lg transition-all duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    
                    {[...Array(totalPaginas)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => cambiarPagina(i + 1)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all duration-300 text-xs ${
                          paginaActual === i + 1
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-2 rounded-lg transition-all duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALES */}
      {usuarioAEditar && (
        <ActualizarUsuarioModal
          usuario={usuarioAEditar}
          onClose={() => setUsuarioAEditar(null)}
          onUpdate={actualizarUsuario}
        />
      )}

      {mostrarModalCrear && usuarioLogueado && (
        <RegistrarUsuario
          empresaSeleccionada={{
            idEmpresa: usuarioLogueado.id_empresa,
            nombre: "Mi Empresa" // Puedes obtener el nombre real de la empresa si lo tienes
          }}
          areasFiltradas={[]} // Puedes cargar las áreas si las necesitas
          loading={false}
          onClose={() => setMostrarModalCrear(false)}
          onSubmit={async (e: React.FormEvent) => {
            e.preventDefault();
            // Aquí manejarías el envío del formulario
            // Por ahora simulamos la creación exitosa
            const nuevoUsuario: Usuario = {
              id: Math.max(...usuarios.map(u => u.id), 0) + 1,
              idEmpresa: usuarioLogueado.id_empresa,
              idArea: 1,
              nombre: "Nuevo",
              apellido: "Usuario",
              nombreUsuario: "nuevo.usuario",
              correoElectronico: "nuevo@empresa.com",
              cargo: "Nuevo Cargo",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              empresa: { idEmpresa: usuarioLogueado.id_empresa, nombre: "Mi Empresa" }
            };
            agregarNuevoUsuario(nuevoUsuario);
          }}
          usuarioForm={{
            id_empresa: usuarioLogueado.id_empresa.toString(),
            id_area: "",
            nombre: "",
            apellido: "",
            nombre_usuario: "",
            correo_electronico: "",
            cargo: "",
            contrasena: "",
            confirmacion: ""
          }}
          onFormChange={() => {}}
        />
      )}
    </div>
  );
};

export default AdmUsuariosCompleto;