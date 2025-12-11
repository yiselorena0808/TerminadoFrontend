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

const API_URL = "https://unreproaching-rancorously-evelina.ngrok-free.dev";

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
  // notificaciones en forma que usa la UI del navbar (titulo, descripcion, tiempo, leida, id)
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const ocultarSidebar = location.pathname === "/" || location.pathname === "/registro";
  if (ocultarSidebar) return null;

  // 🔹 Cargar usuario y notificaciones
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) return;

    const user: Usuario = JSON.parse(usuarioGuardado);
    setUsuario(user);

    if (!SGVA_ROLES.includes(user.cargo)) return;

    cargarNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Obtener notificaciones (mapea a la forma que usa el dropdown)
  const cargarNotificaciones = async (tipo?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      let url = `${API_URL}/notificaciones?soloNoLeidas=false`;
      if (tipo && tipo !== "todos") url += `&tipo=${encodeURIComponent(tipo)}`;

      const res = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const raw = data?.notificaciones || [];

      // Mapear a la estructura usada por el dropdown (titulo, descripcion, tiempo, leida, id)
      const mapped = raw.map((n: any) => ({
        id: n.id,
        titulo: n.mensaje || n.titulo || "Notificación",
        descripcion: n.reporte?.descripcion || n.descripcion || "",
        tiempo: n.fecha ? new Date(n.fecha).toLocaleString() : "",
        leida: !!n.leida,
        tipo: n.tipo || "",
        raw: n,
      }));

      setNotificaciones(mapped);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  };

  // 🔹 Marcar notificación como leída
  const marcarComoLeida = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_URL}/notificaciones/${id}/leer`, {
        method: "PUT",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  const irANotificaciones = () => {
    setShowNotifications(false);
    navigate("/nav/GestionNotificaciones");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;
  const isSgva = usuario && SGVA_ROLES.includes(usuario.cargo);

  // 🔹 Menús por rol
  const superAdminMenu = [
    { icon: <AiOutlineSetting />, label: "Administración de Empresas", path: "/nav/admEmpresas" },
    { icon: <AiOutlineSetting />, label: "Administración de Reportes", path: "/nav/ListaDeReportesGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Evidencias", path: "/nav/ListaDeActividadesGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Listas de Chequeo", path: "/nav/ListaChequeoGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Gestiones Epp", path: "/nav/ListaDeGestionEppGeneral"},
    { icon: <AiOutlineSetting />, label: "Administración de Eventos", path: "/nav/ListaDeEventosGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Cargos", path: "/nav/ListaCargos" },
    { icon: <AiOutlineSetting />, label: "Administración de EPP", path: "/nav/ListaProductos" }
  ];

  const adminMenu = [
    { icon: <AiOutlineUser />, label: "Administración de Usuarios", path: "/nav/Admusuarios" },
    { icon: <AiOutlineSetting />, label: "Administración de Áreas", path: "/nav/admAreas" },
  ];

  const sgvaMenu = [
    { icon: <AiOutlineHome />, label: "Inicio", path: "/nav/inicio" },
    { icon: <AiOutlineBarChart />, label: "Reportes", path: "/nav/reportesC" },
    { icon: <AiOutlineBook />, label: "Actividades Lúdicas", path: "/nav/actLudica" },
    { icon: <AiOutlineCheckSquare />, label: "Listas de Chequeo", path: "/nav/ListasChequeo" },
    { icon: <AiOutlineTool />, label: "Gestión EPP", path: "/nav/gestionEpp" },
    { icon: <AiOutlineSetting />, label: "Adicionales", path: "/nav/Admadicionales" },
    { icon: <AiOutlineProfile />, label: "Eventos", path: "/nav/blog" },
  ];

  const userMenu = [
    { icon: <AiOutlineHome />, label: "Inicio", path: "/nav/inicioUser" },
    { icon: <AiOutlineCheckSquare />, label: "Mis Chequeos", path: "/nav/lectorUserChe" },
    { icon: <AiOutlineBarChart />, label: "Mis Reportes", path: "/nav/LectorUserRepo" },
    { icon: <AiOutlineBook />, label: "Mis Actividades", path: "/nav/LectorUserAct" },
    { icon: <AiOutlineTool />, label: "Mi Gestión EPP", path: "/nav/lectorgestionepp" },
    { icon: <AiOutlineProfile />, label: "Eventos", path: "/nav/EventosUser" },
  ];

  const isSuperAdmin = usuario && SUPER_ADMIN_ROLES.includes(usuario.cargo);
  const isAdmin = usuario && ADMIN_ROLES.includes(usuario.cargo);

  const menuItems = isSuperAdmin
    ? superAdminMenu
    : isSgva
    ? sgvaMenu
    : isAdmin
    ? adminMenu
    : userMenu;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* SIDEBAR */}
      <div
        className={`${isCollapsed ? "w-20" : "w-72"} h-full flex flex-col text-gray-800 bg-white border-r border-blue-100 shadow-lg transition-all duration-300`}
      >
        {/* LOGO */}
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

        {/* PERFIL */}
        {!isCollapsed && usuario && (
          <div className="flex flex-col items-center py-6 border-b border-blue-100 text-center">
            <img
              src={usuario.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Perfil"
              className="w-20 h-20 rounded-full border-4 border-blue-300 shadow-md object-cover cursor-pointer"
              onClick={() => navigate("/nav/perfil")}
            />
            <h2 className="mt-3 font-semibold text-blue-900">{usuario.nombre}</h2>
            <p className="text-sm text-gray-500">{usuario.cargo}</p>
          </div>
        )}

        {/* MENÚ */}
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

        {/* FOOTER */}
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

      {/* CONTENIDO PRINCIPAL + HEADER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-white/90 border-b border-blue-200 shadow-sm px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {
                {
                  "/nav/inicio": "Inicio",
                  "/nav/reportesC": "Reportes",
                  "/nav/actLudica": "Actividades Lúdicas",
                  "/nav/ListasChequeo": "Listas de Chequeo",
                  "/nav/gestionEpp": "Gestión EPP",
                  "/nav/blog": "Eventos",
                  "/nav/perfil": "Perfil",
                }[location.pathname] || "Dashboard"
              }
            </h1>

            {/* NOTIFICACIONES */}
            <div className="flex items-center gap-6">
              {isSgva && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      // refrescar al abrir
                      if (!showNotifications) cargarNotificaciones();
                    }}
                    className="relative p-2 hover:bg-blue-50 rounded-full transition"
                  >
                    <AiOutlineBell className="text-2xl text-gray-600" />
                    {notificacionesNoLeidas > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {notificacionesNoLeidas}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
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
                                !notif.leida ? "bg-blue-50" : ""
                              }`}
                              onClick={() => marcarComoLeida(notif.id)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className={`font-medium ${!notif.leida ? "text-gray-900" : "text-gray-700"}`}>
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

        {/* CONTENIDO */}
        <div
          className="flex-1 overflow-auto"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.95)), url('https://img.freepik.com/fotos-premium/trabajador-textura-arcilla.jpg')",
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
