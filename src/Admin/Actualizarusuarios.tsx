import { useState } from "react";

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
        headers: {'ngrok-skip-browser-warning': 'true',
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Editar Usuario</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="idArea"
            value={form.idArea}
            onChange={handleChange}
            placeholder="ID Área"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="nombreUsuario"
            value={form.nombreUsuario}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="email"
            name="correoElectronico"
            value={form.correoElectronico}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="cargo"
            value={form.cargo}
            onChange={handleChange}
            placeholder="Cargo"
            className="w-full p-2 border rounded-lg"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarUsuarioModal;
