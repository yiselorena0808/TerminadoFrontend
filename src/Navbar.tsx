import React, { useEffect, useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineBarChart,
  AiOutlineCheckSquare,
  AiOutlineBook,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineTool,
  AiOutlineSetting,
  AiOutlineProfile,
  AiOutlineBell,
} from "react-icons/ai";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import logo from "../src/assets/logosst.jpg";

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
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  fotoPerfil?: string;
  empresa?: Empresa;
  area?: Area;
}

const ADMIN_ROLES = ["administrador", "Administrador"];
const SGVA_ROLES = ["SG-SST", "sg-sst"];
const SUPER_ADMIN_ROLES = ["superadmin", "SuperAdmin"];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const ocultarSidebar = location.pathname === "/" || location.pathname === "/registro";
  if (ocultarSidebar) return null;

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const user: Usuario = JSON.parse(usuarioGuardado);
      setUsuario(user);
      
      // Solo cargar notificaciones para SG-SST
      if (SGVA_ROLES.includes(user.cargo)) {
        setNotificaciones([
          { id: 1, titulo: "Lista de chequeo pendiente", leida: false, tiempo: "10:30 AM", descripcion: "Área de producción" },
          { id: 2, titulo: "EPP por renovar", leida: true, tiempo: "Ayer", descripcion: "Casco de seguridad" },
          { id: 3, titulo: "Nueva actividad asignada", leida: false, tiempo: "Hoy", descripcion: "Capacitación SST" },
        ]);
      }
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const marcarComoLeida = (id: number) => {
    setNotificaciones(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const irANotificaciones = () => {
    setShowNotifications(false);
    navigate("/nav/GestionNotificaciones");
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;
  const isSgva = usuario && SGVA_ROLES.includes(usuario.cargo);

  const superAdminMenu = [
    { icon: <AiOutlineSetting />, label: "Administración de Empresas", path: "/nav/admEmpresas" },
    { icon: <AiOutlineSetting />, label: "Administración de Reportes", path: "/nav/ListaDeReportesGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Evidencias", path: "/nav/ListaDeActividadesGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Listas de Chequeo", path: "/nav/ListaChequeoGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Gestiones Epp", path: "/nav/ListaDeGestionEppGeneral"},
    { icon: <AiOutlineSetting />, label: "Administración de Eventos", path: "/nav/ListaDeEventosGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Cargos", path: "/nav/ListaCargos" },
    { icon: <AiOutlineSetting />, label: "Administración de Equipos de protección personal", path: "/nav/ListaProductos" }
  ];

  const adminMenu = [
    { icon: <AiOutlineUser />, label: "Administración de Usuarios", path: "/nav/Admusuarios" },
    { icon: <AiOutlineSetting />, label: "Administración de Áreas", path: "/nav/admAreas" }
  ];

  const sgvaMenu = [
    { icon: <AiOutlineHome />, label: "Inicio", path: "/nav/inicio" },
    { icon: <AiOutlineBarChart />, label: "Reportes", path: "/nav/reportesC" },
    { icon: <AiOutlineBook />, label: "Actividades Lúdicas", path: "/nav/actLudica" },
    { icon: <AiOutlineCheckSquare />, label: "Listas de Chequeo", path: "/nav/ListasChequeo" },
    { icon: <AiOutlineTool />, label: "Gestión EPP", path: "/nav/gestionEpp" },
    { icon: <AiOutlineSetting />, label: "Adicionales", path: "/nav/Admadicionales" },
    { icon: <AiOutlineProfile />, label: "Eventos", path: "/nav/blog" }
  ];

  const userMenu = [
    { icon: <AiOutlineHome />, label: "Inicio", path: "/nav/inicioUser" },
    { icon: <AiOutlineCheckSquare />, label: "Mis Chequeos", path: "/nav/lectorUserChe" },
    { icon: <AiOutlineBarChart />, label: "Mis Reportes", path: "/nav/LectorUserRepo" },
    { icon: <AiOutlineBook />, label: "Mis Actividades Lúdicas", path: "/nav/LectorUserAct" },
    { icon: <AiOutlineTool />, label: "Mi Gestión EPP", path: "/nav/lectorgestionepp" },
    { icon: <AiOutlineProfile />, label: "Eventos", path: "/nav/EventosUser" }
  ];

  const isSuperAdmin = usuario && SUPER_ADMIN_ROLES.includes(usuario.cargo);
  const isAdmin = usuario && ADMIN_ROLES.includes(usuario.cargo);
  const menuItems = isSuperAdmin ? superAdminMenu : isSgva ? sgvaMenu : isAdmin ? adminMenu : userMenu;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* 🔹 Sidebar */}
      <div
        className={`${isCollapsed ? "w-20" : "w-72"} h-full flex flex-col text-gray-800 bg-white border-r border-blue-100 shadow-lg transition-all duration-300`}
      >
        {/* 🔹 Logo y menú */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-100">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
              <h1 className="text-lg font-bold text-blue-800 tracking-wide">SST</h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition"
          >
            <AiOutlineMenu className="text-2xl" />
          </button>
        </div>

        {/* 🔹 Perfil */}
        {!isCollapsed && usuario && (
          <div className="flex flex-col items-center py-6 border-b border-blue-100 text-center">
            <img
              src={usuario.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Perfil"
              className="w-20 h-20 rounded-full border-4 border-blue-300 shadow-md object-cover"
              onClick={() => navigate("/nav/perfil")}
            />
            <h2 className="mt-3 font-semibold text-blue-900">{usuario.nombre}</h2>
            <p className="text-sm text-gray-500">{usuario.cargo}</p>
          </div>
        )}

        {/* 🔹 Menú */}
        <nav className="flex-1 mt-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all"
                >
                  <span className="text-xl text-blue-700">{item.icon}</span>
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 🔹 Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-blue-100">
            <button
              onClick={logout}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition"
            >
              Cerrar sesión
            </button>
            <p className="text-center mt-2 text-xs text-gray-500">© 2025 SST</p>
          </div>
        )}
      </div>

      {/* 🔹 Contenido principal con Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 🔹 Header con Notificaciones */}
        <div className="bg-white/90 border-b border-blue-200 shadow-sm px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Título de la página */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {location.pathname.includes("/nav/inicio") && "Inicio"}
                {location.pathname.includes("/nav/reportes") && "Reportes"}
                {location.pathname.includes("/nav/actLudica") && "Actividades Lúdicas"}
                {location.pathname.includes("/nav/ListasChequeo") && "Listas de Chequeo"}
                {location.pathname.includes("/nav/gestionEpp") && "Gestión EPP"}
                {location.pathname.includes("/nav/blog") && "Eventos"}
                {location.pathname.includes("/nav/perfil") && "Perfil"}
                {location.pathname.includes("/nav/gestion-notificaciones") && "Gestión de Notificaciones"}
                {!location.pathname.includes("/nav/") && "Dashboard"}
              </h1>
            </div>

            {/* 🔔 Notificaciones y Perfil (SOLO para SG-SST) */}
            <div className="flex items-center gap-6">
              {isSgva && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-blue-50 rounded-full transition"
                  >
                    <AiOutlineBell className="text-2xl text-gray-600" />
                    {notificacionesNoLeidas > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {notificacionesNoLeidas}
                      </span>
                    )}
                  </button>
                  
                  {/* 🔔 Dropdown de notificaciones */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      {/* Header del dropdown */}
                      <div className="p-4 border-b border-gray-200 bg-blue-50">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-800">Notificaciones</h3>
                          <button
                            onClick={irANotificaciones}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Ver todas
                          </button>
                        </div>
                      </div>
                      
                      {/* Lista de notificaciones */}
                      <div className="max-h-80 overflow-y-auto">
                        {notificaciones.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <AiOutlineBell className="text-3xl mx-auto mb-2 text-gray-300" />
                            <p>No hay notificaciones</p>
                          </div>
                        ) : (
                          notificaciones.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notif.leida ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => marcarComoLeida(notif.id)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className={`font-medium ${!notif.leida ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notif.titulo}
                                </h4>
                                {!notif.leida && (
                                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notif.descripcion}</p>
                              <p className="text-xs text-gray-400 mt-2">{notif.tiempo}</p>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Footer del dropdown */}
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={irANotificaciones}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          Ir a gestión de notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🔹 Contenido principal */}
        <div
          className="flex-1 overflow-auto"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.95)), url('https://img.freepik.com/fotos-premium/trabajador-textura-oscura-fondo-concepto-sst-seguridad-salud-trabajo_488220-50664.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;