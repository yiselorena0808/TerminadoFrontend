import React, { useEffect, useState } from "react";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

interface Cargo {
  id_cargo: number;
  cargo: string;
}

interface Producto {
  id_producto: number;
  nombre: string;
}

const CrearGestionEpp: React.FC = () => {
  const apiCargos = import.meta.env.VITE_API_CARGOS; // /cargos/listar
  const apiProductosPorCargo = import.meta.env.VITE_API_PRODUCTOS_POR_CARGO; // /productos/cargo/
  const apiCrearGestionEpp = import.meta.env.VITE_API_CREARGESTION;

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string>("");

  const [loadingCargos, setLoadingCargos] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [formData, setFormData] = useState({
    cedula: "",
    cargo: "", // string en el modelo
    productos: [] as string[], // IDs de productos
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

  // Cargar usuario
  useEffect(() => {
    if (!token) return setError("No hay token disponible. Por favor inicia sesión.");
    const u = getUsuarioFromToken();
    if (!u) return setError("Token inválido. Por favor inicia sesión de nuevo.");
    setUsuario(u);
    setFormData((prev) => ({
      ...prev,
      id_usuario: u.id ?? "",
      nombre: u.nombre ?? "",
      apellido: u.apellido ?? "",
      id_empresa: u.id_empresa ?? "",
    }));
  }, [token]);

  // Cargar cargos
  useEffect(() => {
    if (!token) return;
    setLoadingCargos(true);
    const fetchCargos = async () => {
      try {
        const res = await fetch(apiCargos, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`Error al cargar cargos: ${res.status}`);
        const data = await res.json();
        const cargosArray: Cargo[] = Array.isArray(data) ? data : data.cargos ?? [];
        setCargos(cargosArray.filter(c => c?.id_cargo && c.cargo));
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingCargos(false);
      }
    };
    fetchCargos();
  }, [token]);

  // Cargar productos según cargo seleccionado
  useEffect(() => {
    if (!token || !formData.cargo) return;
    setLoadingProductos(true);
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${apiProductosPorCargo}${formData.cargo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error al cargar productos: ${res.status}`);
        const data = await res.json();
        const productosArray: Producto[] = Array.isArray(data) ? data : data.productos ?? [];
        setProductos(productosArray.filter(p => p?.id_producto && p.nombre));
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, [token, formData.cargo]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCargoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      cargo: e.target.value,
      productos: [], // reset productos al cambiar cargo
    }));
  };

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    setFormData(prev => ({ ...prev, productos: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("No hay token. Por favor inicia sesión.");

    try {
      const res = await fetch(apiCrearGestionEpp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Error al crear gestión: ${res.status}`);
      const data = await res.json();
      alert("Gestión creada con éxito ✅");
      console.log("Nueva gestión:", data);
      setFormData(prev => ({
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
      console.error(err);
      alert(err.message);
    }
  };

  if (error) {
    return <div className="max-w-2xl mx-auto p-6 text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Crear Gestión EPP</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre, Apellido y Empresa */}
        {["nombre", "apellido", "id_empresa"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium">
              {field === "id_empresa" ? "Empresa" : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              value={usuario?.[field as keyof UsuarioToken] ?? ""}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
        ))}

        {/* Cédula */}
        <div>
          <label className="block text-sm font-medium">Cédula</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium">Cargo</label>
          {loadingCargos ? (
            <div className="text-gray-500">Cargando cargos...</div>
          ) : (
            <select
              name="cargo"
              value={formData.cargo}
              onChange={handleCargoChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">-- Selecciona un cargo --</option>
              {cargos.map(cargo => (
                <option key={cargo.id_cargo} value={cargo.cargo}>
                  {cargo.cargo}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Productos */}
        <div>
          <label className="block text-sm font-medium">Productos</label>
          {loadingProductos ? (
            <div className="text-gray-500">Cargando productos...</div>
          ) : (
            <select
              multiple
              name="productos"
              value={formData.productos}
              onChange={handleProductoChange}
              className="w-full border rounded p-2"
              required
              disabled={!formData.cargo || productos.length === 0}
            >
              {productos.map(p => (
                <option key={p.id_producto} value={p.id_producto.toString()}>
                  {p.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium">Cantidad</label>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={formData.cantidad}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Importancia */}
        <div>
          <label className="block text-sm font-medium">Importancia</label>
          <select
            name="importancia"
            value={formData.importancia}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Selecciona importancia --</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CrearGestionEpp;
