import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Gestion1 {
  onSubmit: (datos: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    cedula: number;
    cargo: string;
    productos: string;
    cantidad: number;
    importancia: string;
    estado: string | null;
    fecha_creacion: string;
  }) => void;
}

interface RegistroEPP {
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: number;
  cargo: string;
  productos: string;
  cantidad: number;
  importancia: string;
  estado: string | null;
  fecha_creacion: string;
}

const Gestion: React.FC<Gestion1> = ({ onSubmit }) => {
  const navigate = useNavigate();

  const [id_usuario, setIdUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [cargo, setCargo] = useState("");
  const [productos, setProductos] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [importancia, setImportancia] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [fecha_creacion, setFechaCreacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [registros, setRegistros] = useState<RegistroEPP[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cedulaNum = parseInt(cedula);
    const cantidadNum = parseInt(cantidad);
    const idUsuarioNum = parseInt(id_usuario);

    const apiGestion = import.meta.env.VITE_API_CREARGESTION;

    if (isNaN(cedulaNum) || isNaN(cantidadNum) || isNaN(idUsuarioNum)) {
      alert("Cédula, Cantidad e ID Usuario deben ser números válidos.");
      return;
    }

    try {
      const response = await fetch(apiGestion, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idUsuarioNum,
          nombre,
          apellido,
          cedula: cedulaNum,
          cargo,
          productos,
          cantidad: cantidadNum,
          importancia,
          estado,
          fecha_creacion,
        }),
      });

      const msj = await response.json();
      setMensaje(msj.mensaje || "Gestión creada exitosamente.");
      obtenerRegistros();
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setMensaje("Error al conectar con el servidor.");
    }

    onSubmit({
      id_usuario: idUsuarioNum,
      nombre,
      apellido,
      cedula: cedulaNum,
      cargo,
      productos,
      cantidad: cantidadNum,
      importancia,
      estado,
      fecha_creacion,
    });
  };

  const obtenerRegistros = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_LISTARGESTIONES);
      const data = await res.json();
      setRegistros(data.datos);
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };

  useEffect(() => {
    obtenerRegistros();
  }, []);

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
  {/* Botón de volver sobre la imagen */}
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
            {/* Inputs */}
            <input
              type="number"
              placeholder="ID Usuario"
              value={id_usuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="number"
              placeholder="Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              placeholder="Cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              placeholder="Lista de productos"
              value={productos}
              onChange={(e) => setProductos(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
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
                value={estado ?? ""}
                onChange={(e) => setEstado(e.target.value || null)}
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Revisado">Revisado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

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
