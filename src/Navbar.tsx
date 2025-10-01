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
} from "react-icons/ai";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

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

const ADMIN_ROLES = ["SGVA", "Ingeniero", "Inspector de interventoria","administrador","Administrador"];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const ocultarSidebar =
    location.pathname === "/" || location.pathname === "/Registro";
  if (ocultarSidebar) return null;

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const user: Usuario = JSON.parse(usuarioGuardado);
      setUsuario(user);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Menú para administradores
  const adminMenu = [
    { icon: <AiOutlineHome className="text-4xl" />, label: "Inicio", path: "/nav/inicio" },
    { icon: <AiOutlineBarChart className="text-4xl" />, label: "Reportes", path: "/nav/reportesC" },
    { icon: <AiOutlineBook className="text-4xl" />, label: "Actividades Lúdicas", path: "/nav/actLudica" },
    { icon: <AiOutlineCheckSquare className="text-4xl" />, label: "Listas de Chequeo", path: "/nav/ListasChequeo" },
    { icon: <AiOutlineTool className="text-4xl" />, label: "Gestión EPP", path: "/nav/gestionEpp" },
    { icon: <AiOutlineUser className="text-4xl" />, label: "Eventos", path: "/nav/blog" },
    { icon: <AiOutlineUser className="text-4xl" />, label: "Lista de Usuarios", path: "/nav/usuarios" },
    { icon: <AiOutlineSetting className="text-4xl" />, label: "Adicionales", path: "/nav/adicionales" },
  ];

  // Menú para usuarios normales
  const userMenu = [
    { icon: <AiOutlineHome className="text-4xl" />, label: "Inicio", path: "/nav/inicioUser" },
    { icon: <AiOutlineCheckSquare className="text-4xl" />, label: "Mis Chequeos", path: "/nav/lectorUserChe" },
    { icon: <AiOutlineBarChart className="text-4xl" />, label: "Mis Reportes", path: "/nav/LectorUserRepo" },
    { icon: <AiOutlineBook className="text-4xl" />, label: "Mis Actividades Lúdicas", path: "/nav/LectorUserAct" },
    { icon: <AiOutlineTool className="text-4xl" />, label: "Mis Gestión EPP", path: "/nav/gestionEpp" },
    { icon: <AiOutlineUser className="text-4xl" />, label: "Eventos", path: "/nav/EventosUser" },
    { icon: <AiOutlineSetting className="text-4xl" />, label: "Perfil", path: "/nav/perfil" },
  ];

  const isAdmin = usuario && ADMIN_ROLES.includes(usuario.cargo);
  const menuItems = isAdmin ? adminMenu : userMenu;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-22" : "w-72"
        } h-full text-white flex flex-col transition-all duration-300 border-r border-gray-700 shadow-xl backdrop-blur-lg`}
        style={{
          backgroundImage:
            "linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.85) 100%), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Botón menú */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!isCollapsed && (
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Panel de Control
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors"
          >
            <AiOutlineMenu className="text-2xl" />
          </button>
        </div>

        {/* Perfil */}
        {!isCollapsed && usuario && (
          <div className="flex flex-col items-center py-6 border-b border-gray-700">
            <div className="relative">
              <img
                src={
                  usuario.fotoPerfil ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Perfil"
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform"
                onClick={() => navigate("/nav/perfil")}
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></span>
            </div>
            <h2 className="mt-3 font-semibold text-lg">
              {usuario.nombre} {usuario.apellido}
            </h2>
            <p className="text-gray-400 text-sm">{usuario.cargo}</p>
          </div>
        )}

        {/* Menú */}
        <nav
          className={`flex-1 mt-4 overflow-y-auto ${
            isCollapsed ? "flex flex-col items-center justify-evenly" : ""
          }`}
        >
          <ul className={`${isCollapsed ? "space-y-0" : "space-y-1 w-full"}`}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full ${
                    isCollapsed ? "justify-center" : "gap-2 px-3"
                  } py-3 text-sm text-black transition-all duration-200 border-l-4 border-transparent hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg`}
                >
                  <span className="text-blue-300 group-hover:text-blue-400 transition-colors">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="group-hover:text-blue-300 transition-colors">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg w-full font-bold text-white"
            >
              🔒 Cerrar sesión
            </button>
            <p className="mt-2">© 2025 SST</p>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div
        className="flex-1 overflow-auto"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.85)), url('https://img.freepik.com/fotos-premium/trabajador-textura-oscura-fondo-concepto-sst-seguridad-salud-trabajo_488220-50664.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
