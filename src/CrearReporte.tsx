import React, { useState } from "react";

interface ReportesProps {
  onSubmit: (datos: {
    id_reporte: number;
    id_usuario: number;
    nombre_usuario: string;
    cargo: string;
    cedula: string;
    fecha: string;
    lugar: string;
    descripcion: string;
    imagen: string;
    archivos: string;
    estado: string | null;
  }) => void;
}

const Reportes: React.FC<ReportesProps> = ({ onSubmit }) => {
  const [id_reporte, setIdReporte] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [cargo, setCargo] = useState("");
  const [cedula, setCedula] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [archivos, setArchivos] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idReporteNum = parseInt(id_reporte);
    const idUsuarioNum = parseInt(id_usuario);

    if (isNaN(idReporteNum) || isNaN(idUsuarioNum)) {
      alert("ID de reporte y ID de usuario deben ser números válidos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/crearReporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_reporte: idReporteNum,
          id_usuario: idUsuarioNum,
          nombre_usuario,
          cargo,
          cedula,
          fecha,
          lugar,
          descripcion,
          imagen,
          archivos,
          estado,
        }),
      });

      const msj = await response.json();
      setMensaje(msj.mensaje || "Reporte enviado correctamente.");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMensaje("Error al conectar con el servidor.");
    }

    onSubmit({
      id_reporte: idReporteNum,
      id_usuario: idUsuarioNum,
      nombre_usuario,
      cargo,
      cedula,
      fecha,
      lugar,
      descripcion,
      imagen,
      archivos,
      estado,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda con imagen */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/vector-gratis/equipo-construccion-trabajadores_24908-56103.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      >
        <div className="w-full h-full bg-blue-900/40 flex items-center justify-center text-white text-4xl font-bold">
          Registro de Reportes
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900">
        <div className="w-full max-w-lg bg-blue-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Registro de Reportes
          </h2>

          {mensaje && (
            <div className="mb-4 p-3 rounded-lg bg-blue-300 text-blue-900 text-center font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="ID Reporte"
              value={id_reporte}
              onChange={(e) => setIdReporte(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
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
              placeholder="Nombre Usuario"
              value={nombre_usuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
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
              placeholder="Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Lugar"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Imagen (URL)"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Archivos (URL)"
              value={archivos}
              onChange={(e) => setArchivos(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={estado ?? ""}
              onChange={(e) => setEstado(e.target.value || null)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="Abierto">Abierto</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Cerrado">Cerrado</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Enviar Reporte
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
