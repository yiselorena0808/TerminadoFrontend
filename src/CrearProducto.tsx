import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  id_cargo: number;
  estado: string;
}

const Productos: React.FC = () => {
  const token = localStorage.getItem("token");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    id_cargo: 0,
    estado: "activo",
  });
  const [editando, setEditando] = useState<Producto | null>(null);

  const fetchProductos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const crearProducto = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_CREARPRODUCTO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!res.ok) throw new Error("Error creando producto");

      setNuevoProducto({ nombre: "", descripcion: "", id_cargo: 0, estado: "activo" });
      fetchProductos();
      Swal.fire("Éxito", "Producto creado correctamente", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarProducto = async (id: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_ELIMINARPRODUCTO}${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error eliminando producto");

      setProductos((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const actualizarProducto = async () => {
    if (!editando) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_ACTUALIZARPRODUCTO}${editando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editando),
        }
      );

      if (!res.ok) throw new Error("Error actualizando producto");

      setEditando(null);
      fetchProductos();
      Swal.fire("Éxito", "Producto actualizado", "success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📦 Gestión de Productos</h2>

      {/* Crear */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="ID Cargo"
          value={nuevoProducto.id_cargo}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, id_cargo: Number(e.target.value) })
          }
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={crearProducto}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Crear
        </button>
      </div>

      {/* Listar */}
      <ul className="space-y-3">
        {productos.map((producto) => (
          <li
            key={producto.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            {editando?.id === producto.id ? (
              <>
                <input
                  type="text"
                  value={editando.nombre}
                  onChange={(e) =>
                    setEditando({ ...editando, nombre: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-1/3"
                />
                <input
                  type="text"
                  value={editando.descripcion}
                  onChange={(e) =>
                    setEditando({ ...editando, descripcion: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-1/3"
                />
              </>
            ) : (
              <span>
                <strong>{producto.nombre}</strong> - {producto.descripcion}{" "}
                (Cargo ID: {producto.id_cargo})
              </span>
            )}

            <div className="flex gap-2">
              {editando?.id === producto.id ? (
                <button
                  onClick={actualizarProducto}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              ) : (
                <button
                  onClick={() => setEditando(producto)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
              )}
              <button
                onClick={() => eliminarProducto(producto.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
