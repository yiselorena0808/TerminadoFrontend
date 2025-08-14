import React, { useState, useEffect } from "react";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  cedula: number;            
  nombre_usuario: string;
  correo_electronico: string;
  cargo: string;
  contrasena: string;          
  fecha_registro: string;      
}

interface Props {
  usuario: Usuario;
  onClose: () => void;
  onUpdate: (usuario: Usuario) => void;
}

const ActualizarUsuarioModal: React.FC<Props> = ({ usuario, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Usuario>(usuario);
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    setFormData(usuario);
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "cedula" ? Number(value) : value,  
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.nombre_usuario || !formData.correo_electronico || !formData.cargo) {
      setMensaje("Todos los campos obligatorios deben estar completos.");
      return;
    }

    setMensaje("");
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Actualizar Usuario</h2>

        {mensaje && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{mensaje}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <input
              type="number"
              name="id"
              value={formData.id}
              readOnly
              disabled
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cargo</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Ingresa nueva contraseña o deja vacía para no cambiar"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
            <input
              type="date"
              name="fecha_registro"
              value={formData.fecha_registro ? formData.fecha_registro.substring(0, 10) : ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarUsuarioModal;
