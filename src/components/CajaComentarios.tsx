import React, { useEffect, useState } from "react";

interface Comentario {
  id: number;
  contenido: string;
  nombreUsuario: string;
  created_at: string;
}

interface Props {
  idReporte: number;
}

const CajaComentarios: React.FC<Props> = ({ idReporte }) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [cargando, setCargando] = useState(false);

  const apiBase = import.meta.env.VITE_API_COMENTARIOS;

  // 🔄 Cargar comentarios del reporte
  const obtenerComentarios = async () => {
    if (!idReporte) return console.error("⚠ Falta idReporte en CajaComentarios");

    try {
      const token = localStorage.getItem("token");
      const url = `${apiBase}/reporte/${idReporte}/comentarios`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("🟢 Comentarios cargados:", data);

      if (data.data && Array.isArray(data.data)) {
        setComentarios(data.data);
      } else {
        setComentarios([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener comentarios:", error);
      setComentarios([]);
    }
  };

  // 📨 Enviar nuevo comentario
  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    if (!idReporte) {
      alert("No se puede enviar comentario sin ID de reporte");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuario no autenticado");
      return;
    }

    try {
      setCargando(true);
      const url = `${apiBase}/reporte/${idReporte}/comentarios`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contenido: nuevoComentario, // ✅ lo que el backend espera
        }),
      });

      const data = await res.json();
      console.log("📤 Respuesta del backend:", res.status, data);

      if (res.ok) {
        setNuevoComentario("");
        obtenerComentarios(); // 🔁 recargar comentarios
      } else {
        alert(data.error || "Hubo un problema al enviar el comentario.");
      }
    } catch (error) {
      console.error("❌ Error al enviar comentario:", error);
      alert("Hubo un problema al enviar el comentario.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, [idReporte]);

  return (
    <div className="mt-6 bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">💬 Comentarios</h3>

      {/* Lista de comentarios */}
      <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
        {comentarios.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No hay comentarios aún.
          </p>
        ) : (
          comentarios.map((c) => (
            <div
              key={c.id}
              className="border border-gray-200 rounded-md p-3 bg-gray-50"
            >
              <p className="text-gray-800 text-sm">{c.contenido}</p>
              <p className="text-xs text-gray-500 mt-1">
                {c.nombreUsuario} •{" "}
                {new Date(c.created_at).toLocaleString("es-CO")}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Formulario */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={enviarComentario}
          disabled={cargando}
          className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
            cargando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {cargando ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default CajaComentarios;
