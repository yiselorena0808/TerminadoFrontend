import React, { useEffect, useState } from "react";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

const CrearGestionEpp: React.FC = () => {
  const apiCargos = import.meta.env.VITE_API_CARGOS;
  const apiProductosCargo = import.meta.env.VITE_API_PRODUCTOS1; // ejemplo: http://localhost:3333/productos/cargo/
  const apiCrearGestionEpp = import.meta.env.VITE_API_CREARGESTION;

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [cargos, setCargos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    cedula: "",
    id_cargo: "",        // number
    nombre_cargo: "",    // string para filtrar productos
    id_producto: "",
    importancia: "",
    estado: "activo",
    fecha_creacion: new Date().toISOString().slice(0, 10),
    id_usuario: "",
    nombre: "",
    apellido: "",
    id_empresa: "",
  });

  // Cargar usuario desde token
  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      setUsuario(u);
      setFormData((prev) => ({
        ...prev,
        id_usuario: u.id ?? "",
        nombre: u.nombre ?? "",
        apellido: u.apellido ?? "",
        id_empresa: u.id_empresa ?? "",
      }));
    }
  }, []);

  // Cargar cargos
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const res = await fetch(apiCargos, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al cargar cargos");
        const data = await res.json();
        setCargos(Array.isArray(data) ? data : data.cargos ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCargos();
  }, []);

  // Cargar productos según nombre del cargo seleccionado
  useEffect(() => {
    const fetchProductos = async () => {
      if (!formData.nombre_cargo) return;
      try {
        const cargoEncoded = encodeURIComponent(formData.nombre_cargo);
        const res = await fetch(`${apiProductosCargo}${cargoEncoded}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : data.productos ?? []);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };
    fetchProductos();
  }, [formData.nombre_cargo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCargoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selected = cargos.find((c) => c.idCargo === selectedId);
    setFormData((prev) => ({
      ...prev,
      id_cargo: selectedId,
      nombre_cargo: selected?.cargo ?? "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiCrearGestionEpp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al crear gestión");
      const data = await res.json();
      alert("Gestión creada con éxito");
      console.log("Nueva gestión:", data);
    } catch (err) {
      console.error(err);
      alert("Error al crear gestión");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Crear Gestión EPP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Datos del token solo lectura */}
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={usuario?.nombre ?? ""}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido</label>
          <input
            type="text"
            value={usuario?.apellido ?? ""}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Empresa</label>
          <input
            type="text"
            value={usuario?.id_empresa ?? ""}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        {/* Campos del formulario */}
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

        <div>
          <label className="block text-sm font-medium">Cargo</label>
          <select
            name="id_cargo"
            value={formData.id_cargo}
            onChange={handleCargoChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Selecciona un cargo --</option>
            {cargos.map((cargo) => (
              <option key={cargo.idCargo} value={cargo.idCargo}>
                {cargo.cargo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Producto</label>
          <select
            name="id_producto"
            value={formData.id_producto}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Selecciona un producto --</option>
            {productos.map((prod) => (
              <option key={prod.idProducto} value={prod.idProducto}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>

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
