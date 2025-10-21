import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

const ProductosPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Producto, "idProducto">>({
    nombre: "",
    descripcion: "",
    estado: true,
  });

  // Listar productos
  const listarProductos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al listar productos");
      const data = await res.json();
      // Normalizar para usar idProducto
      setProductos(
        data.map((p: any) => ({
          idProducto: p.idProducto,
          nombre: p.nombre,
          descripcion: p.descripcion,
          estado: p.estado,
        }))
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  // Crear producto
  const crearProducto = async () => {
    if (!nuevo.nombre.trim()) return Swal.fire("Error", "Nombre obligatorio", "warning");

    try {
      const res = await fetch(import.meta.env.VITE_API_CREARPRODUCTO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevo.nombre,
          descripcion: nuevo.descripcion,
          estado: nuevo.estado,
        }),
      });

      if (!res.ok) throw new Error("Error al crear producto");
      setNuevo({ nombre: "", descripcion: "", estado: true });
      listarProductos();
      Swal.fire("Éxito", "Producto creado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el producto", "error");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (idProducto: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ELIMINARPRODUCTO}${idProducto}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      listarProductos();
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  // Editar producto
  const editarProducto = async (producto: Producto) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Producto",
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
        <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion}</textarea>
        <select id="swal-estado" class="swal2-select">
          <option value="true" ${producto.estado ? "selected" : ""}>Activo</option>
          <option value="false" ${!producto.estado ? "selected" : ""}>Inactivo</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      preConfirm: () => ({
        nombre: (document.getElementById("swal-nombre") as HTMLInputElement).value,
        descripcion: (document.getElementById("swal-descripcion") as HTMLTextAreaElement).value,
        estado: (document.getElementById("swal-estado") as HTMLSelectElement).value === "true",
      }),
    });

    if (formValues) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARPRODUCTO}${producto.idProducto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formValues),
        });
        if (!res.ok) throw new Error("Error al actualizar producto");
        listarProductos();
        Swal.fire("Actualizado", "Producto modificado correctamente", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo actualizar el producto", "error");
      }
    }
  };

  useEffect(() => {
    listarProductos();
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
          value={String(nuevo.estado)}
          onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value === "true" })}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <button onClick={crearProducto} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Crear
        </button>
      </div>

      {/* Listado de productos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div key={p.idProducto} className="bg-white shadow-lg rounded p-4">
            <h3 className="font-bold text-lg">{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p className="text-sm text-gray-600">Estado: {p.estado ? "Activo" : "Inactivo"}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => editarProducto(p)}className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl"
              >
              <FaEdit></FaEdit>
              </button>
              <button onClick={() => eliminarProducto(p.idProducto)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
              >
              <FaTrash></FaTrash>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPage;
