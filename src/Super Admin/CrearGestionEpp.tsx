import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import {FaHardHat, FaPaperPlane } from "react-icons/fa";

interface Empresa { idEmpresa: number; nombre: string; }
interface Cargo { idCargo: number; cargo: string; }
interface Area { idArea: number; nombre: string; }
interface Producto { idProducto: number; nombre: string; }
interface ProductoSeleccionado { idProducto: number; cantidad: number; }

const CrearGestionEppSA: React.FC = () => {
  const navigate = useNavigate();
  const usuario: UsuarioToken | null = getUsuarioFromToken();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    cedula: "",
    importancia: "Media",
    estado: "Activo",
    idCargo: "",
    idArea: "",
    idEmpresa: "",
  });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar datos de backend
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [empRes, cargoRes, areaRes, prodRes] = await Promise.all([
          fetch(import.meta.env.VITE_API_LISTAREMPRESAS, { headers: { 'ngrok-skip-browser-warning': 'true', Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_CARGOS, { headers: { 'ngrok-skip-browser-warning': 'true', Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_LISTARAREAS, { headers: { 'ngrok-skip-browser-warning': 'true', Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_PRODUCTOS, { headers: { 'ngrok-skip-browser-warning': 'true', Authorization: `Bearer ${token}` } }),
        ]);

        const empData = await empRes.json();
        const cargoData = await cargoRes.json();
        const areaData = await areaRes.json();
        const prodData = await prodRes.json();

        setEmpresas(empData?.datos ?? []);
        setCargos(cargoData ?? []);
        setAreas(areaData ?? []);
        setProductos(prodData ?? []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };

    fetchData();
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

      // 🔹 Tomar id_empresa del token si no se selecciona
      const empresaId = formData.idEmpresa ? Number(formData.idEmpresa) : usuario.id_empresa;

      const body: any = {
        cedula: formData.cedula,
        id_cargo: Number(formData.idCargo),
        importancia: formData.importancia,
        estado: formData.estado.toLowerCase() === "activo" ? "activo" : "inactivo",
        cantidad: productosSeleccionados.reduce((acc, p) => acc + p.cantidad, 0),
        productos: productosSeleccionados.map(p => p.idProducto),
        id_usuario: usuario.id,
        id_empresa: empresaId,
        id_area: formData.idArea ? Number(formData.idArea) : null,
      };

      const res = await fetch(import.meta.env.VITE_API_CREARGESTION, {
        method: "POST",
        headers: {
          'ngrok-skip-browser-warning': 'true',
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al crear gestión");

      Swal.fire("Éxito", "Gestión creada correctamente", "success");
      navigate("/gestionEpp");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <form onSubmit={handleSubmit} className="bg-white/95 p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-blue-600 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <FaHardHat className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Crear Gestión EPP</h2>
        </div>

        {/* Empresa */}
        <select
          name="idEmpresa"
          value={formData.idEmpresa}
          onChange={handleChange}
          className="border p-3 rounded-xl w-full"
        >
          <option value="">-- Selecciona una empresa (opcional) --</option>
          {empresas.map(emp => (
            <option key={emp.idEmpresa} value={emp.idEmpresa}>{emp.nombre}</option>
          ))}
        </select>

        {/* Cédula */}
        <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Cédula" className="border p-3 rounded-xl w-full" required />

        {/* Cargo */}
        <select name="idCargo" value={formData.idCargo} onChange={handleChange} className="border p-3 rounded-xl w-full" required>
          <option value="">-- Selecciona un cargo --</option>
          {cargos.map(c => <option key={c.idCargo} value={c.idCargo}>{c.cargo}</option>)}
        </select>

        {/* Área */}
        <select name="idArea" value={formData.idArea} onChange={handleChange} className="border p-3 rounded-xl w-full">
          <option value="">-- Selecciona un área (opcional) --</option>
          {areas.map(a => <option key={a.idArea} value={a.idArea}>{a.nombre}</option>)}
        </select>

        {/* Importancia */}
        <select name="importancia" value={formData.importancia} onChange={handleChange} className="border p-3 rounded-xl w-full">
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        {/* Estado */}
        <select name="estado" value={formData.estado} onChange={handleChange} className="border p-3 rounded-xl w-full">
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        {/* Productos */}
        <div className="mb-4">
          <label className="font-semibold">Productos disponibles:</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {productos.map(p => (
              <button key={p.idProducto} type="button" onClick={() => handleAgregarProducto(p.idProducto)} className="bg-blue-200 hover:bg-blue-400 border border-blue-600 rounded p-2">
                {p.nombre}
              </button>
            ))}
          </div>
        </div>

        {productosSeleccionados.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold">Productos seleccionados:</h3>
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

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center items-center gap-2" disabled={loading}>
          <FaPaperPlane /> {loading ? "Guardando..." : "Guardar Gestión"}
        </button>
      </form>
    </div>
  );
};

export default CrearGestionEppSA;
