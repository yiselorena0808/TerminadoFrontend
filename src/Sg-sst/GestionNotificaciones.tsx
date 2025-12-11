// COMPONENTE COMPLETO
import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineBell } from "react-icons/ai";
import DatePicker from "react-datepicker"; // ← AGREGADO
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";

const API_URL = "https://unreproaching-rancorously-evelina.ngrok-free.dev";

interface Notificacion {
  id: number;
  mensaje: string;
  leida: boolean;
  fecha: string;
  tipo: string;
  id_reporte?: number;
  reporte?: any;
}

const MAPEO_TIPOS: Record<string, string | null> = {
  todos: null,
  reporte: "reporte",
  epp: "ppe_alert",
  chequeo: "chequeo",
  actividad: "actividad",
};

// ----------------- PARSEO DE MENSAJE EPP -----------------
const parsearMensajeEPP = (mensaje: string) => {
  try {
    const usuario = mensaje.split("para ")[1]?.split(":")[0]?.trim() || "";
    const equipos = mensaje.split(":")[1]?.split("(contexto")[0]?.trim();
    const contexto = mensaje
      .split("(contexto:")[1]
      ?.replace(")", "")
      ?.trim();

    return { usuario, equipos, contexto };
  } catch {
    return { usuario: "", equipos: "", contexto: "" };
  }
};

const GestionNotificaciones: React.FC = () => {
  const location = useLocation();
  const fechaFiltroInicial = location.state?.fechaFiltro || null;

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(fechaFiltroInicial);
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [cargando, setCargando] = useState<boolean>(false);

  const [notifSeleccionada, setNotifSeleccionada] =
    useState<Notificacion | null>(null);

  // ----------------- CARGA -----------------
  const cargarNotificaciones = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const tipoBackend = MAPEO_TIPOS[tipoFiltro];

      const params = new URLSearchParams();
      params.append("soloNoLeidas", "false");

      if (tipoBackend) params.append("tipo", tipoBackend);

      // Filtro por fecha (solo UNA)
      if (fechaFiltro) {
        const f = new Date(fechaFiltro);
        const fecha = f.toISOString().split("T")[0];
        params.append("fecha_inicio", fecha);
        params.append("fecha_fin", fecha);
      }

      const res = await fetch(
        `${API_URL}/notificaciones?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();
      setNotificaciones(data.notificaciones || []);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [tipoFiltro, fechaFiltro]);

  // ----------------- FILTROS ADICIONALES -----------------
  const notificacionesFiltradas = notificaciones.filter((notif) => {
    if (estadoFiltro === "leidas" && !notif.leida) return false;
    if (estadoFiltro === "no-leidas" && notif.leida) return false;
    return true;
  });

  // ----------------- MARCAR LEÍDA -----------------
  const marcarComoLeida = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_URL}/notificaciones/${id}/leer`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );

      setNotifSeleccionada(null);
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  // ----------------- TABLAS SEPARADAS -----------------
  const notificacionesEPP = notificacionesFiltradas.filter(
    (n) => n.tipo === "ppe_alert"
  );

  const notificacionesReporte = notificacionesFiltradas.filter(
    (n) => n.tipo === "reporte"
  );

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* ------------ HEADER ------------ */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <AiOutlineBell className="text-blue-600" />
            Gestión de Notificaciones
          </h1>
          <p className="text-gray-600 mt-2">Notificaciones separadas por tipo</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-700 font-semibold">
              {notificacionesNoLeidas} no leídas
            </span>
          </div>

          <button
            onClick={cargarNotificaciones}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <AiOutlineCheckCircle /> Actualizar
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTROS CON CALENDARIO */}
      {/* ========================================================= */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8 flex flex-wrap gap-6 items-end">

        {/* FILTRO FECHA */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Filtrar por fecha
          </label>

          <DatePicker
            selected={fechaFiltro}
            onChange={(date) => setFechaFiltro(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona fecha"
            className="border px-3 py-2 rounded-lg shadow-sm w-48"
          />
        </div>

        {/* FILTRO TIPO */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Tipo
          </label>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm w-48"
          >
            <option value="todos">Todos</option>
            <option value="epp">PPE</option>
            <option value="reporte">Reportes</option>
            <option value="chequeo">Chequeos</option>
            <option value="actividad">Actividad</option>
          </select>
        </div>

        {/* FILTRO ESTADO */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Estado
          </label>
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm w-48"
          >
            <option value="todos">Todos</option>
            <option value="no-leidas">No leídas</option>
            <option value="leidas">Leídas</option>
          </select>
        </div>

        {fechaFiltro && (
          <button
            onClick={() => setFechaFiltro(null)}
            className="px-3 py-2 bg-red-600 text-white rounded-lg"
          >
            Limpiar fecha
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TABLA EPP */}
      {/* ========================================================= */}
      <h2 className="text-xl font-bold mt-10 mb-3">Alertas PPE</h2>

      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Usuario</th>
            <th className="px-4 py-3">Equipos Faltantes</th>
            <th className="px-4 py-3">Contexto</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notificacionesEPP.map((n) => {
            const { usuario, equipos, contexto } = parsearMensajeEPP(n.mensaje);

            return (
              <tr key={n.id} className={n.leida ? "bg-white" : "bg-blue-50"}>
                <td className="px-4 py-3">{usuario}</td>
                <td className="px-4 py-3">{equipos}</td>
                <td className="px-4 py-3">{contexto}</td>

                <td className="px-4 py-3 text-center flex justify-center gap-3">
                  <button
                    onClick={() => setNotifSeleccionada(n)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Ver
                  </button>

                  {!n.leida && (
                    <button
                      onClick={() => marcarComoLeida(n.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Marcar Leída
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* TABLA REPORTES */}
      {/* ========================================================= */}
      <h2 className="text-xl font-bold mt-10 mb-3">Notificaciones de Reportes</h2>

      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Usuario</th>
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {notificacionesReporte.map((n) => (
            <tr key={n.id} className={n.leida ? "bg-white" : "bg-blue-50"}>
              <td className="px-4 py-3">{n.reporte?.nombre_usuario || "—"}</td>
              <td className="px-4 py-3">{n.reporte?.descripcion || n.mensaje}</td>
              <td className="px-4 py-3">{n.fecha}</td>

              <td className="px-4 py-3 text-center flex justify-center gap-3">
                <button
                  onClick={() => setNotifSeleccionada(n)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Ver
                </button>

                {!n.leida && (
                  <button
                    onClick={() => marcarComoLeida(n.id)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Marcar Leída
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* MODAL DETALLE */}
      {/* ========================================================= */}
      {notifSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-3">Detalle de Notificación</h2>

            <p className="mb-2">
              <b>Mensaje:</b> {notifSeleccionada.mensaje}
            </p>

            <p className="mb-2">
              <b>Fecha:</b> {notifSeleccionada.fecha}
            </p>

            {notifSeleccionada.reporte && (
              <p className="mb-2">
                <b>Reporte:</b> {notifSeleccionada.reporte.descripcion}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              {!notifSeleccionada.leida && (
                <button
                  onClick={() => marcarComoLeida(notifSeleccionada.id)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg"
                >
                  Marcar Leída
                </button>
              )}

              <button
                onClick={() => setNotifSeleccionada(null)}
                className="bg-gray-500 text-white px-3 py-2 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionNotificaciones;
