import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface UsuarioToken {
  id_usuario: number;
  usuario_nombre: string;
  id_empresa: number;
}

const CrearListaChequeo: React.FC = () => {
  const navigate = useNavigate();
  const apiCrearLista = import.meta.env.VITE_API_CREARCHEQUEO;

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [soat, setSoat] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [kilometraje, setKilometraje] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<any>(token);
      setUsuario({
        id_usuario: decoded.id,
        usuario_nombre: decoded.nombre,
        id_empresa: decoded.id_empresa ?? decoded.idEmpresa,
      });
    } catch (error) {
      console.error(" Token inválido", error);
      showToast("error", "Token inválido, inicia sesión otra vez");
      navigate("/login");
    }
  }, []);

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
    if (icon === "success") {
      setTimeout(() => {
        navigate("/nav/ListasChequeo"); 
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      return showToast("error", "No hay token, inicia sesión");
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
          id_usuario: usuario?.id_usuario,          
          usuario_nombre: usuario?.usuario_nombre,
          id_empresa: usuario?.id_empresa, 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast("error", data.error || "Error al crear la lista");
      }

      showToast("success", "Lista de chequeo creada ✅");

      setFecha("");
      setHora("");
      setModelo("");
      setMarca("");
      setSoat("");
      setTecnico("");
      setKilometraje("");
    } catch (error) {
      console.error("Error creando lista:", error);
      showToast("error", "No se pudo crear la lista");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">📝 Crear Lista de Chequeo</h2>

      {usuario && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p>
            <strong>Usuario:</strong> {usuario.usuario_nombre}
          </p>
          <p>
            <strong>ID Usuario:</strong> {usuario.id_usuario}
          </p>
        </div>
      )}

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
