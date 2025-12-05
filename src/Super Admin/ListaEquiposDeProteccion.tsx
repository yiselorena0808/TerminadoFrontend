import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaHardHat, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ListaProductos: React.FC = () => {
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
      const res = await fetch(import.meta.env.VITE_API_TODOSLOSEQUIPOS, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      if (!res.ok) throw new Error("Error al listar productos");
      const data = await res.json();
      
      // Ajustar para la estructura de respuesta con "datos"
      if (data.datos && Array.isArray(data.datos)) {
        setProductos(
          data.datos.map((p: any) => ({
            idProducto: p.idProducto,
            nombre: p.nombre,
            descripcion: p.descripcion,
            estado: p.estado,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
          }))
        );
      } else {
        throw new Error("Estructura de datos inesperada");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los equipos de protección", "error");
    }
  };

  // Crear producto
  const crearProducto = async () => {
    if (!nuevo.nombre.trim()) {
      return Swal.fire("Error", "El nombre del equipo es obligatorio", "warning");
    }

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

      if (!res.ok) throw new Error("Error al crear equipo");
      
      setNuevo({ nombre: "", descripcion: "", estado: true });
      listarProductos();
      Swal.fire("Éxito", "Equipo de protección creado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el equipo de protección", "error");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (idProducto: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar equipo de protección?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
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
      if (!res.ok) throw new Error("Error al eliminar equipo");
      listarProductos();
      Swal.fire("Eliminado", "Equipo eliminado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el equipo", "error");
    }
  };

  // Editar producto
  const editarProducto = async (producto: Producto) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Equipo de Protección",
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre del equipo" value="${producto.nombre}">
        <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción" style="height: 100px; resize: vertical;">${producto.descripcion}</textarea>
        <select id="swal-estado" class="swal2-select">
          <option value="true" ${producto.estado ? "selected" : ""}>Activo</option>
          <option value="false" ${!producto.estado ? "selected" : ""}>Inactivo</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const nombre = (document.getElementById("swal-nombre") as HTMLInputElement)?.value;
        const descripcion = (document.getElementById("swal-descripcion") as HTMLTextAreaElement)?.value;
        const estado = (document.getElementById("swal-estado") as HTMLSelectElement)?.value === "true";

        if (!nombre?.trim()) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return false;
        }

        return {
          nombre: nombre.trim(),
          descripcion: descripcion?.trim() || "",
          estado: estado
        };
      },
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
        if (!res.ok) throw new Error("Error al actualizar equipo");
        listarProductos();
        Swal.fire("Actualizado", "Equipo modificado correctamente", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo actualizar el equipo", "error");
      }
    }
  };

  useEffect(() => {
    listarProductos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold  text-blue-700 mb-6 flex items-center gap-2">
        <FaHardHat className="text-blue-700" /> 
        Gestión de Equipos de Protección Personal
      </h1>

      {/* Formulario para crear equipo */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Crear Nuevo Equipo de Protección</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              placeholder="Ej: Casco de seguridad, Guantes anti-corte..."
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={String(nuevo.estado)}
              onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value === "true" })}
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            placeholder="Descripción detallada del equipo y su uso..."
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700 resize-vertical"
          />
        </div>
        <button 
          onClick={crearProducto}
          disabled={!nuevo.nombre.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaPlus /> Crear Equipo
        </button>
      </div>

      {/* Listado de equipos */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Equipos de Protección Registrados
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {productos.length} equipo(s)
          </span>
        </div>

        {productos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((producto) => (
              <div 
                key={producto.idProducto} 
                className="border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FaHardHat className="text-blue-600" />
                    {producto.nombre}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    producto.estado 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {producto.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {producto.descripcion || "Sin descripción"}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {producto.createdAt && (
                      <div>
                        Creado: {new Date(producto.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      name="Editar"
                      onClick={() => editarProducto(producto)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl transition-colors"
                      title="Editar equipo"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      name="Eliminar"
                      onClick={() => eliminarProducto(producto.idProducto)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-colors"
                      title="Eliminar equipo"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaHardHat className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No hay equipos de protección registrados
            </h3>
            <p className="text-gray-500">
              Comienza creando el primer equipo usando el formulario superior
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaProductos;