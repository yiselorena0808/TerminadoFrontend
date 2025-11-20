import React from "react";
import { FaEdit, FaTimes, FaUser, FaIdCard, FaEnvelope, FaBuilding, FaSave } from "react-icons/fa";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  idArea: number;
}

interface ModalEditarUsuarioProps {
  usuarioAEditar: Usuario;
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  usuarioEditForm: {
    nombre: string;
    apellido: string;
    nombre_usuario: string;
    correo_electronico: string;
    cargo: string;
    id_area: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = ({
  usuarioAEditar,
  loading,
  onClose,
  onSubmit,
  usuarioEditForm,
  onFormChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-xl">
                <FaEdit className="text-white text-lg" />
              </div>
              Editar Usuario
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-300"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-blue-500" /> Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={usuarioEditForm.nombre}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-blue-500" /> Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={usuarioEditForm.apellido}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaIdCard className="text-purple-500" /> Usuario *
              </label>
              <input
                type="text"
                name="nombre_usuario"
                value={usuarioEditForm.nombre_usuario}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaEnvelope className="text-red-500" /> Correo *
              </label>
              <input
                type="email"
                name="correo_electronico"
                value={usuarioEditForm.correo_electronico}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaBuilding className="text-green-500" /> Área *
              </label>
              <input
                type="number"
                name="id_area"
                value={usuarioEditForm.id_area}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-orange-500" /> Cargo
              </label>
              <input
                type="text"
                name="cargo"
                value={usuarioEditForm.cargo}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;