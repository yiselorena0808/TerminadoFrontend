import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  id_empresa: number;
  id_area: number;
}

const Gestion: React.FC = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [cantidad, setCantidad] = useState("");
  const [importancia, setImportancia] = useState("Media");
  const [estado, setEstado] = useState("Pendiente");
  const [fecha_creacion, setFechaCreacion] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [mensaje, setMensaje] = useState("");

  const apiCrearGestion = import.meta.env.VITE_API_CREARGESTION;
  const crearapi =import.meta.env.VITE_API_CREARGESTION

  // Obtener usuario logueado usando el token
  const fetchUsuario = async () => {
    const token = localStorage.getItem("token"); // Asegúrate de guardar el token al loguear
    if (!token) return;

    try {
      const res = await fetch(import.meta.env.VITE_API_USUARIO_LOGUEADO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsuario(data);
    } catch (err) {
      console.error("Error al obtener usuario:", err);
    }
  };

  // Obtener productos filtrados por cargo del usuario
  const fetchProductos = async (cargo: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_PRODUCTOSCARGO}${cargo}`
      );
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  useEffect(() => {
    if (usuario) {
      fetchProductos(usuario.cargo);
    }
  }, [usuario]);

  const toggleProducto = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) {
      alert("Usuario no cargado");
      return;
    }

    if (seleccionados.length === 0) {
      alert("Seleccione al menos un producto");
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }

    const payload = {
      id_usuario: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cargo: usuario.cargo,
      id_empresa: usuario.id_empresa,
      id_area: usuario.id_area,
      productosIds: seleccionados,
      cantidad: cantidadNum,
      importancia,
      estado,
      fecha_creacion,
    };

    try {
      const res = await fetch(crearapi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      setMensaje(result.mensaje || "Gestión creada correctamente");
      setSeleccionados([]);
      setCantidad("");
      setImportancia("Media");
      setEstado("Pendiente");
      setFechaCreacion(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Error al crear gestión:", err);
      setMensaje("Error al crear la gestión");
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Columna izquierda con imagen */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 hover:bg-white text-gray-700 font-medium shadow-md backdrop-blur-sm transition"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <div className="w-full h-full bg-black/40 flex items-center justify-center text-white text-4xl font-bold text-center p-6">
          Gestión de Entrega de EPP
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-start p-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 relative">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Formulario de Gestión
          </h2>

          {mensaje && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2">
              <p>
                <strong>Usuario:</strong> {usuario.nombre} {usuario.apellido} (
                {usuario.cargo})
              </p>
            </div>

            {/* Productos */}
            <div>
              <p className="font-semibold mb-2">Seleccione Productos:</p>
              {productos.map((p) => (
                <label key={p.id_producto} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(p.id_producto)}
                    onChange={() => toggleProducto(p.id_producto)}
                    className="text-green-500 focus:ring-green-500"
                  />
                  {p.nombre} {p.descripcion ? `- ${p.descripcion}` : ""}
                </label>
              ))}
            </div>

            {/* Cantidad */}
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            {/* Importancia */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Importancia
              </label>
              <div className="flex gap-6">
                {["Alta", "Media", "Baja"].map((nivel) => (
                  <label key={nivel} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="importancia"
                      value={nivel}
                      checked={importancia === nivel}
                      onChange={(e) => setImportancia(e.target.value)}
                      className="text-green-500 focus:ring-green-500"
                    />
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Revisado">Revisado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            {/* Fecha creación */}
            <input
              type="date"
              value={fecha_creacion}
              onChange={(e) => setFechaCreacion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Guardar Gestión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Gestion;
