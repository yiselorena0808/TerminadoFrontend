import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";
import { FaHardHat, FaPaperPlane } from "react-icons/fa";

interface Cargo { idCargo: number; cargo: string; }
interface Area { idArea: number; nombre: string; }
interface Producto { idProducto: number; nombre: string; }
interface ProductoSeleccionado { idProducto: number; cantidad: number; }

const CrearGestionEpp: React.FC = () => {
  const navigate = useNavigate();
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const [formData, setFormData] = useState({
    cedula: "",
    importancia: "Media",
    estado: "Activo",
    idCargo: "",
    idArea: "",
  });

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Cargar cargos
  useEffect(() => {
    if (!token) return;
    const listarCargos = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_CARGOS, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Error al listar cargos");
        const data = await res.json();
        setCargos(data);
      } catch { Swal.fire("Error", "No se pudieron cargar los cargos", "error"); }
    };
    listarCargos();
  }, [token]);

  // ✅ Cargar áreas (opcional)
  useEffect(() => {
    if (!token) return;
    const listarAreas = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_LISTARAREAS, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Error al listar áreas");
        const data = await res.json();
        setAreas(data);
      } catch { Swal.fire("Error", "No se pudieron cargar las áreas", "error"); }
    };
    listarAreas();
  }, [token]);

  // ✅ Cargar productos
  useEffect(() => {
    if (!token) return;
    const listarProductos = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Error al listar productos");
        const data = await res.json();
        setProductos(data);
      } catch { Swal.fire("Error", "No se pudieron cargar los productos", "error"); }
    };
    listarProductos();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgregarProducto = (idProducto: number) => {
    if (!productosSeleccionados.find(p => p.idProducto === idProducto))
      setProductosSeleccionados(prev => [...prev, { idProducto, cantidad: 1 }]);
  };

  const handleCantidadChange = (idProducto: number, cantidad: number) => {
    setProductosSeleccionados(prev => prev.map(p => (p.idProducto === idProducto ? { ...p, cantidad } : p)));
  };

  const handleEliminarProducto = (idProducto: number) => {
    setProductosSeleccionados(prev => prev.filter(p => p.idProducto !== idProducto));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return Swal.fire("Error", "Usuario no autenticado", "error");
    if (!formData.idCargo || productosSeleccionados.length === 0)
      return Swal.fire("Error", "Completa todos los campos obligatorios y selecciona productos", "error");

    try {
      setLoading(true);

      // Construir objeto a enviar
      const body: any = {
        cedula: formData.cedula,
        id_cargo: Number(formData.idCargo),
        importancia: formData.importancia,
        estado: formData.estado.toLowerCase() === "activo" ? "activo" : "inactivo",
        cantidad: productosSeleccionados.reduce((acc, p) => acc + p.cantidad, 0),
        productos: productosSeleccionados.map(p => p.idProducto),
        idUsuario: usuario.id,
      };

      // Solo enviamos id_area si el usuario lo seleccionó
      if (formData.idArea) body.id_area = Number(formData.idArea);

      const res = await fetch(import.meta.env.VITE_API_CREARGESTION, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al crear gestión");

      Swal.fire("Éxito", "Gestión creada correctamente", "success");
      navigate("/listar-gestion-epp");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative"
         style={{ backgroundImage: "url('https://img.freepik.com/fotos-premium/equipos-proteccion-personal-para-la-seguridad-industrial_1033579-251259.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-yellow-900/40 backdrop-blur-sm"></div>
      <form onSubmit={handleSubmit} className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-yellow-500">
        <div className="flex items-center gap-3 mb-6">
          <FaHardHat className="text-yellow-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Crear Gestión EPP</h2>
        </div>

        <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Cédula" required className="border p-3 rounded-xl w-full mb-3" />

        <div className="grid grid-cols-2 gap-4 mb-3">
          <select name="importancia" value={formData.importancia} onChange={handleChange} required className="border p-3 rounded-xl">
            <option value="">-- Importancia --</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <select name="estado" value={formData.estado} onChange={handleChange} required className="border p-3 rounded-xl">
            <option value="">-- Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <select name="idCargo" value={formData.idCargo} onChange={handleChange} required className="border p-3 rounded-xl w-full mb-3">
          <option value="">-- Selecciona un cargo --</option>
          {cargos.map(c => <option key={c.idCargo} value={c.idCargo}>{c.cargo}</option>)}
        </select>

        <select name="idArea" value={formData.idArea} onChange={handleChange} className="border p-3 rounded-xl w-full mb-3">
          <option value="">-- Selecciona un área (opcional) --</option>
          {areas.map(a => <option key={a.idArea} value={a.idArea}>{a.nombre}</option>)}
        </select>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Productos disponibles:</h3>
          <div className="grid grid-cols-2 gap-2">
            {productos.map(p => (
              <button key={p.idProducto} type="button" onClick={() => handleAgregarProducto(p.idProducto)}
                      className="bg-yellow-100 hover:bg-yellow-200 border border-yellow-400 rounded p-2 text-sm">
                {p.nombre}
              </button>
            ))}
          </div>
        </div>

        {productosSeleccionados.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Productos seleccionados:</h3>
            {productosSeleccionados.map(p => {
              const producto = productos.find(prod => prod.idProducto === p.idProducto);
              return (
                <div key={p.idProducto} className="flex items-center gap-3 mb-2 border-b pb-2">
                  <span className="flex-1">{producto?.nombre || "Producto"}</span>
                  <input type="number" min={1} value={p.cantidad} onChange={e => handleCantidadChange(p.idProducto, Number(e.target.value))} className="border rounded p-1 w-20" />
                  <button type="button" onClick={() => handleEliminarProducto(p.idProducto)} className="bg-red-500 text-white px-2 py-1 rounded">X</button>
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg" disabled={loading}>
          <FaPaperPlane /> {loading ? "Guardando..." : "Guardar Gestión"}
        </button>
      </form>
    </div>
  );
};

export default CrearGestionEpp;
