import React, { useState, useEffect } from 'react';
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineCheckCircle, AiOutlineBell } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from 'react-router-dom';

interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  leida: boolean;
  tipo: 'chequeo' | 'epp' | 'actividad' | 'reporte';
  usuario: string;
  area: string;
}

const GestionNotificaciones: React.FC = () => {
  const location = useLocation();
  const fechaFiltroInicial = location.state?.fechaFiltro || null;

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    {
      id: 1,
      titulo: "Lista de chequeo pendiente",
      descripcion: "Área de producción - Turno mañana",
      fecha: new Date(),
      leida: false,
      tipo: 'chequeo',
      usuario: "Juan Pérez",
      area: "Producción"
    },
    {
      id: 2,
      titulo: "EPP por renovar",
      descripcion: "Casco de seguridad vence esta semana",
      fecha: new Date(new Date().setDate(new Date().getDate() - 1)),
      leida: true,
      tipo: 'epp',
      usuario: "María García",
      area: "Almacén"
    },
    {
      id: 3,
      titulo: "Nueva actividad asignada",
      descripcion: "Capacitación SST - Primeros auxilios",
      fecha: new Date(new Date().setDate(new Date().getDate() - 2)),
      leida: false,
      tipo: 'actividad',
      usuario: "Carlos Rodríguez",
      area: "Administración"
    },
    {
      id: 4,
      titulo: "Reporte mensual generado",
      descripcion: "Reporte de incidentes enero 2024",
      fecha: new Date(2024, 0, 10),
      leida: true,
      tipo: 'reporte',
      usuario: "Ana López",
      area: "Calidad"
    },
    {
      id: 5,
      titulo: "Inspección programada",
      descripcion: "Inspección general de áreas de trabajo",
      fecha: new Date(2024, 0, 8),
      leida: false,
      tipo: 'chequeo',
      usuario: "Pedro Sánchez",
      area: "Mantenimiento"
    },
    {
      id: 6,
      titulo: "Entrega de EPP completada",
      descripcion: "Guantes de seguridad entregados",
      fecha: new Date(2024, 0, 5),
      leida: true,
      tipo: 'epp',
      usuario: "Laura Martínez",
      area: "Logística"
    },
    {
      id: 7,
      titulo: "Actividad lúdica realizada",
      descripcion: "Simulacro de evacuación exitoso",
      fecha: new Date(2024, 0, 3),
      leida: false,
      tipo: 'actividad',
      usuario: "Roberto Gómez",
      area: "Operaciones"
    },
    {
      id: 8,
      titulo: "Reporte semanal generado",
      descripcion: "Reporte de seguridad semana 1",
      fecha: new Date(2024, 0, 2),
      leida: true,
      tipo: 'reporte',
      usuario: "Sofía Hernández",
      area: "Seguridad"
    },
  ]);

  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(fechaFiltroInicial);
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');

  useEffect(() => {
    if (fechaFiltroInicial) {
      setFechaFiltro(new Date(fechaFiltroInicial));
    }
  }, [fechaFiltroInicial]);

  const marcarComoLeida = (id: number) => {
    setNotificaciones(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones(prev =>
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const filtrarNotificaciones = () => {
    return notificaciones.filter(notif => {
      // Filtro por fecha
      if (fechaFiltro) {
        const notifDate = new Date(notif.fecha);
        const filterDate = new Date(fechaFiltro);
        if (notifDate.toDateString() !== filterDate.toDateString()) return false;
      }
      
      // Filtro por tipo
      if (tipoFiltro !== 'todos' && notif.tipo !== tipoFiltro) return false;
      
      // Filtro por estado
      if (estadoFiltro !== 'todos') {
        if (estadoFiltro === 'leidas' && !notif.leida) return false;
        if (estadoFiltro === 'no-leidas' && notif.leida) return false;
      }
      
      return true;
    });
  };

  const notificacionesFiltradas = filtrarNotificaciones();
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  const getIconoTipo = (tipo: string) => {
    switch(tipo) {
      case 'chequeo': return '🔍';
      case 'epp': return '🛡️';
      case 'actividad': return '📚';
      case 'reporte': return '📊';
      default: return '📌';
    }
  };

  const getColorTipo = (tipo: string) => {
    switch(tipo) {
      case 'chequeo': return 'bg-yellow-100 text-yellow-800';
      case 'epp': return 'bg-red-100 text-red-800';
      case 'actividad': return 'bg-blue-100 text-blue-800';
      case 'reporte': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const limpiarFiltros = () => {
    setFechaFiltro(null);
    setTipoFiltro('todos');
    setEstadoFiltro('todos');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <AiOutlineBell className="text-blue-600" />
            Gestión de Notificaciones
          </h1>
          <p className="text-gray-600 mt-2">
            Visualiza y gestiona notificaciones por calendario
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-700 font-semibold">
              {notificacionesNoLeidas} no leídas
            </span>
          </div>
          <button
            onClick={marcarTodasComoLeidas}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <AiOutlineCheckCircle />
            Marcar todas como leídas
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <AiOutlineFilter />
          Filtros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AiOutlineCalendar className="inline mr-2" />
              Fecha
            </label>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={fechaFiltro}
                onChange={(date) => setFechaFiltro(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar fecha"
                className="w-full p-2 border border-gray-300 rounded-lg"
                isClearable
              />
              {fechaFiltro && (
                <button
                  onClick={() => setFechaFiltro(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="chequeo">Chequeos</option>
              <option value="epp">EPP</option>
              <option value="actividad">Actividades</option>
              <option value="reporte">Reportes</option>
            </select>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="leidas">Leídas</option>
              <option value="no-leidas">No leídas</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:border-gray-400"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de notificaciones */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Notificaciones</h2>
            <span className="text-sm text-gray-600">
              {notificacionesFiltradas.length} resultados
              {fechaFiltro && ` - ${fechaFiltro.toLocaleDateString('es-ES')}`}
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notificacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <AiOutlineBell className="text-3xl mx-auto mb-2 text-gray-300" />
                    <p>No hay notificaciones con los filtros seleccionados</p>
                  </td>
                </tr>
              ) : (
                notificacionesFiltradas.map((notif) => (
                  <tr key={notif.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <AiOutlineCalendar className="text-gray-400" />
                        <span className="text-sm">{notif.fecha.toLocaleDateString('es-ES')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getIconoTipo(notif.tipo)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorTipo(notif.tipo)}`}>
                          {notif.tipo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{notif.titulo}</div>
                        <div className="text-sm text-gray-600 mt-1">{notif.descripcion}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{notif.usuario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{notif.area}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notif.leida 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {notif.leida ? 'Leída' : 'No leída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!notif.leida && (
                        <button
                          onClick={() => marcarComoLeida(notif.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Resumen por tipo</h3>
          <div className="space-y-3">
            {['chequeo', 'epp', 'actividad', 'reporte'].map((tipo) => (
              <div key={tipo} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{tipo}</span>
                <span className="font-bold">
                  {notificaciones.filter(n => n.tipo === tipo).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total notificaciones</span>
              <span className="font-bold text-lg">{notificaciones.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">No leídas</span>
              <span className="font-bold text-blue-600">{notificacionesNoLeidas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leídas</span>
              <span className="font-bold text-green-600">{notificaciones.length - notificacionesNoLeidas}</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Distribución por fecha</h3>
          <div className="space-y-2">
            {notificaciones
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .slice(0, 5)
              .map((notif) => (
                <div key={notif.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate">{notif.titulo}</span>
                  <span className="text-gray-500">{notif.fecha.toLocaleDateString('es-ES')}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionNotificaciones;