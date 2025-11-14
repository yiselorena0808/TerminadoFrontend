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

  const ocultarSidebar = location.pathname === "/" || location.pathname === "/registro";
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

  const superAdminMenu = [
    { icon: <AiOutlineSetting />, label: "Administración de Empresas", path: "/nav/admEmpresas" },
    { icon: <AiOutlineSetting />, label: "Administración de Reportes", path: "/nav/ListaDeReportesGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Evidencias", path: "/nav/ListaDeActividadesGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Listas de Chequeo", path: "/nav/ListaChequeoGenerales" },
    { icon: <AiOutlineSetting />, label: "Administración de Gestiones Epp", path: "/nav/admEmpresas" },
    { icon: <AiOutlineSetting />, label: "Administración de EPP", path: "/nav/admEmpresas" },
    { icon: <AiOutlineSetting />, label: "Administración de Cargos", path: "/nav/admEmpresas" },
    { icon: <AiOutlineProfile />, label: "Perfil", path: "/nav/perfil" },
  ];

  const adminMenu = [
    { icon: <AiOutlineUser />, label: "Administración de Usuarios", path: "/nav/Admusuarios" },
    { icon: <AiOutlineSetting />, label: "Administración de Áreas", path: "/nav/admAreas" },
    { icon: <AiOutlineProfile />, label: "Perfil", path: "/nav/perfil" },
  ];

  const sgvaMenu = [
    { icon: <AiOutlineHome />, label: "Inicio", path: "/nav/inicio" },
    { icon: <AiOutlineBarChart />, label: "Reportes", path: "/nav/reportesC" },
    { icon: <AiOutlineBook />, label: "Actividades Lúdicas", path: "/nav/actLudica" },
    { icon: <AiOutlineCheckSquare />, label: "Listas de Chequeo", path: "/nav/ListasChequeo" },
    { icon: <AiOutlineTool />, label: "Gestión EPP", path: "/nav/gestionEpp" },
    { icon: <AiOutlineSetting />, label: "Adicionales", path: "/nav/Admadicionales" },
    { icon: <AiOutlineProfile />, label: "Eventos", path: "/nav/blog" },
    { icon: <AiOutlineUser />, label: "Perfil", path: "/nav/perfil" },
  ];

  const userMenu = [
    { icon: <AiOutlineHome />, label: "Inicio", path: "/nav/inicioUser" },
    { icon: <AiOutlineCheckSquare />, label: "Mis Chequeos", path: "/nav/lectorUserChe" },
    { icon: <AiOutlineBarChart />, label: "Mis Reportes", path: "/nav/LectorUserRepo" },
    { icon: <AiOutlineBook />, label: "Mis Actividades Lúdicas", path: "/nav/LectorUserAct" },
    { icon: <AiOutlineTool />, label: "Mi Gestión EPP", path: "/nav/lectorgestionepp" },
    { icon: <AiOutlineProfile />, label: "Eventos", path: "/nav/EventosUser" },
    { icon: <AiOutlineUser />, label: "Perfil", path: "/nav/perfil" },
  ];

  const isSuperAdmin = usuario && SUPER_ADMIN_ROLES.includes(usuario.cargo);
  const isSgva = usuario && SGVA_ROLES.includes(usuario.cargo);
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
  );
};

export default Navbar;
