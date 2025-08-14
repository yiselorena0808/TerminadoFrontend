import React, { useState } from "react";

interface ListaChequeoProps {
  onSubmit: (datos: {
    id: number;
    id_usuario: number;
    usuario_nombre: string;
    fecha: string;
    hora: string;
    modelo: string;
    marca: string;
    soat: string;
    tecnico: string;
    kilometraje: string;
  }) => void;
}

const ListaChequeo: React.FC<ListaChequeoProps> = ({ onSubmit }) => {
  const [id, setId] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [usuario_nombre, setUsuarioNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [soat, setSoat] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idNum = parseInt(id);
    const idUsuarioNum = parseInt(id_usuario);

    if (isNaN(idNum) || isNaN(idUsuarioNum)) {
      alert("ID y ID Usuario deben ser números válidos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/crearListaChequeo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idNum,
          id_usuario: idUsuarioNum,
          usuario_nombre,
          fecha,
          hora,
          modelo,
          marca,
          soat,
          tecnico,
          kilometraje,
        }),
      });

      const msj = await response.json();
      setMensaje(msj.mensaje || "Lista de chequeo creada exitosamente.");
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setMensaje("Error al conectar con el servidor.");
    }

    onSubmit({
      id: idNum,
      id_usuario: idUsuarioNum,
      usuario_nombre,
      fecha,
      hora,
      modelo,
      marca,
      soat,
      tecnico,
      kilometraje,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda con imagen */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://realjustice.com/wp-content/uploads/2022/05/How-Long-after-a-Car-Accident-Can-You-Claim-Injury.jpg.webp')",
        }}
      >
        {/* Puedes poner un overlay si quieres */}
        <div className="w-full h-full bg-blue-900/40 flex items-center justify-center text-white text-4xl font-bold">
          Lista de Chequeo
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900">
        <div className="w-full max-w-lg bg-blue-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Registro Lista de Chequeo
          </h2>

          {mensaje && (
            <div className="mb-4 p-3 rounded-lg bg-blue-300 text-blue-900 text-center font-medium">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
              value={usuario_nombre}
              onChange={(e) => setUsuarioNombre(e.target.value)}
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
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="SOAT"
              value={soat}
              onChange={(e) => setSoat(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Técnico"
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              placeholder="Kilometraje"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg bg-blue-700/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />

            <button
              type="submit"
              className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Guardar Lista de Chequeo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListaChequeo;
