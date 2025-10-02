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

const ProductosPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [nuevo, setNuevo] = useState<Producto>({
    id: 0, nombre: "", descripcion: "", id_cargo: 0, estado: "activo"
  });

  const listarProductos = async () => {
    const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProductos(await res.json());
  };

  const listarCargos = async () => {
    const res = await fetch(import.meta.env.VITE_API_CARGOS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCargos(await res.json());
  };

  const crearProducto = async () => {
    await fetch(import.meta.env.VITE_API_CREARPRODUCTO, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(nuevo),
    });
    setNuevo({ id: 0, nombre: "", descripcion: "", id_cargo: 0, estado: "activo" });
    listarProductos();
    Swal.fire("Éxito", "Producto creado", "success");
  };

  const eliminarProducto = async (id: number) => {
    const confirm = await Swal.fire({ title: "¿Eliminar producto?", showCancelButton: true });
    if (!confirm.isConfirmed) return;
    await fetch(`${import.meta.env.VITE_API_ELIMINARPRODUCTO}${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    listarProductos();
    Swal.fire("Eliminado", "Producto eliminado", "success");
  };

  const editarProducto = async (producto: Producto) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Producto",
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
        <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion}</textarea>
        <select id="swal-estado" class="swal2-select">
          <option value="activo" ${producto.estado === "activo" ? "selected" : ""}>Activo</option>
          <option value="inactivo" ${producto.estado === "inactivo" ? "selected" : ""}>Inactivo</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          nombre: (document.getElementById("swal-nombre") as HTMLInputElement).value,
          descripcion: (document.getElementById("swal-descripcion") as HTMLTextAreaElement).value,
          estado: (document.getElementById("swal-estado") as HTMLSelectElement).value,
        };
      },
    });

    if (formValues) {
      await fetch(`${import.meta.env.VITE_API_ACTUALIZARPRODUCTO}${producto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...producto, ...formValues }),
      });
      listarProductos();
      Swal.fire("Actualizado", "Producto modificado correctamente", "success");
    }
  };

  useEffect(() => {
    listarProductos();
    listarCargos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Gestión de Productos</h1>

      {/* Crear Producto */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>
        <input 
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <select
          value={nuevo.id_cargo}
          onChange={(e) => setNuevo({ ...nuevo, id_cargo: Number(e.target.value) })}
          className="border p-2 rounded w-full mb-2"
        >
          <option value={0}>-- Seleccionar Cargo --</option>
          {cargos.map((c) => <option key={c.id_cargo} value={c.id_cargo}>{c.cargo}</option>)}
        </select>
        <select
          value={nuevo.estado}
          onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button onClick={crearProducto} className="bg-green-600 text-white px-4 py-2 rounded">Crear</button>
      </div>

      {/* Listado de productos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div key={p.id} className="bg-white shadow-lg rounded p-4">
            <h3 className="font-bold text-lg">{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p className="text-sm text-gray-600">Estado: {p.estado}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => editarProducto(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
              <button onClick={() => eliminarProducto(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPage;
