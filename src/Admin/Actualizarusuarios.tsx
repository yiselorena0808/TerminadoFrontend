import { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";

interface Usuario {
  id: number;
  idArea: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
}

interface Props {
  usuario: Usuario;
  onClose: () => void;
  onUpdate: (usuario: Usuario) => void;
}

const ActualizarUsuarioModal: React.FC<Props> = ({ usuario, onClose, onUpdate }) => {
  const [form, setForm] = useState<Usuario>(usuario);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones básicas
    if (!form.nombre || !form.apellido || !form.nombreUsuario || !form.correoElectronico) {
      setErrorMsg("Todos los campos obligatorios deben ser completados.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        id_area: form.idArea,
        nombre: form.nombre,
        apellido: form.apellido,
        nombre_usuario: form.nombreUsuario,
        correo_electronico: form.correoElectronico,
        cargo: form.cargo,
      };

      const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARUSUARIO}${form.id}`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.datos) {
        onUpdate(data.datos);
        onClose();
      } else {
        console.error("Error al actualizar usuario:", data);
        setErrorMsg(data.error || data.mensaje || "No se pudo actualizar el usuario.");
      }
    } catch (error: any) {
      console.error("Error en la conexión:", error);
      setErrorMsg("Error en la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-blue-100">
        {/* Header del Modal */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-3xl">
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

        {/* Contenido del Formulario */}
        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ID Área *
                </label>
                <input
                  type="number"
                  name="idArea"
                  value={form.idArea}
                  onChange={handleChange}
                  placeholder="ID del Área"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cargo
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={form.cargo}
                  onChange={handleChange}
                  placeholder="Cargo del usuario"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del usuario"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Apellido del usuario"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  name="nombreUsuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={form.correoElectronico}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaEdit className="text-lg" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActualizarUsuarioModal;