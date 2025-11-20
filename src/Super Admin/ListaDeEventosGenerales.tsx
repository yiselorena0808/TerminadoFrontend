import React, { useEffect, useState } from "react";
import { FaFilePdf, FaSearch, FaEdit, FaTrash, FaMusic, FaPlus, FaCalendar, FaUser, FaBuilding, FaEllipsisV, FaRegClock, FaHashtag } from "react-icons/fa";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

interface Evento {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  titulo: string;
  fechaActividad: string;
  descripcion: string;
  imagen: string | null;
  idEmpresa: number;
  archivo: string | null;
  empresaNombre?: string;
}

const ListaDeEventosGenerales: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [menuPosicion, setMenuPosicion] = useState<{top: number, left: number} | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
  const [tituloEdit, setTituloEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [imagenEdit, setImagenEdit] = useState<File | null>(null);
  const [archivoEdit, setArchivoEdit] = useState<File | null>(null);

  // Player música
  const [busquedaMusica, setBusquedaMusica] = useState("");
  const [urlMusica, setUrlMusica] = useState("");
  const [mostrarPlayer, setMostrarPlayer] = useState(false);

  const showToast = (icon: "success" | "error", title: string) => {
    Swal.fire({
      toast: true,
      icon,
      title,
      timer: 2200,
      position: "top-end",
      showConfirmButton: false,
    });
  };

  // ================================
  //   CARGAR EVENTOS
  // ================================
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [resEmpresas, resEventos] = await Promise.all([
          fetch(import.meta.env.VITE_API_LISTAREMPRESAS, {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(import.meta.env.VITE_API_TODOSEVENTOSGENERALES, {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const dataEmpresas = (await resEmpresas.json()).datos;
        const dataEventos = await resEventos.json();

        const eventosConEmpresa = dataEventos.map((e: Evento) => ({
          ...e,
          empresaNombre:
            dataEmpresas.find((emp: Empresa) => emp.idEmpresa === e.idEmpresa)
              ?.nombre || `Empresa ${e.idEmpresa}`,
        }));

        setEmpresas(dataEmpresas);
        setEventos(eventosConEmpresa);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudieron cargar los eventos", "error");
      }
    };

    cargarTodo();
  }, []);

  const eventosFiltrados = eventos.filter(
    (e) =>
      e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.empresaNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ================================
  //     MODAL EDITAR
  // ================================
  const abrirModal = (evento: Evento) => {
    setEventoEditar(evento);
    setTituloEdit(evento.titulo);
    setDescripcionEdit(evento.descripcion);
    setImagenEdit(null);
    setArchivoEdit(null);
    setModalOpen(true);
    setMenuAbierto(null);
    setMenuPosicion(null);
  };

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
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      const data = await res.json();

      setEventos((prev) => prev.map((e) => (e.id === data.id ? data : e)));

      showToast("success", "Evento actualizado");
      setModalOpen(false);
    } catch (err) {
      showToast("error", "No se pudo actualizar");
    }
  };

  // ================================
  //     ELIMINAR EVENTO
  // ================================
  const eliminarEvento = async (id: number) => {
    setMenuAbierto(null);
    setMenuPosicion(null);
    Swal.fire({
      title: "¿Eliminar publicación?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancelar",
    }).then(async (r) => {
      if (r.isConfirmed) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_ELIMINAREVENTO}${id}`,
            {
              method: "DELETE",
              headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error();

          setEventos((prev) => prev.filter((e) => e.id !== id));
          showToast("success", "Publicación eliminada");
        } catch (error) {
          showToast("error", "No se pudo eliminar");
        }
      }
    });
  };

  // ================================
  //     PDF
  // ================================
  const generarPDF = (ev: Evento) => {
    setMenuAbierto(null);
    setMenuPosicion(null);
    const doc = new jsPDF();
    doc.text(`Evento: ${ev.titulo}`, 10, 10);
    doc.text(`Empresa: ${ev.empresaNombre}`, 10, 20);
    doc.text(`Descripción: ${ev.descripcion}`, 10, 30);
    doc.save(`evento_${ev.id}.pdf`);
  };

  // ================================
  //     PLAYER MUSICA
  // ================================
  const reproducirMusica = async () => {
    if (!busquedaMusica.trim()) return;

    const query = encodeURIComponent(busquedaMusica);

    try {
      const res = await fetch(
        `https://corsproxy.io/?https://www.youtube.com/results?search_query=${query}`
      );

      const html = await res.text();
      const match = html.match(/"videoId":"(.*?)"/);

      if (match) {
        setUrlMusica(`https://www.youtube.com/embed/${match[1]}?autoplay=1`);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la música", "error");
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Toggle menu mejorado
  const toggleMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (menuAbierto === id) {
      setMenuAbierto(null);
      setMenuPosicion(null);
    } else {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calcular posición para evitar que se salga de la pantalla
      let top = buttonRect.bottom + window.scrollY;
      let left = buttonRect.right + window.scrollX - 160; // Ancho del menú
      
      // Si el menú se sale por abajo, mostrarlo arriba
      if (top + 200 > viewportHeight + window.scrollY) {
        top = buttonRect.top + window.scrollY - 200;
      }
      
      // Si se sale por la izquierda, alinear a la derecha
      if (left < 0) {
        left = buttonRect.left + window.scrollX;
      }
      
      setMenuPosicion({ top, left });
      setMenuAbierto(id);
    }
  };

  // Cerrar menu al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuAbierto(null);
      setMenuPosicion(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Generar color único para cada empresa
  const generarColorEmpresa = (nombre: string) => {
    const colores = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-orange-500 to-orange-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600",
    ];
    const index = nombre.length % colores.length;
    return colores[index];
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <FaCalendar className="text-white text-2xl" />
          </div>
          Blog Corporativo
        </h1>
        <button
          onClick={() => navigate("/nav/crearBlog")}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-lg" /> Nueva Publicación
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar publicaciones por título, descripción o empresa..."
              className="w-full px-4 py-4 pl-14 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
          </div>
        </div>
      </div>

      {/* CONTADOR */}
      <div className="mb-6">
        <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{eventosFiltrados.length}</h3>
              <p className="text-blue-100">Publicaciones encontradas</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <FaHashtag className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE EVENTOS - DISEÑO MODERNO */}
      {eventosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalendar className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-600 mb-3">
            No hay publicaciones
          </h3>
          <p className="text-gray-500 text-lg mb-6">
            Comienza creando la primera publicación del blog corporativo
          </p>
          <button
            onClick={() => navigate("/nav/crearBlog")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
          >
            Crear Primera Publicación
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {eventosFiltrados.map((evento) => (
            <div 
              key={evento.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group relative"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  {/* IMAGEN */}
                  {evento.imagen && (
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={evento.imagen}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={evento.titulo}
                        />
                      </div>
                    </div>
                  )}

                  {/* CONTENIDO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {evento.titulo}
                        </h2>
                        
                        <p className="text-gray-600 text-lg leading-relaxed mb-4 line-clamp-2">
                          {evento.descripcion}
                        </p>

                        <div className="flex items-center gap-6 text-gray-500">
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                            <div className={`w-2 h-2 rounded-full ${generarColorEmpresa(evento.empresaNombre || '')}`}></div>
                            <span className="font-medium text-blue-700">{evento.empresaNombre}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaUser className="text-green-500" />
                            <span className="font-medium">{evento.nombreUsuario}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaRegClock className="text-purple-500" />
                            <span className="font-medium">{formatearFecha(evento.fechaActividad)}</span>
                          </div>
                        </div>
                      </div>

                      {/* MENU DE ACCIONES MEJORADO */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={(e) => toggleMenu(evento.id, e)}
                          className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600"
                        >
                          <FaEllipsisV className="text-xl" />
                        </button>

                        {menuAbierto === evento.id && menuPosicion && (
                          <div 
                            className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[160px] animate-in fade-in-0 zoom-in-95"
                            style={{
                              top: `${menuPosicion.top}px`,
                              left: `${menuPosicion.left}px`
                            }}
                          >
                            <button
                              onClick={() => generarPDF(evento)}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors duration-200"
                            >
                              <FaFilePdf className="text-red-500 text-lg" />
                              <span className="font-medium">Exportar PDF</span>
                            </button>
                            <button
                              onClick={() => abrirModal(evento)}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 flex items-center gap-3 transition-colors duration-200"
                            >
                              <FaEdit className="text-yellow-500 text-lg" />
                              <span className="font-medium">Editar</span>
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => eliminarEvento(evento.id)}
                              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
                            >
                              <FaTrash className="text-lg" />
                              <span className="font-medium">Eliminar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalOpen && eventoEditar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-xl">
                  <FaEdit className="text-white text-lg" />
                </div>
                Editar Publicación
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Título de la publicación
                </label>
                <input
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
                  value={tituloEdit}
                  onChange={(e) => setTituloEdit(e.target.value)}
                  placeholder="Escribe el título aquí..."
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Descripción
                </label>
                <textarea
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg resize-none"
                  rows={4}
                  value={descripcionEdit}
                  onChange={(e) => setDescripcionEdit(e.target.value)}
                  placeholder="Describe el contenido de la publicación..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagen destacada
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors duration-300">
                    <input
                      type="file"
                      onChange={(e) => setImagenEdit(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Archivo adjunto
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors duration-300">
                    <input
                      type="file"
                      onChange={(e) => setArchivoEdit(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleActualizar}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER FLOATING BUTTON */}
      <button
        onClick={() => setMostrarPlayer(!mostrarPlayer)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-2xl shadow-2xl transition-all duration-500 z-40 hover:scale-110 group"
      >
        <FaMusic className="text-xl group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* MUSIC PLAYER */}
      {mostrarPlayer && (
        <div className="fixed bottom-24 right-8 w-80 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-6 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-xl">
              <FaMusic className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Reproductor Musical</h3>
          </div>
          
          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
              placeholder="¿Qué quieres escuchar?"
              value={busquedaMusica}
              onChange={(e) => setBusquedaMusica(e.target.value)}
            />

            <button
              onClick={reproducirMusica}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Reproducir Música
            </button>

            {urlMusica && (
              <div className="mt-4 rounded-xl overflow-hidden border-2 border-purple-200">
                <iframe
                  width="100%"
                  height="120"
                  src={urlMusica}
                  allow="autoplay"
                  className="border-0"
                  title="Reproductor de música"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaDeEventosGenerales;