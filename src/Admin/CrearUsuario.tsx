import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface ModalRegistroUsuarioProps {
  onClose: () => void;
  onUsuarioCreado: () => void;
}

const RegistrarUsuario: React.FC<ModalRegistroUsuarioProps> = ({
  onClose,
  onUsuarioCreado,
}) => {
  // Datos API
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;

  // Estados
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    id_empresa: "",
    id_area: "",
    nombre: "",
    apellido: "",
    nombre_usuario: "",
    correo_electronico: "",
    cargo: "",
    contrasena: "",
    confirmacion: "",
  });

  // -------------------------------
  // LISTAR EMPRESAS
  // -------------------------------
  useEffect(() => {
    fetch(apiEmpresas, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data.datos || []))
      .catch(() => setEmpresas([]));
  }, []);

  // -------------------------------
  // LISTAR ÁREAS POR EMPRESA
  // -------------------------------
  useEffect(() => {
    if (!formData.id_empresa) {
      setAreas([]);
      return;
    }

    fetch(apiAreas, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtradas = Array.isArray(data)
          ? data.filter(
              (a: any) => a.idEmpresa === Number(formData.id_empresa)
            )
          : [];
        setAreas(filtradas);
      })
      .catch(() => setAreas([]));
  }, [formData.id_empresa]);

  // -------------------------------
  // FORM CONTROL
  // -------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // REGISTRAR USUARIO
  // -------------------------------
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmacion)
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");

    try {
      const body = {
        ...formData,
        id_empresa: Number(formData.id_empresa),
        id_area: Number(formData.id_area),
      };

      const res = await fetch(apiRegister, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Éxito", "Usuario registrado correctamente", "success");
        onUsuarioCreado();
        onClose();
      } else {
        Swal.fire("Error", data.error || "No se pudo registrar", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          Registro de Usuario
        </h2>

        {/* FORMULARIO */}
        <form className="space-y-4" onSubmit={registrar}>
          <select
            name="id_empresa"
            value={formData.id_empresa}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Seleccione una Empresa</option>
            {empresas.map((e) => (
              <option key={e.idEmpresa} value={e.idEmpresa}>
                {e.nombre}
              </option>
            ))}
          </select>

          <select
            name="id_area"
            value={formData.id_area}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Seleccione un Área</option>
            {areas.map((a) => (
              <option key={a.idArea} value={a.idArea}>
                {a.descripcion}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre de usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="email"
            name="correo_electronico"
            placeholder="Correo electrónico"
            value={formData.correo_electronico}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            name="confirmacion"
            placeholder="Confirmar contraseña"
            value={formData.confirmacion}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold"
            >
              Registrar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarUsuario;
