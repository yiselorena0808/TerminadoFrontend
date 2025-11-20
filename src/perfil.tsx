import React, { useState, useEffect } from "react";
import ActualizarUsuarioModal from "./Admin/Actualizarusuarios";

const API = "http://127.0.0.1:8000";

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

  const [mensaje, setMensaje] = useState("");
  const [huellaPreview, setHuellaPreview] = useState<string | null>(null);

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

  // Capturar huella
  const capturarHuella = async () => {
    try {
      const res = await fetch(`${API}/huella/capturar`);
      const data = await res.json();

      // Simular que la huella se guarda como archivo local y mostrarla
      // En un escenario real, tu backend tendría que devolver la huella en base64
      // Aquí asumimos que la huella se guarda en 'huella_plantilla_suprema.dat' y convertimos a preview
      const fileReader = new FileReader();
      const blob = await fetch("huella_plantilla_suprema.dat").then(r => r.blob());
      fileReader.onload = () => setHuellaPreview(fileReader.result as string);
      fileReader.readAsDataURL(blob);

      setMensaje(data.mensaje || "Huella capturada correctamente");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al capturar la huella");
    }
  };

  // Guardar huella
  const guardarHuella = async () => {
    if (!usuario) return alert("No hay usuario logueado.");

    try {
      const res = await fetch(`${API}/huella/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: usuario.nombre }),
      });

      const data = await res.json();
      setMensaje(res.ok ? `✅ ${data.mensaje}` : `❌ ${data.detail}`);
      if (res.ok) setHuellaPreview(null); // limpiar preview después de guardar
    } catch {
      setMensaje("❌ Error al guardar la huella");
    }
  };

  if (!usuario) {
    return <p className="text-center mt-10 text-gray-600">No se encontró usuario logueado.</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-700 h-40 relative">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
            />
          </div>
        </div>

        {/* INFO DEL USUARIO */}
        <div className="mt-20 text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800">{usuario.nombre} {usuario.apellido}</h2>
          <p className="text-gray-500">@{usuario.nombreUsuario}</p>

          <div className="mt-4 space-y-1 text-gray-700">
            <p><strong>Correo:</strong> {usuario.correoElectronico}</p>
            <p><strong>Cargo:</strong> {usuario.cargo}</p>
            <p><strong>Empresa:</strong> {usuario.empresa?.nombre}</p>
            <p><strong>Área:</strong> {usuario.area?.nombre_area}</p>
          </div>
        </div>

        {/* BOTONES DE HUELLA */}
        <div className="mt-6 text-center space-x-3 pb-6">
          <button onClick={capturarHuella} className="bg-yellow-500 px-5 py-2 rounded text-white font-semibold">
            📸 Capturar Huella
          </button>

          <button onClick={guardarHuella} disabled={!huellaPreview} className="bg-green-600 px-5 py-2 rounded text-white font-semibold disabled:bg-gray-400">
            💾 Guardar Huella
          </button>
        </div>

        {/* PREVIEW DE HUELLA */}
        {huellaPreview && (
          <div className="text-center mb-6">
            <h3 className="font-bold mb-2">Vista previa de la huella</h3>
            <img src={huellaPreview} alt="Huella Preview" className="mx-auto w-40 h-40 object-contain border rounded-md" />
          </div>
        )}

        {/* MENSAJES */}
        {mensaje && <p className="text-center text-gray-700 pb-3">{mensaje}</p>}
      </div>

      {modalAbierto && (
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
