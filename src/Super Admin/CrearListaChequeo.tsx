import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaClipboardCheck, FaPaperPlane } from "react-icons/fa";

interface UsuarioToken {
  id_usuario: number;
  usuario_nombre: string;
  id_empresa: number;
}

const CrearListaChequeoSA: React.FC = () => {
  const navigate = useNavigate();
  const apiCrearLista = import.meta.env.VITE_API_CREARCHEQUEO;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;

  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [soat, setSoat] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [placa, setPlaca] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<any>(token);

      const userData = {
        id_usuario: decoded.id,
        usuario_nombre: decoded.nombre,
        id_empresa:
          decoded.id_empresa ??
          decoded.idEmpresa ??
          decoded.empresa ??
          null,
      };

      setUsuario(userData);

      setEmpresaSeleccionada("");

    } catch (error) {
      console.error("Token inválido", error);
      showToast("error", "Token inválido, inicia sesión otra vez");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cargarEmpresas = async () => {
      try {
        const res = await fetch(apiEmpresas, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        let listado: any[] = [];

        if (Array.isArray(data)) listado = data;
        else if (Array.isArray(data.datos)) listado = data.datos;
        else if (Array.isArray(data.empresas)) listado = data.empresas;

        const normalizadas = listado.map((emp) => {
          const id =
            emp.id_empresa ??
            emp.idEmpresa ??
            emp.id ??
            null;

          const nombre =
            emp.nombre ??
            emp.razonSocial ??
            emp.nombre_empresa ??
            "Empresa sin nombre";

          return { id, nombre };
        });

        setEmpresas(normalizadas);
      } catch (error) {
        console.error("Error listando empresas:", error);
        Swal.fire("Error", "No se pudieron cargar las empresas", "error");
      }
    };

    cargarEmpresas();
  }, []);

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
    });
    if (icon === "success") {
      setTimeout(() => navigate("/nav/ListaChequeoGenerales"), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return showToast("error", "No hay token");

    if (!empresaSeleccionada)
      return showToast("error", "Debes seleccionar una empresa");

    try {
      const body = {
        fecha,
        hora,
        modelo,
        marca,
        soat,
        tecnico,
        kilometraje,
        placa,
        observaciones,

        // 🔵 Usuario
        id_usuario: usuario?.id_usuario,
        usuario_nombre: usuario?.usuario_nombre,

        // 🔵 Empresa enviada correctamente
        id_empresa: Number(empresaSeleccionada),
      };

      const res = await fetch(apiCrearLista, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) return showToast("error", data.error || "Error al crear");

      showToast("success", "Lista de chequeo creada");

      // LIMPIAR FORMULARIO
      setFecha("");
      setHora("");
      setModelo("");
      setMarca("");
      setSoat("");
      setTecnico("");
      setKilometraje("");
      setPlaca("");
      setObservaciones("");
      setEmpresaSeleccionada("");

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
      <div className="absolute inset-0 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-blue-600"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaClipboardCheck className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Crear Lista de Chequeo
          </h2>
        </div>

        {/* 🔵 Select de Empresa */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Empresa:
          </label>
          <select
            value={empresaSeleccionada}
            onChange={(e) => setEmpresaSeleccionada(e.target.value)}
            className="border p-3 rounded-xl w-full"
            required
          >
            <option value="">-- Selecciona una empresa --</option>

            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="border p-3 rounded-xl" />
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required className="border p-3 rounded-xl" />
          <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo" required className="border p-3 rounded-xl" />
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" required className="border p-3 rounded-xl" />
          <input type="text" value={soat} onChange={(e) => setSoat(e.target.value)} placeholder="SOAT" required className="border p-3 rounded-xl" />
          <input type="text" value={tecnico} onChange={(e) => setTecnico(e.target.value)} placeholder="Técnico" required className="border p-3 rounded-xl" />
          <input type="number" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} placeholder="Kilometraje" required className="border p-3 rounded-xl" />
          <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="Placa (opcional)" className="border p-3 rounded-xl" />
        </div>

        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones"
          className="border p-3 rounded-xl w-full mt-4"
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-400 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2"
        >
          <FaPaperPlane /> Enviar
        </button>
      </form>
    </div>
  );
};

export default CrearListaChequeoSA;
