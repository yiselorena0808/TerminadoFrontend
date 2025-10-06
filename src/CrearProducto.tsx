import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Cargo {
  idCargo: number;
  cargo: string;
}

interface Producto {
  id: number; // ✅ Asegúrate de que coincide con el campo que devuelve el backend
  nombre: string;
  descripcion: string;
  idCargo: number;
  estado: boolean;
}

const ProductosPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Producto, "id">>({
    nombre: "",
    descripcion: "",
    idCargo: 0,
    estado: true,
  });

  // 🔹 Listar productos
  const listarProductos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al listar productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  // 🔹 Listar cargos
  const listarCargos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_CARGOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al listar cargos");
      const data = await res.json();
      setCargos(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los cargos", "error");
    }
  };

  // 🔹 Crear producto
  const crearProducto = async () => {
    if (!nuevo.nombre.trim()) {
      Swal.fire("Error", "El nombre del producto es obligatorio", "warning");
      return;
    }

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
          id_cargo: nuevo.idCargo,
          estado: nuevo.estado,
        }),
      });

      if (!res.ok) throw new Error("Error al crear el producto");

      setNuevo({ nombre: "", descripcion: "", idCargo: 0, estado: true });
      listarProductos();
      Swal.fire("Éxito", "Producto creado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el producto", "error");
    }
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id: number) => {
    if (!id) return;

    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ELIMINARPRODUCTO}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo eliminar el producto");

      listarProductos();
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  // 🔹 Editar producto
  const editarProducto = async (producto: Producto) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Producto",
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
        <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion}</textarea>
        <select id="swal-cargo" class="swal2-select mb-2">
          ${cargos
            .map(
              (c) =>
                `<option value="${c.idCargo}" ${
                  c.idCargo === producto.idCargo ? "selected" : ""
                }>${c.cargo}</option>`
            )
            .join("")}
        </select>
        <select id="swal-estado" class="swal2-select">
          <option value="true" ${producto.estado ? "selected" : ""}>Activo</option>
          <option value="false" ${!producto.estado ? "selected" : ""}>Inactivo</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      preConfirm: () => {
        return {
          nombre: (document.getElementById("swal-nombre") as HTMLInputElement).value,
          descripcion: (document.getElementById("swal-descripcion") as HTMLTextAreaElement).value,
          idCargo: Number((document.getElementById("swal-cargo") as HTMLSelectElement).value),
          estado: (document.getElementById("swal-estado") as HTMLSelectElement).value === "true",
        };
      },
    });

    if (formValues) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARPRODUCTO}${producto.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...producto, ...formValues }),
        });

        if (!res.ok) throw new Error("Error al actualizar el producto");

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
          value={String(nuevo.idCargo || 0)}
          onChange={(e) => setNuevo({ ...nuevo, idCargo: Number(e.target.value) })}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="0">-- Seleccionar Cargo --</option>
          {cargos.map((c) => (
            <option key={`cargo-${c.idCargo}`} value={String(c.idCargo)}>
              {c.cargo}
            </option>
          ))}
        </select>
        <select
          value={String(nuevo.estado)}
          onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value === "true" })}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <button
          onClick={crearProducto}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear
        </button>
      </div>

      {/* Listado de productos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div key={p.id} className="bg-white shadow-lg rounded p-4">
            <h3 className="font-bold text-lg">{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p className="text-sm text-gray-600">Estado: {p.estado ? "Activo" : "Inactivo"}</p>
            <p className="text-sm text-gray-600">
              Cargo: {cargos.find((c) => c.idCargo === p.idCargo)?.cargo || "N/A"}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => editarProducto(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPage;
