import React from "react";
import { FaBuilding, FaTimes, FaMapMarkerAlt, FaHashtag, FaFileAlt, FaTag, FaSave } from "react-icons/fa";

interface ModalEmpresaProps {
  modoEdicion: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    nombreEmp: string;
    direccion: string;
    nit: string;
    estadoEmp: boolean;
    esquemaEmp: string;
    aliasEmp: string;
  };
  onFormChange: (field: string, value: any) => void;
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  modoEdicion,
  loading,
  onClose,
  onSubmit,
  formData,
  onFormChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
                <FaBuilding className="text-white text-lg" />
              </div>
              {modoEdicion ? "Editar Empresa" : "Registrar Empresa"}
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaBuilding className="text-blue-500" /> Nombre *
            </label>
            <input 
              type="text" 
              value={formData.nombreEmp} 
              onChange={(e) => onFormChange("nombreEmp", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" /> Dirección
            </label>
            <input 
              type="text" 
              value={formData.direccion} 
              onChange={(e) => onFormChange("direccion", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaHashtag className="text-purple-500" /> NIT
              </label>
              <input 
                type="text" 
                value={formData.nit} 
                onChange={(e) => onFormChange("nit", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaFileAlt className="text-orange-500" /> Esquema
              </label>
              <input 
                type="text" 
                value={formData.esquemaEmp} 
                onChange={(e) => onFormChange("esquemaEmp", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaTag className="text-yellow-500" /> Alias
            </label>
            <input 
              type="text" 
              value={formData.aliasEmp} 
              onChange={(e) => onFormChange("aliasEmp", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" 
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.estadoEmp} 
              onChange={(e) => onFormChange("estadoEmp", e.target.checked)}
              className="accent-blue-600" 
            />
            <span>Empresa activa</span>
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
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
              {loading ? "Guardando..." : (modoEdicion ? "Actualizar" : "Registrar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEmpresa;