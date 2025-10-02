import React, { useEffect, useState } from "react";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";
import Swal from "sweetalert2";
import { FaHardHat, FaPaperPlane } from "react-icons/fa";

interface Cargo {
  id_cargo: number;
  cargo: string;
}

interface Producto {
  id_producto: number;
  nombre: string;
}

const CrearGestionEpp: React.FC = () => {
  const apiCargos = import.meta.env.VITE_API_CARGOS;
  const apiProductosPorCargo = import.meta.env.VITE_API_PRODUCTOS_POR_CARGO;
  const apiCrearGestionEpp = import.meta.env.VITE_API_CREARGESTION;

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string>("");

  const [loadingCargos, setLoadingCargos] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [formData, setFormData] = useState({
    cedula: "",
    cargo: "",
    productos: [] as string[],
    cantidad: 1,
    importancia: "",
    estado: "activo",
    fecha_creacion: new Date().toISOString().slice(0, 10),
    id_usuario: "",
    nombre: "",
    apellido: "",
    id_empresa: "",
  });

  const token = localStorage.getItem("token");

  // cargar usuario
  useEffect(() => {
    if (!token) return setError("No hay token disponible.");
    const u = getUsuarioFromToken();
    if (!u) return setError("Token inválido.");
    setUsuario(u);
    setFormData((prev) => ({
      ...prev,
      id_usuario: u.id ?? "",
      nombre: u.nombre ?? "",
      apellido: u.apellido ?? "",
      id_empresa: u.id_empresa ?? "",
    }));
  }, [token]);

  // cargar cargos
  useEffect(() => {
    if (!token) return;
    setLoadingCargos(true);
    const fetchCargos = async () => {
      try {
        const res = await fetch(apiCargos, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        const cargosArray: Cargo[] = Array.isArray(data) ? data : data.cargos ?? [];
        setCargos(cargosArray.filter(c => c?.id_cargo && c.cargo));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingCargos(false);
      }
    };
    fetchCargos();
  }, [token]);

  // cargar productos según cargo
  useEffect(() => {
    if (!token || !formData.cargo) return;
    setLoadingProductos(true);
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${apiProductosPorCargo}${formData.cargo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const productosArray: Producto[] = Array.isArray(data) ? data : data.productos ?? [];
        setProductos(productosArray.filter(p => p?.id_producto && p.nombre));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, [token, formData.cargo]);

  const showToast = (icon: "success" | "error", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  // handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCargoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, cargo: e.target.value, productos: [] }));
  };

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({ ...prev, productos: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return showToast("error", "No hay token");

    try {
      const res = await fetch(apiCrearGestionEpp, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return showToast("error", data.error || "Error al crear gestión");

      showToast("success", "Gestión de EPP creada ✅");
      setFormData((prev) => ({
        ...prev,
        cedula: "",
        cargo: "",
        productos: [],
        cantidad: 1,
        importancia: "",
        estado: "activo",
      }));
      setProductos([]);
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  if (error) {
    return <div className="text-red-600 font-bold p-6">{error}</div>;
  }

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-yellow-900/40 backdrop-blur-sm"></div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-yellow-500"
      >
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <FaHardHat className="text-yellow-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Crear Gestión EPP</h2>
        </div>

        {/* Usuario info */}
        {usuario && (
          <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm">
            <p><strong>👤 Usuario:</strong> {usuario.nombre} {usuario.apellido}</p>
            <p><strong>Empresa:</strong> {usuario.id_empresa}</p>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="Cédula"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 col-span-2"
          />

          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleCargoChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 col-span-2"
          >
            <option value="">-- Selecciona un cargo --</option>
            {cargos.map((cargo) => (
              <option key={cargo.id_cargo} value={cargo.cargo}>
                {cargo.cargo}
              </option>
            ))}
          </select>

          <select
            multiple
            name="productos"
            value={formData.productos}
            onChange={handleProductoChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 col-span-2"
            required
            disabled={!formData.cargo || productos.length === 0}
          >
            {productos.map((p) => (
              <option key={p.id_producto} value={p.id_producto.toString()}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cantidad"
            min="1"
            value={formData.cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />

          <select
            name="importancia"
            value={formData.importancia}
            onChange={handleChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">-- Importancia --</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 col-span-2"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <FaPaperPlane /> Guardar Gestión
        </button>
      </form>
    </div>
  );
};

export default CrearGestionEpp;
