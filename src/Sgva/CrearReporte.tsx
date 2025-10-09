import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import Swal from "sweetalert2";
import { FaHardHat, FaPaperPlane, FaUser } from "react-icons/fa";

const CrearReporte: React.FC = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [buscar, setBuscar] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    cargo: "",
    cedula: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    estado: "Pendiente",
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [archivos, setArchivos] = useState<File | null>(null);

  const apiCrearReporte = import.meta.env.VITE_API_REGISTROREPORTE;
  const apiUsuariosBase = import.meta.env.VITE_API_LISTARUSUARIOS;

  // --- Cargar usuario autenticado ---
  useEffect(() => {
    const u = getUsuarioFromToken();
    if (!u) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Usuario no autenticado. Inicia sesión.",
        showConfirmButton: false,
        timer: 3000,
      });
      navigate("/login");
      return;
    }
    setUsuario(u);
  }, [navigate]);

  // --- Cargar usuarios de la empresa ---
  useEffect(() => {
    if (showModal && usuario) {
      const token = localStorage.getItem("token");
      if (!token) return;

      const base = apiUsuariosBase.endsWith("/")
        ? apiUsuariosBase
        : `${apiUsuariosBase}/`;
      const url = `${base}${usuario.id_empresa}`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error HTTP ${res.status}: ${errorText}`);
          }
          const data = await res.json();
          if (Array.isArray(data.datos)) setUsuarios(data.datos);
          else if (Array.isArray(data.usuarios)) setUsuarios(data.usuarios);
          else if (Array.isArray(data)) setUsuarios(data);
          else setUsuarios([]);
        })
        .catch((error) => {
          console.error("❌ Error al obtener usuarios:", error);
          Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
          setUsuarios([]);
        });
    }
  }, [showModal, usuario, apiUsuariosBase]);

  // --- Manejar campos ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (
    icon: "success" | "error" | "warning",
    title: string
  ) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  // --- Enviar formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userFinal = usuarioSeleccionado || usuario;
    if (!userFinal) return showToast("error", "Usuario no autenticado");

    const token = localStorage.getItem("token");
    if (!token) return showToast("error", "No hay token");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      if (imagen) data.append("imagen", imagen);
      if (archivos) data.append("archivos", archivos);

      // ✅ Datos del usuario seleccionado
      data.append("id_usuario", String(userFinal.id));
      data.append("nombre_usuario", userFinal.nombre);
      data.append("id_empresa", String(userFinal.id_empresa));

      const res = await fetch(apiCrearReporte, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        const result = await res.json();
        return showToast("error", result.error || "Error al enviar reporte");
      }

      showToast("success", "Reporte creado correctamente ✅");
      navigate("/nav/crearReportes");
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showToast("error", "Ocurrió un error al enviar el reporte");
    }
  };

  // --- Render ---
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/fotos-premium/equipos-proteccion-personal-para-la-seguridad-industrial_1033579-251259.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-yellow-900/40 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-yellow-500"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaHardHat className="text-yellow-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Crear Reporte SST</h2>
        </div>

        {/* Usuario seleccionado */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-semibold">
              Reporte por:{" "}
              <span className="text-yellow-700">
                {usuarioSeleccionado
                  ? usuarioSeleccionado.nombre
                  : usuario?.nombre}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <FaUser /> Seleccionar Usuario
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />
          <input
            type="text"
            name="lugar"
            placeholder="Lugar"
            value={formData.lugar}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="border p-3 rounded-xl col-span-2"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Revisado">Revisado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-3 rounded-xl w-full mt-4"
          rows={4}
        />

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Archivos:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setArchivos(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2"
        >
          <FaPaperPlane /> Enviar Reporte
        </button>
      </form>

      {/* Modal seleccionar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold mb-3 text-gray-700">
              Seleccionar Usuario
            </h3>
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {usuarios
                .filter((u) =>
                  u.nombre.toLowerCase().includes(buscar.toLowerCase())
                )
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setUsuarioSeleccionado(u);
                      setShowModal(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-100 border-b"
                  >
                    {u.nombre} - {u.cargo}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearReporte;
