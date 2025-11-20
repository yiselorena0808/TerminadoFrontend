import React, { useState } from "react";
import { FaUserPlus, FaTimes, FaUser, FaIdCard, FaEnvelope, FaBuilding, FaKey, FaSave } from "react-icons/fa";

interface Area {
  idArea: number;
  nombre: string;
}

interface ModalCrearUsuarioProps {
  empresaSeleccionada: { idEmpresa: number; nombre: string };
  areasFiltradas: Area[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  usuarioForm: {
    id_empresa: string;
    id_area: string;
    nombre: string;
    apellido: string;
    nombre_usuario: string;
    correo_electronico: string;
    cargo: string;
    contrasena: string;
    confirmacion: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ModalCrearUsuario: React.FC<ModalCrearUsuarioProps> = ({
  empresaSeleccionada,
  areasFiltradas,
  loading,
  onClose,
  onSubmit,
  usuarioForm,
  onFormChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
                <FaUserPlus className="text-white text-lg" />
              </div>
              Crear Nuevo Usuario - {empresaSeleccionada.nombre}
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
                placeholder="Nombre del usuario"
                value={usuarioForm.nombre}
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
                placeholder="Apellido del usuario"
                value={usuarioForm.apellido}
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
                placeholder="Nombre de usuario"
                value={usuarioForm.nombre_usuario}
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
                placeholder="correo@ejemplo.com"
                value={usuarioForm.correo_electronico}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaBuilding className="text-green-500" /> Área *
            </label>
            <select
              name="id_area"
              value={usuarioForm.id_area}
              onChange={onFormChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              required
            >
              <option value="">Seleccione un Área</option>
              {areasFiltradas.map((area) => (
                <option key={area.idArea} value={area.idArea}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="text-orange-500" /> Cargo
            </label>
            <input
              type="text"
              name="cargo"
              placeholder="Cargo del usuario"
              value={usuarioForm.cargo}
              onChange={onFormChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaKey className="text-yellow-500" /> Contraseña *
              </label>
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={usuarioForm.contrasena}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaKey className="text-yellow-500" /> Confirmar *
              </label>
              <input
                type="password"
                name="confirmacion"
                placeholder="Confirmar contraseña"
                value={usuarioForm.confirmacion}
                onChange={onFormChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaUserPlus />}
              {loading ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearUsuario;