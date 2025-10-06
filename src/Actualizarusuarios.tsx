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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Editar Usuario</h2>
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
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarUsuarioModal;
