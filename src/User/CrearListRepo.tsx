import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import Swal from "sweetalert2";
import { FaArrowLeft, FaHardHat, FaPaperPlane } from "react-icons/fa";

interface Cargo {
  idCargo: number;
  cargo: string;
  idEmpresa: number;
}

const CrearListReporte: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [formData, setFormData] = useState({
    cargo: "",
    cedula: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    estado: "Pendiente",
  });
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [imagen, setImagen] = useState<File | null>(null);
  const [archivos, setArchivos] = useState<File | null>(null);

  const token = localStorage.getItem("token");
  const apiBase = import.meta.env.VITE_API_REGISTROREPORTE;

  // 🧩 Cargar cargos disponibles
  useEffect(() => {
    if (!token) return;
    const listarCargos = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_CARGOS, {
          headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al listar cargos");
        const data = await res.json();
        setCargos(data);
      } catch {
        Swal.fire("Error", "No se pudieron cargar los cargos", "error");
      }
    };
    listarCargos();
  }, [token]);

  // 🧠 Cargar usuario del token y autocompletar cargo
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
        timerProgressBar: true,
      });
      navigate("/login");
      return;
    }
    setUsuario(u);
    setFormData((prev) => ({
      ...prev,
      cargo: u.cargo || "", // Autoasigna el cargo del usuario
    }));
  }, []);

  // 🔎 Filtrar cargos por empresa del usuario
  const cargosFiltrados = usuario
    ? cargos.filter((c) => c.idEmpresa === usuario.id_empresa)
    : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    setTimeout(() => {
      navigate("/nav/LectorUserRepo");
    }, 1500);
  };

  // 🧾 Enviar reporte
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) return showToast("error", "Usuario no autenticado");

    if (!token) return showToast("error", "No hay token en localStorage");

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, String(value).trim());
      });

      if (imagen) data.append("imagen", imagen);
      if (archivos) data.append("archivos", archivos);

      data.append("id_usuario", usuario.id.toString());
      data.append("nombre_usuario", usuario.nombre);
      data.append("id_empresa", usuario.id_empresa.toString());

      const res = await fetch(`${apiBase}/crearReporte`, {
        method: "POST",
        headers: {'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const result = await res.json();
        return showToast("error", result.error || "Error al enviar reporte");
      }

      showToast("success", "Reporte creado correctamente");
      navigate("/nav/crearReportes");
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showToast("error", "Ocurrió un error al enviar el reporte");
    }
  };

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
      <div className="absolute inset-0 backdrop-blur-sm">
         {/* 🔙 BOTÓN VOLVER */}
        <button
          type="button"
          onClick={() => navigate(-1)} // ← Vuelve a la página anterior
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-blue-600"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaHardHat className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Crear Reporte SST</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 🔽 Select de cargos filtrados */}
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Seleccione su cargo</option>
            {cargosFiltrados.map((c) => (
              <option key={c.idCargo} value={c.cargo}>
                {c.cargo}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="lugar"
            placeholder="Lugar"
            value={formData.lugar}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />

          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="border p-3 rounded-xl col-span-2 focus:ring-2 focus:ring-yellow-500"
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
          className="border p-3 rounded-xl w-full mt-4 focus:ring-2 focus:ring-yellow-500"
          rows={4}
        />

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700">Archivos:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => setArchivos(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-400 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <FaPaperPlane /> Enviar Reporte
        </button>
      </form>
    </div>
  );
};

export default CrearListReporte;
