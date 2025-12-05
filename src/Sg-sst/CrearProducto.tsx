import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaPlus, FaBox } from "react-icons/fa";
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
  const [busqueda, setBusqueda] = useState("");

  const listarProductos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_PRODUCTOS, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      if (!res.ok) throw new Error("Error al listar productos");
      const data = await res.json();
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

  const crearProducto = async () => {
    if (!nuevo.nombre.trim()) return Swal.fire("Error", "Nombre obligatorio", "warning");

    try {
      const res = await fetch(import.meta.env.VITE_API_CREARPRODUCTO, {
        method: "POST",
        headers: {
          'ngrok-skip-browser-warning': 'true',
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
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      listarProductos();
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

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
            'ngrok-skip-browser-warning': 'true',
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

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* CONTADOR */}
      <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
        <p className="text-blue-800 font-semibold">
          Total: <span className="text-blue-600">{productosFiltrados.length}</span> equipos
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar equipo..."
              className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
        </div>
      </div>

      {/* CREAR PRODUCTO */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Equipo de Protección</h2>
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
          />
          <textarea
            placeholder="Descripción"
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
            rows={3}
          />
          <select
            value={String(nuevo.estado)}
            onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value === "true" })}
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
          <button 
            onClick={crearProducto}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
          >
            <FaPlus /> Crear Equipo
          </button>
        </div>
      </div>

      {/* LISTA DE PRODUCTOS */}
      {productosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
          <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {productos.length === 0 ? "No hay equipos registrados" : "No se encontraron equipos"}
          </h3>
          <p className="text-gray-500">
            {productos.length === 0 
              ? "Crea el primer equipo usando el formulario superior" 
              : "Intenta con otros términos de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((p) => (
            <div
              key={p.idProducto}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                      <FaBox className="text-blue-500" /> {p.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {p.estado ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      name="editar"
                      onClick={() => editarProducto(p)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-2 rounded-xl transition-all duration-300 shadow-lg"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      name="eliminar"
                      onClick={() => eliminarProducto(p.idProducto)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-xl transition-all duration-300 shadow-lg"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {p.descripcion || "Sin descripción"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosPage;