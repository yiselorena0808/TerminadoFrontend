import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHardHat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaShieldAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { 
  getUsuarioFromToken, 
  type UsuarioToken,
  esUsuarioSGSST,
  getCargoUsuario,
} from "../utils/auth";
import { socket } from "../services/socket";

interface Reporte {
  id_reporte: number;
  id_usuario: number;
  nombre_usuario: string;
  cargo: string;
  cedula: number | string;
  fecha: string | null;
  lugar: string;
  descripcion: string;
  imagen: string;
  archivos: string;
  estado: string;
  id_empresa: number;
}

interface Notificacion {
  id: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  id_reporte?: number;
  lugar?: string;
  usuario?: string;
  descripcion?: string;
  estado?: string;
  origen?: 'socket' | 'bd';
}

const ListarReportes: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  
  // 🔔 ESTADOS PARA NOTIFICACIONES
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrarPanelNotificaciones, setMostrarPanelNotificaciones] = useState(false);
  const [contadorNoLeidas, setContadorNoLeidas] = useState(0);
  const [esSGSST, setEsSGSST] = useState(false);
  const [socketConectado, setSocketConectado] = useState(false);
  const [cargoUsuario, setCargoUsuario] = useState<string>("");
  
  const panelRef = useRef<HTMLDivElement>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const reportesPorPagina = 9;

  const estados = ["Todos", "Pendiente", "Revisado", "Finalizado"];
  const apiListarReportes = import.meta.env.VITE_API_LISTARREPORTES;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

  useEffect(() => {
    console.log("🔍 Iniciando verificación de usuario...");
    const u = getUsuarioFromToken();
    if (u) {
      setUsuario(u);
      console.log("👤 Usuario del token:", {
        nombre: u.nombre,
        apellido: u.apellido,
        id_empresa: u.id_empresa,
        cargo: u.cargo || "No especificado en token"
      });
    }
    
    const cargo = getCargoUsuario();
    setCargoUsuario(cargo || "");
    console.log("🎯 Cargo obtenido:", cargo);
    
    const esSGSSTVerificado = esUsuarioSGSST();
    console.log("✅ Es SG-SST?:", esSGSSTVerificado);
    setEsSGSST(esSGSSTVerificado);
    
    
  }, []);

  useEffect(() => {
    if (!usuario || !esSGSST) return;

    const obtenerNotificacionesBD = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/notificaciones`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          const notificacionesBD = data.notificaciones?.map((notif: any) => ({
            id: `bd_${notif.id}`,
            mensaje: notif.mensaje,
            fecha: new Date(notif.fecha),
            leida: notif.leida,
            id_reporte: notif.id_reporte,
            lugar: notif.reporte?.lugar,
            usuario: notif.reporte?.nombre_usuario,
            descripcion: notif.reporte?.descripcion,
            estado: notif.reporte?.estado,
            origen: 'bd'
          })) || [];

          setNotificaciones(prev => {
            const idsExistentes = new Set(prev.map(n => n.id));
            const nuevasNotifBD = notificacionesBD.filter((n: any) => !idsExistentes.has(n.id));
            return [...prev, ...nuevasNotifBD];
          });
        }
      } catch (error) {
        console.error('Error obteniendo notificaciones de BD:', error);
      }
    };

    obtenerNotificacionesBD();
    const intervalo = setInterval(obtenerNotificacionesBD, 30000);

    return () => clearInterval(intervalo);
  }, [usuario, esSGSST, API_URL]);

  // 🔔 CONECTAR SOCKET Y REGISTRAR ROL
  useEffect(() => {
    if (!usuario) {
      console.log("⏳ Esperando usuario...");
      return;
    }

    console.log("🔌 Iniciando conexión socket...");
    console.log("📊 Información para socket:");
    console.log("   - Usuario:", usuario.nombre);
    console.log("   - Cargo:", cargoUsuario);
    console.log("   - Es SG-SST:", esSGSST);
    console.log("   - ID Empresa:", usuario.id_empresa);

    let rolParaSocket = "empleado";
    if (esSGSST) {
      rolParaSocket = "SG-SST";
      console.log("🎯 Registrando socket como: SG-SST");
    } else {
      console.log("🎯 Registrando socket como: empleado");
    }

    if (!socket.connected) {
      console.log("🔗 Conectando socket...");
      socket.connect();
    }

    const handleConnect = () => {
      console.log("✅ Socket conectado, ID:", socket.id);
      setSocketConectado(true);
      
      console.log(`📤 Enviando rol al servidor: ${rolParaSocket}`);
      socket.emit("registrar_rol", rolParaSocket);
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    // 🔔 ESCUCHAR NOTIFICACIONES SOLO SI ES SG-SST
    if (esSGSST) {
      console.log("👂 Configurando listeners para notificaciones SG-SST");
      
      socket.on("notificacion_sg_sst", (data: any) => {
        console.log("📢 Notificación SG-SST recibida:", data);
        
        const nuevaNotif: Notificacion = {
          id: `socket_${Date.now()}_${Math.random()}`,
          mensaje: data.mensaje || "Nueva notificación",
          fecha: new Date(data.fecha || Date.now()),
          leida: false,
          id_reporte: data.id_reporte,
          lugar: data.lugar,
          usuario: data.usuario,
          descripcion: data.descripcion,
          estado: data.estado,
          origen: 'socket'
        };
        
        setNotificaciones(prev => [nuevaNotif, ...prev]);
        
        mostrarToast(nuevaNotif.mensaje);
        
        obtenerListas();
      });
    } else {
      console.log("🚫 Usuario no es SG-SST, no se configuran listeners");
    }

    socket.on("rol_registrado", (data: any) => {
      console.log("✅ Rol registrado en servidor:", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket desconectado");
      setSocketConectado(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión socket:", error);
      setSocketConectado(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMostrarPanelNotificaciones(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      socket.off("connect");
      socket.off("notificacion_sg_sst");
      socket.off("rol_registrado");
      socket.off("disconnect");
      socket.off("connect_error");
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [usuario, esSGSST, cargoUsuario]);

  // Actualizar contador de no leídas
  useEffect(() => {
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    setContadorNoLeidas(noLeidas);
  }, [notificaciones]);

  // 🔔 FUNCIÓN PARA MOSTRAR TOAST
  const mostrarToast = (mensaje: string) => {
    let toast = document.getElementById("notificacion-toast");
    
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "notificacion-toast";
      toast.className = "fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 opacity-0 translate-y-[-20px]";
      document.body.appendChild(toast);
    }
    
    toast.textContent = mensaje;
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
    
    setTimeout(() => {
      toast?.classList.remove("opacity-100", "translate-y-0");
      toast?.classList.add("opacity-0", "translate-y-[-20px]");
    }, 3000);
  };

  // 🔔 FUNCIÓN PARA ABRIR REPORTE DESDE NOTIFICACIÓN
  const abrirReporteDesdeNotificacion = async (notificacion: Notificacion) => {
    if (!notificacion.id_reporte || !usuario) return;

    try {
      const token = localStorage.getItem("token");
      
      if (notificacion.id.toString().startsWith('bd_')) {
        const idBD = notificacion.id.toString().replace('bd_', '');
        await fetch(`${API_URL}/notificaciones/${idBD}/leer`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
      }

      marcarComoLeida(notificacion.id);

      const res = await fetch(`${API_URL}/idReporte/${notificacion.id_reporte}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const data = await res.json();

      if (data.datos) {
        navigate("/nav/detalleReportes", { 
          state: data.datos 
        });
      }

      setMostrarPanelNotificaciones(false);

    } catch (error) {
      console.error('Error al abrir reporte desde notificación:', error);
      mostrarToast('❌ Error al cargar el reporte');
    }
  };

  // 🔔 MARCAR NOTIFICACIÓN COMO LEÍDA (CONSUMIENDO API)
  const marcarComoLeida = async (id: string) => {
    try {
      if (id.toString().startsWith('bd_')) {
        const idBD = id.toString().replace('bd_', '');
        const token = localStorage.getItem('token');
        
        await fetch(`${API_URL}/notificaciones/${idBD}/leer`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
      }

      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  // 🔔 MARCAR TODAS COMO LEÍDAS (CONSUMIENDO API)
  const marcarTodasComoLeidas = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const tieneNotifBD = notificaciones.some(n => n.id.toString().startsWith('bd_'));
      if (tieneNotifBD && token) {
        await fetch(`${API_URL}/notificaciones/leer-todas`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
      }

      setNotificaciones(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      );
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  // 🔔 ELIMINAR NOTIFICACIÓN (CONSUMIENDO API)
  const eliminarNotificacion = async (id: string) => {
    try {
      if (id.toString().startsWith('bd_')) {
        const idBD = id.toString().replace('bd_', '');
        const token = localStorage.getItem('token');
        
        await fetch(`${API_URL}/notificaciones/${idBD}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
      }

      setNotificaciones(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const eliminarTodasNotificaciones = () => {
    setNotificaciones([]);
  };

  const obtenerListas = async () => {
    if (!usuario) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(apiListarReportes, {
        method: "GET",
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      const data = await res.json();

      if (data.datos && Array.isArray(data.datos)) {
        const filtrados: Reporte[] = data.datos
          .filter(
            (r: any) =>
              Number(r.idEmpresa ?? r.id_empresa) ===
              Number(usuario.id_empresa)
          )
          .map((r: any) => ({
            id_reporte: r.idReporte ?? r.id_reporte,
            id_usuario: r.idUsuario ?? r.id_usuario,
            nombre_usuario: r.nombreUsuario ?? r.nombre_usuario,
            cargo: r.cargo,
            cedula: r.cedula,
            fecha: r.fecha,
            lugar: r.lugar,
            descripcion: r.descripcion,
            imagen: r.imagen ?? "",
            archivos: r.archivos ?? "",
            estado: r.estado,
            id_empresa: r.idEmpresa ?? r.id_empresa,
          }));

        setListas(filtrados);
      } else {
        setListas([]);
      }
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      setListas([]);
    }
  };

  useEffect(() => {
    if (usuario) obtenerListas();
  }, [usuario]);

  const abrirDetalle = (item: Reporte) => {
    navigate("/nav/detalleReportes", { state: item });
  };

  const formatearFecha = (fechaIso: string | null) => {
    if (!fechaIso) return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearFechaNotificacion = (fecha: Date) => {
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffSeg < 60) return `Hace ${diffSeg} segundos`;
    if (diffMin < 60) return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    if (diffHoras < 24) return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
    if (diffDias < 7) return `Hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;
    
    return fecha.toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const descargarPDF = (reporte: Reporte) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Incidente - SST", 20, 20);
    doc.setFontSize(12);
    doc.text(`Usuario: ${reporte.nombre_usuario}`, 20, 40);
    doc.text(`Cédula: ${reporte.cedula}`, 20, 50);
    doc.text(`Cargo: ${reporte.cargo}`, 20, 60);
    doc.text(`Fecha: ${formatearFecha(reporte.fecha)}`, 20, 70);
    doc.text(`Lugar: ${reporte.lugar}`, 20, 80);
    doc.text(`Descripción: ${reporte.descripcion}`, 20, 90);
    doc.text(`Estado: ${reporte.estado}`, 20, 100);
    doc.save(`reporte_${reporte.id_reporte}.pdf`);
  };

  const reportesFiltrados = listas.filter(
    (item) =>
      (estadoFiltro === "Todos" || item.estado === estadoFiltro) &&
      `${item.nombre_usuario} ${item.cargo} ${item.fecha}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(reportesFiltrados.length / reportesPorPagina);
  const indiceInicial = (paginaActual - 1) * reportesPorPagina;
  const indiceFinal = indiceInicial + reportesPorPagina;
  const reportesPaginados = reportesFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Revisado":
        return "bg-blue-100 text-blue-800";
      case "Finalizado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">


      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaHardHat className="text-blue-700" /> 
            Reportes
          </h1>

          {/* 🔔 BADGE SG-SST */}
          {esSGSST && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl border-2 border-blue-300 flex items-center gap-2">
              <FaShieldAlt /> 
              <span className="font-bold">SG-SST</span>
            </div>
          )}

          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{reportesFiltrados.length}</span> reportes
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {/* 🔔 BOTÓN DE NOTIFICACIONES (SOLO PARA SG-SST) */}
          {esSGSST && (
            <div className="relative" ref={panelRef}>
              <button
                onClick={() => {
                  setMostrarPanelNotificaciones(!mostrarPanelNotificaciones);
                  if (contadorNoLeidas > 0) {
                    marcarTodasComoLeidas();
                  }
                }}
                className="relative p-3 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                title="Notificaciones SG-SST"
              >
                <FaBell className={`text-blue-700 text-xl ${contadorNoLeidas > 0 ? 'bell-ring' : ''}`} />
                
                {contadorNoLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                    {contadorNoLeidas}
                  </span>
                )}
              </button>

              {/* PANEL DE NOTIFICACIONES */}
              {mostrarPanelNotificaciones && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 fade-in max-h-[500px] overflow-hidden flex flex-col">
                  {/* ENCABEZADO */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <FaShieldAlt /> Notificaciones SG-SST
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={marcarTodasComoLeidas}
                          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition"
                        >
                          Marcar todas
                        </button>
                        <button
                          onClick={eliminarTodasNotificaciones}
                          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition"
                        >
                          Limpiar
                        </button>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">
                      {notificaciones.length === 0 
                        ? "No hay notificaciones" 
                        : `${notificaciones.length} notificaciones`}
                    </p>
                  </div>

                  {/* LISTA */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {notificaciones.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FaBell className="text-3xl mx-auto mb-3 text-gray-300" />
                        <p>No hay notificaciones</p>
                      </div>
                    ) : (
                      notificaciones.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => notif.id_reporte && abrirReporteDesdeNotificacion(notif)}
                          className={`p-3 rounded-lg mb-2 border-l-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
                            notif.leida 
                              ? 'border-gray-300 bg-gray-50' 
                              : 'border-blue-600 bg-blue-50 hover:bg-green-100'
                          } ${notif.id_reporte ? 'hover:border-green-700' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              {/* Mostrar icono si tiene reporte */}
                              {notif.id_reporte && (
                                <div className="flex items-center gap-1 mb-1">
                                  <FaHardHat className="text-blue-500 text-xs" />
                                  <span className="text-xs font-medium text-blue-600">
                                    Reporte #{notif.id_reporte}
                                  </span>
                                </div>
                              )}
                              
                              <p className={`font-medium ${notif.leida ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notif.mensaje}
                              </p>
                              
                              {notif.lugar && (
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                  <FaMapMarkerAlt className="text-yellow-500" /> 
                                  {notif.lugar}
                                </p>
                              )}
                              
                              {notif.usuario && (
                                <p className="text-xs text-gray-500 mt-1">
                                  👤 {notif.usuario}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-500 mt-1">
                                {formatearFechaNotificacion(notif.fecha)}
                              </p>
                            </div>
                            
                            <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                              {!notif.leida && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    marcarComoLeida(notif.id);
                                  }}
                                  className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
                                  title="Marcar como leída"
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  eliminarNotificacion(notif.id);
                                }}
                                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                                title="Eliminar"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* PIE */}
                  {notificaciones.length > 0 && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                      <p className="text-xs text-gray-600 text-center">
                        {contadorNoLeidas > 0 
                          ? `${contadorNoLeidas} no leídas`
                          : 'Todas leídas'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BOTÓN NUEVO REPORTE */}
          <button
            onClick={() => navigate("/nav/crearReportes")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Nuevo Reporte
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR Y FILTROS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar reporte..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
            
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LISTA DE REPORTES */}
        {reportesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {listas.length === 0 ? "No hay reportes registrados" : "No se encontraron reportes"}
            </h3>
            <p className="text-gray-500">
              {listas.length === 0 
                ? "Crea el primer reporte usando el botón 'Nuevo Reporte'" 
                : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE REPORTES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportesPaginados.map((item) => (
                <div
                  key={item.id_reporte}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {item.nombre_usuario}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.cargo}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                          item.estado
                        )}`}
                      >
                        {item.estado}
                      </span>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      {formatearFecha(item.fecha)}
                    </p>

                    {/* LUGAR */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="text-yellow-500" />
                      <span className="text-sm font-medium">{item.lugar}</span>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <p className="text-gray-700 mb-6 line-clamp-3">
                      {item.descripcion}
                    </p>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm"
                      >
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => descargarPDF(item)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg flex items-center gap-2 font-semibold text-sm"
                      >
                        <FaFilePdf /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {[...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => cambiarPagina(i + 1)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        paginaActual === i + 1
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListarReportes;