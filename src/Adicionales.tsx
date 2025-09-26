import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Cargo {
  id_cargo: number;
  cargo: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  id_cargo: number;
  estado: string;
}

const CargoProducto: React.FC = () => {
  const token = localStorage.getItem("token");

  // Estado general
  const [tab, setTab] = useState<"cargos" | "productos">("cargos");

  // CARGOS
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [cargoNuevo, setCargoNuevo] = useState("");
  const [cargoEditar, setCargoEditar] = useState<Cargo | null>(null);
  const [modalCargo, setModalCargo] = useState(false);

  // PRODUCTOS
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoNuevo, setProductoNuevo] = useState({ nombre: "", descripcion: "", id_cargo: 0, estado: "activo" });
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [modalProducto, setModalProducto] = useState(false);

  const showToast = (icon: "success" | "error", title: string) => {
    Swal.fire({ toast: true, position: "top-end", icon, title, showConfirmButton: false, timer: 2500 });
  };

  // ==================== CARGOS ====================
  const listarCargos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_CARGOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCargos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const crearCargo = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_CREARCARGO, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cargo: cargoNuevo }),
      });
      if (!res.ok) throw new Error("Error creando cargo");
      await listarCargos();
      setCargoNuevo("");
      setModalCargo(false);
      showToast("success", "Cargo creado");
    } catch (err) {
      console.error(err);
      showToast("error", "Error creando cargo");
    }
  };

  const actualizarCargo = async () => {
    if (!cargoEditar) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARCARGO}${cargoEditar.id_cargo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cargo: cargoEditar.cargo }),
      });
      if (!res.ok) throw new Error("Error actualizando cargo");
      await listarCargos();
      setModalCargo(false);
      showToast("success", "Cargo actualizado");
    } catch (err) {
      console.error(err);
      showToast("error", "Error actualizando cargo");
    }
  };

  const eliminarCargo = async (id: number) => {
    const confirm = await Swal.fire({ title: "¿Eliminar cargo?", showCancelButton: true, confirmButtonText: "Sí" });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ELIMINARCARGO}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando cargo");
      await listarCargos();
      showToast("success", "Cargo eliminado");
    } catch (err) {
      console.error(err);
      showToast("error", "Error eliminando cargo");
    }
  };

  // ==================== PRODUCTOS ====================
  const listarProductos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const crearProducto = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_CREARPRODUCTO, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(productoNuevo),
      });
      if (!res.ok) throw new Error("Error creando producto");
      await listarProductos();
      setProductoNuevo({ nombre: "", descripcion: "", id_cargo: 0, estado: "activo" });
      setModalProducto(false);
      showToast("success", "Producto creado");
    } catch (err) {
      console.error(err);
      showToast("error", "Error creando producto");
    }
  };

  const actualizarProducto = async () => {
    if (!productoEditar) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARPRODUCTO}${productoEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(productoEditar),
      });
      if (!res.ok) throw new Error("Error actualizando producto");
      await listarProductos();
      setModalProducto(false);
      showToast("success", "Producto actualizado");
    } catch (err) {
      console.error(err);
      showToast("error", "Error actualizando producto");
    }
  };

  const eliminarProducto = async (id: number) => {
    const confirm = await Swal.fire({ title: "¿Eliminar producto?", showCancelButton: true, confirmButtonText: "Sí" });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ELIMINARPRODUCTO}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando producto");
      await listarProductos();
      showToast("success", "Producto eliminado");
    } catch (err) {
      console.error(err);
      showToast("error", "Error eliminando producto");
    }
  };

  // ==================== useEffect ====================
  useEffect(() => {
    listarCargos();
    listarProductos();
  }, []);

  // ==================== UI ====================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Gestión de Cargos y Productos</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab("cargos")}
          className={`px-6 py-2 rounded ${tab === "cargos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Cargos
        </button>
        <button
          onClick={() => setTab("productos")}
          className={`px-6 py-2 rounded ${tab === "productos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Productos
        </button>
      </div>

      {/* CARGOS */}
      {tab === "cargos" && (
        <div>
          <button onClick={() => { setCargoEditar(null); setModalCargo(true); }} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            + Crear Cargo
          </button>
          <ul className="space-y-2">
            {cargos.map((c) => (
              <li key={c.id_cargo} className="flex justify-between bg-gray-100 p-3 rounded">
                {c.cargo}
                <div className="flex gap-2">
                  <button onClick={() => { setCargoEditar(c); setModalCargo(true); }} className="bg-yellow-400 px-3 py-1 rounded text-white">Editar</button>
                  <button onClick={() => eliminarCargo(c.id_cargo)} className="bg-red-500 px-3 py-1 rounded text-white">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PRODUCTOS */}
      {tab === "productos" && (
        <div>
          <button onClick={() => { setProductoEditar(null); setModalProducto(true); }} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            + Crear Producto
          </button>
          <ul className="space-y-2">
            {productos.map((p) => (
              <li key={p.id} className="flex justify-between bg-gray-100 p-3 rounded">
                <div>
                  <strong>{p.nombre}</strong> - {p.descripcion} ({p.estado})
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setProductoEditar(p); setModalProducto(true); }} className="bg-yellow-400 px-3 py-1 rounded text-white">Editar</button>
                  <button onClick={() => eliminarProducto(p.id)} className="bg-red-500 px-3 py-1 rounded text-white">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal Cargo */}
      {modalCargo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">{cargoEditar ? "Editar Cargo" : "Crear Cargo"}</h2>
            <input
              type="text"
              className="border rounded w-full p-2 mb-4"
              value={cargoEditar ? cargoEditar.cargo : cargoNuevo}
              onChange={(e) =>
                cargoEditar ? setCargoEditar({ ...cargoEditar, cargo: e.target.value }) : setCargoNuevo(e.target.value)
              }
              placeholder="Nombre del cargo"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalCargo(false)} className="bg-gray-400 px-4 py-2 rounded text-white">Cancelar</button>
              <button onClick={cargoEditar ? actualizarCargo : crearCargo} className="bg-green-500 px-4 py-2 rounded text-white">
                {cargoEditar ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Producto */}
      {modalProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">{productoEditar ? "Editar Producto" : "Crear Producto"}</h2>
            <input
              type="text"
              className="border rounded w-full p-2 mb-2"
              value={productoEditar ? productoEditar.nombre : productoNuevo.nombre}
              onChange={(e) =>
                productoEditar
                  ? setProductoEditar({ ...productoEditar, nombre: e.target.value })
                  : setProductoNuevo({ ...productoNuevo, nombre: e.target.value })
              }
              placeholder="Nombre del producto"
            />
            <textarea
              className="border rounded w-full p-2 mb-2"
              value={productoEditar ? productoEditar.descripcion : productoNuevo.descripcion}
              onChange={(e) =>
                productoEditar
                  ? setProductoEditar({ ...productoEditar, descripcion: e.target.value })
                  : setProductoNuevo({ ...productoNuevo, descripcion: e.target.value })
              }
              placeholder="Descripción"
            />
            <select
              className="border rounded w-full p-2 mb-2"
              value={productoEditar ? productoEditar.id_cargo : productoNuevo.id_cargo}
              onChange={(e) =>
                productoEditar
                  ? setProductoEditar({ ...productoEditar, id_cargo: Number(e.target.value) })
                  : setProductoNuevo({ ...productoNuevo, id_cargo: Number(e.target.value) })
              }
            >
              <option value={0}>-- Seleccionar Cargo --</option>
              {cargos.map((c) => (
                <option key={c.id_cargo} value={c.id_cargo}>{c.cargo}</option>
              ))}
            </select>
            <select
              className="border rounded w-full p-2 mb-4"
              value={productoEditar ? productoEditar.estado : productoNuevo.estado}
              onChange={(e) =>
                productoEditar
                  ? setProductoEditar({ ...productoEditar, estado: e.target.value })
                  : setProductoNuevo({ ...productoNuevo, estado: e.target.value })
              }
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalProducto(false)} className="bg-gray-400 px-4 py-2 rounded text-white">Cancelar</button>
              <button onClick={productoEditar ? actualizarProducto : crearProducto} className="bg-green-500 px-4 py-2 rounded text-white">
                {productoEditar ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoProducto;
