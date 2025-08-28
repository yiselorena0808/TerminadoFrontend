import React, { useState, useEffect } from "react";

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

    const apiGestion= import.meta.env.VITE_API_CREARGESTION;

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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda con imagen */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://ccmty.com/wp-content/uploads/2018/02/1c257c52b98d4c8b895eac8364583bc9.jpg')",
        }}
      >
        <div className="w-full h-full bg-blue-900/40 flex items-center justify-center text-white text-4xl font-bold text-center p-4">
          Gestión de Entrega de EPP
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-start p-10 bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900">
        <div className="w-full max-w-lg bg-blue-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Formulario de Gestión
          </h2>

          {mensaje && (
            <div className="mb-4 p-3 rounded-lg bg-blue-300 text-blue-900 text-center font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="ID Usuario"
              value={id_usuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="number"
              placeholder="Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Lista de productos"
              value={productos}
              onChange={(e) => setProductos(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />

            {/* Importancia */}
            <div className="text-white">
              <label className="block font-semibold mb-1">Importancia</label>
              <div className="flex gap-6">
                {["Alta", "Media", "Baja"].map((nivel) => (
                  <label key={nivel} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="importancia"
                      value={nivel}
                      checked={importancia === nivel}
                      onChange={(e) => setImportancia(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block font-semibold mb-1">Estado</label>
              <select
                value={estado ?? ""}
                onChange={(e) => setEstado(e.target.value || null)}
                className="w-full p-3 rounded-lg bg-blue-700/50 text-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Finalizado</option>
                <option value="Inactivo">Revisado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <input
              type="date"
              value={fecha_creacion}
              onChange={(e) => setFechaCreacion(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />

            <button
              type="submit"
              className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
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
