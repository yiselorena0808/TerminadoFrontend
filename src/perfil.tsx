import React, { useEffect, useState } from "react";
import ActualizarUsuarioModal from "./Admin/Actualizarusuarios";

const PYTHON_SERVER = "http://127.0.0.1:5000";

interface Empresa {
  id_empresa: number;
  nombre: string;
  direccion: string;
}

interface Area {
  id_area: number;
  nombre_area: string;
  descripcion: string;
}

interface Usuario {
  id: number;
  idArea: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  empresa?: Empresa;
  area?: Area;
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [template, setTemplate] = useState<string>("");

  useEffect(() => {
    const datos = localStorage.getItem("usuario");
    if (datos) setUsuario(JSON.parse(datos));
  }, []);

  const handleActualizar = (usuarioActualizado: Usuario) => {
    if (!usuario) return;
    const nuevoUsuario = { ...usuario, ...usuarioActualizado };
    setUsuario(nuevoUsuario);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
  };

  // 🟢 PROCESO COMPLETO DE REGISTRO DE HUELLA
  const registrarHuella = async () => {
    if (!usuario) return;

    try {
      setRegistrando(true);

      console.log("🔵 Enviando /init al servidor Python...");
      const initRes = await fetch(`${PYTHON_SERVER}/init`);

      if (!initRes.ok) {
        const data = await initRes.json();
        alert("❌ Error inicializando SDK: " + data.message);
        setRegistrando(false);
        return;
      }

      console.log("🟢 SDK inicializado correctamente");

      console.log("🟦 Enviando /capture...");
      const resHuella = await fetch(`${PYTHON_SERVER}/capture`);

      if (!resHuella.ok) {
        const errorTxt = await resHuella.text();
        console.error("❌ Error /capture:", errorTxt);
        alert("❌ Error capturando huella");
        setRegistrando(false);
        return;
      }

      const dataHuella = await resHuella.json();

      if (!dataHuella.template) {
        alert("❌ No se recibió template desde Python");
        setRegistrando(false);
        return;
      }

      console.log("🟢 Template recibido");
      const huellaBase64 = dataHuella.template;
      setTemplate(huellaBase64);

      // Enviar al backend Adonis
      const token = localStorage.getItem("token");
      console.log("📡 Enviando template al backend Adonis...");

      const res = await fetch("http://localhost:3333/guardarHuella", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idUsuario: usuario.id,
          template: huellaBase64,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Huella guardada correctamente");
      } else {
        alert("⚠️ Error guardando huella: " + data.mensaje);
      }

    } catch (error: any) {
      console.error("❌ Error EN registrarHuella:", error);

      if (error.message.includes("Failed to fetch")) {
        alert("❌ Error de conexión: El servidor de huellas está apagado o inaccesible.");
      } else {
        alert("❌ Error inesperado: " + error.message);
      }

    } finally {
      setRegistrando(false);
    }
  };

  if (!usuario) {
    return <p className="text-center mt-10 text-gray-600">⚠ No hay usuario logueado</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-40 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* Información principal */}
        <div className="mt-20 text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {usuario.nombre} {usuario.apellido}
          </h2>
          <p className="text-gray-500">@{usuario.nombreUsuario}</p>
          <span className="mt-3 inline-block bg-indigo-100 text-indigo-700 text-sm px-5 py-1 rounded-full font-medium">
            {usuario.cargo}
          </span>
        </div>

        {/* Botón registrar huella */}
        <div className="text-center pb-8 space-x-4">
          {usuario.cargo === "SG-SST" && (
            <button
              onClick={registrarHuella}
              disabled={registrando}
              className={`px-6 py-2 rounded-full ${
                registrando ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white font-semibold shadow-md transition`}
            >
              {registrando ? "🕐 Capturando..." : "🖐 Registrar Huella"}
            </button>
          )}
        </div>

        {/* Mostrar template */}
        {template && (
          <div className="text-center pb-8">
            <p className="text-sm text-gray-500 mb-2">Huella capturada (Base64)</p>
            <textarea
              className="w-11/12 p-2 text-xs border rounded-lg bg-gray-50"
              rows={4}
              readOnly
              value={template}
            />
          </div>
        )}
      </div>

      {modalAbierto && usuario && (
        <ActualizarUsuarioModal
          usuario={usuario}
          onClose={() => setModalAbierto(false)}
          onUpdate={handleActualizar}
        />
      )}
    </div>
  );
};

export default Perfil;
