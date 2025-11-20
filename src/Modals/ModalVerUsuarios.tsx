import React from "react";
import { FaUsers, FaFileExcel, FaUserPlus, FaTimes, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import UploadExcel from "../Admin/Excel"

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

interface Area {
  idArea: number;
  nombre: string;
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
  rol?: string;
}

interface ModalVerUsuariosProps {
  empresaSeleccionada: Empresa;
  usuariosFiltrados: Usuario[];
  busquedaUsuarios: string;
  areas: Area[];
  onClose: () => void;
  onBuscarUsuarios: (termino: string) => void;
  onAbrirModalExcel: () => void;
  onAbrirModalCrearUsuario: () => void;
  onAbrirModalEditarUsuario: (usuario: Usuario) => void;
  onEliminarUsuario: (id: number) => void;
  apiBulkUsuarios: string;
  onUsuariosCreados: () => void;
}

const ModalVerUsuarios: React.FC<ModalVerUsuariosProps> = ({
  empresaSeleccionada,
  usuariosFiltrados,
  busquedaUsuarios,
  areas,
  onClose,
  onBuscarUsuarios,
  onAbrirModalExcel,
  onAbrirModalCrearUsuario,
  onAbrirModalEditarUsuario,
  onEliminarUsuario,
  apiBulkUsuarios,
  onUsuariosCreados,
}) => {
  const obtenerRolUsuario = (usuario: Usuario): string => {
    if (usuario.cargo && usuario.cargo.toLowerCase().includes('admin')) return 'administrador';
    if (usuario.nombreUsuario && usuario.nombreUsuario.toLowerCase().includes('sst')) return 'sg-sst';
    return 'usuario';
  };

  const obtenerNombreCompleto = (usuario: Usuario): string => {
    return `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || usuario.nombreUsuario || 'Sin nombre';
  };

  const obtenerNombreArea = (idArea: number): string => {
    const area = areas.find(a => a.idArea === idArea);
    return area ? area.nombre : 'Sin área';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-blue-100">
        {/* HEADER DEL MODAL */}
        <div className="p-6 border-b border-gray-200 bg-white sticky top-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-xl">
                  <FaUsers className="text-white text-lg" />
                </div>
                Usuarios de {empresaSeleccionada.nombre}
              </h2>
              <p className="text-gray-600">Total: {usuariosFiltrados.length} usuarios</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onAbrirModalExcel}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg"
              >
                <FaFileExcel /> Cargar Excel
              </button>
              <button 
                onClick={onAbrirModalCrearUsuario}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg"
              >
                <FaUserPlus /> Crear Usuario
              </button>
              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="mt-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios por nombre, correo o cargo..."
                value={busquedaUsuarios}
                onChange={(e) => onBuscarUsuarios(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {usuariosFiltrados.length > 0 ? (
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nombre Completo</th>
                  <th className="p-3 text-left">Usuario</th>
                  <th className="p-3 text-left">Correo</th>
                  <th className="p-3 text-left">Cargo</th>
                  <th className="p-3 text-left">Área</th>
                  <th className="p-3 text-left">Rol</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="border-t hover:bg-blue-50 transition-colors">
                    <td className="p-3 font-medium">{usuario.id}</td>
                    <td className="p-3 font-medium">{obtenerNombreCompleto(usuario)}</td>
                    <td className="p-3">{usuario.nombreUsuario}</td>
                    <td className="p-3">{usuario.correoElectronico}</td>
                    <td className="p-3">{usuario.cargo}</td>
                    <td className="p-3">{obtenerNombreArea(usuario.idArea)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        obtenerRolUsuario(usuario) === 'administrador' ? 'bg-purple-100 text-purple-800' :
                        obtenerRolUsuario(usuario) === 'sg-sst' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {obtenerRolUsuario(usuario)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onAbrirModalEditarUsuario(usuario)}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-2 rounded-xl transition-all duration-300 shadow-lg"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => onEliminarUsuario(usuario.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-xl transition-all duration-300 shadow-lg"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaUsers className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>No se encontraron usuarios</p>
              {busquedaUsuarios && <p className="text-sm">Intenta con otros términos de búsqueda</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalVerUsuarios;