import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaClipboardCheck, FaPaperPlane } from "react-icons/fa";

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
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/fotos-premium/equipos-proteccion-personal-para-la-seguridad-industrial_1033579-251259.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-yellow-900/40 backdrop-blur-sm"></div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-yellow-500"
      >
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <FaClipboardCheck className="text-yellow-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Crear Lista de Chequeo
          </h2>
        </div>

        {/* Usuario info */}
        {usuario && (
          <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm">
            <p>
              <strong>👤 Usuario:</strong> {usuario.usuario_nombre}
            </p>
            <p>
              <strong>ID:</strong> {usuario.id_usuario}
            </p>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Modelo"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Marca"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            value={soat}
            onChange={(e) => setSoat(e.target.value)}
            placeholder="SOAT"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            value={tecnico}
            onChange={(e) => setTecnico(e.target.value)}
            placeholder="Técnico"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            placeholder="Kilometraje"
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 col-span-2"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <FaPaperPlane /> Crear Lista
        </button>
      </form>
    </div>
  );
};

export default CrearListaChequeo;
