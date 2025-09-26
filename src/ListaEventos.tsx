import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsuarioFromToken } from "./utils/auth";

interface UsuarioToken {
  id: number;
  nombre: string;
  id_empresa: number;
}

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fechaActividad: string;
  imagen: string;
  archivo: string;
  usuario: {
    nombre: string;
  };
  empresa: {
    nombre: string;
  };
}

const ListaEventos: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuario = getUsuarioFromToken() as UsuarioToken | null;

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
  const [tituloEdit, setTituloEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [imagenEdit, setImagenEdit] = useState<File | null>(null);
  const [archivoEdit, setArchivoEdit] = useState<File | null>(null);

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
  };

  useEffect(() => {
    if (!usuario) {
      showToast("error", "No hay usuario autenticado");
      setLoading(false);
      return;
    }

    const fetchEventos = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_lISTARBLOG}${usuario.id_empresa}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error cargando eventos");
        }

        const data = await res.json();
        setEventos(data);
      } catch (err: any) {
        console.error("Error cargando eventos:", err);
        showToast("error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [usuario, token]);

  const eventosFiltrados = eventos.filter((e) =>
    e.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir modal
  const abrirModal = (evento: Evento) => {
    setEventoEditar(evento);
    setTituloEdit(evento.titulo);
    setDescripcionEdit(evento.descripcion);
    setImagenEdit(null);
    setArchivoEdit(null);
    setModalOpen(true);
  };

  // Actualizar evento
  const handleActualizar = async () => {
    if (!eventoEditar) return;

    const formData = new FormData();
    formData.append("titulo", tituloEdit);
    formData.append("descripcion", descripcionEdit);
    if (imagenEdit) formData.append("imagen", imagenEdit);
    if (archivoEdit) formData.append("archivo", archivoEdit);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_ACTUALIZAREVENTO}${eventoEditar.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error actualizando publicación");
      }

      const data = await res.json();
    setEventos((prev) => prev.map((e) => (e.id === data.id ? data : e)));
    setModalOpen(false);
    showToast("success", "Publicación actualizada!");
    navigate("/nav/blog");
    } catch (err: any) {
        console.error("Error actualizando publicación:", err);
        showToast("error", err.message);
    }
    };
    
  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ELIMINAREVENTO}${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error eliminando publicación");

        setEventos(eventos.filter((e) => e.id !== id));
        showToast("success", "Publicación eliminada");
      } catch (err: any) {
        console.error("Error eliminando publicación:", err);
        showToast("error", err.message);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Título y descripción general */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-3 text-white">
          📋 Publicaciones de la Empresa
        </h1>
        <p className="max-w-2xl mx-auto text-white">
          Explora todas las publicaciones creadas por tu equipo. Filtra por título o crea nuevas publicaciones.
        </p>
      </div>

      {/* Buscador y botón Crear */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Buscar por título..."
          className="border rounded px-4 py-2 w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold shadow-md"
          onClick={() => navigate("/nav/crearBlog")}
        >
          + Crear Publicación
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <p className="text-center mt-6 text-gray-500">Cargando publicaciones...</p>
      ) : eventosFiltrados.length === 0 ? (
        <p className="text-center mt-6 text-gray-500">No hay publicaciones 😔</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <div
              key={evento.id}
              className="bg-gradient-to-b from-white to-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              {evento.imagen && (
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  className="w-full h-52 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-2xl font-bold mb-2 text-blue-700 hover:text-blue-800 transition">
                  {evento.titulo}
                </h3>
                <p className="text-gray-700 mb-4 text-justify">
                  {evento.descripcion}
                </p>
                <div className="text-sm text-gray-500 mb-3 space-y-1">
                  <p>📅 {new Date(evento.fechaActividad).toLocaleDateString()}</p>
                  <p>👤 {evento.usuario.nombre}</p>
                  <p>🏢 {evento.empresa.nombre}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {evento.archivo && (
                    <a
                      href={evento.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
                    >
                      Descargar archivo
                    </a>
                  )}

                  <button
                    onClick={() => abrirModal(evento)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleEliminar(evento.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de actualización */}
      {modalOpen && eventoEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Actualizar Publicación</h2>
            <input
              type="text"
              className="border rounded w-full px-4 py-2 mb-4"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
              placeholder="Título"
            />
            <textarea
              className="border rounded w-full px-4 py-2 mb-4"
              value={descripcionEdit}
              onChange={(e) => setDescripcionEdit(e.target.value)}
              placeholder="Descripción"
              rows={4}
            />
            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={(e) => setImagenEdit(e.target.files?.[0] || null)}
            />
            <input
              type="file"
              className="mb-4"
              onChange={(e) => setArchivoEdit(e.target.files?.[0] || null)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleActualizar}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaEventos;
