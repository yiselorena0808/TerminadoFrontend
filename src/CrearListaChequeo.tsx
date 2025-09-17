import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

interface UsuarioToken {
  id: number;
  nombre: string;
  id_empresa: number;
}

const CrearListaChequeo: React.FC = () => {
  const apiCrearLista = import.meta.env.VITE_API_CREARCHEQUEO;

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [soat, setSoat] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<any>(token); 
      setUsuario({
        id: decoded.id,
        nombre: decoded.nombre,
        id_empresa: decoded.id_empresa ?? decoded.idEmpresa,
      });
    } catch (error) {
      console.error(" Token inválido", error);
      setMensaje("Token inválido, inicia sesión otra vez");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("No hay token, inicia sesión");
      return;
    }

    try {
      const res = await fetch(apiCrearLista, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha,
          hora,
          modelo,
          marca,
          soat,
          tecnico,
          kilometraje,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al crear la lista");
        return;
      }

      setMensaje("Lista creada correctamente");
      setFecha("");
      setHora("");
      setModelo("");
      setMarca("");
      setSoat("");
      setTecnico("");
      setKilometraje("");
    } catch (error) {
      console.error("Error creando lista:", error);
      setMensaje("No se pudo crear la lista");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Crear Lista de Chequeo</h2>

      {/* Mostrar usuario logueado */}
      {usuario && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p>
            <strong>Usuario:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>ID Usuario:</strong> {usuario.id}
          </p>
        </div>
      )}

      {/*  Mostrar mensajes */}
      {mensaje && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {mensaje}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          placeholder="Marca"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          value={soat}
          onChange={(e) => setSoat(e.target.value)}
          placeholder="SOAT"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          value={tecnico}
          onChange={(e) => setTecnico(e.target.value)}
          placeholder="Técnico"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          value={kilometraje}
          onChange={(e) => setKilometraje(e.target.value)}
          placeholder="Kilometraje"
          required
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Crear Lista
        </button>
      </form>
    </div>
  );
};

export default CrearListaChequeo;
