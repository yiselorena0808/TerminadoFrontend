import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Login y Registro ---
import Login from "./Register/Login";
import Registro from "./Register/Registro";
import RegistroArea from "./Register/RegistroArea";
import RegistroEmpresa from "./Register/RegistroEmpresa";
import Correo from "./Register/Correo";
import ResetPasswordForm from "./Register/Recuperar";

// --- Navbar principal ---
import Navbar from "./Navbar";

// --- SGVA ---
import ListarGestiones from "./Sgva/ListasGestionEPP";
import ListasChequeoRecibidas from "./Sgva/ListasChequeo";
import ListasReportes from "./Sgva/ListasReportes";
import ListasActividadesLudicas from "./Sgva/ListasActLudicas";
import CrearActividadLudica from "./Sgva/CrearActLudica";
import DetalleReporte from "./Sgva/DetalleReporte";
import DetalleListaChequeo from "./Sgva/DetalleListaChqueo";
import DetalleActividad from "./Sgva/DetalleActLudica";
import DetalleGestionEPP from "./Sgva/DetalleGestionEpp";
import CrearListaChequeo from "./Sgva/CrearListaChequeo";
import CrearReporte from "./Sgva/CrearReporte";
import DashboardReportes from "./Sgva/DashboardReportes";
import CrearGestionEpp from "./Sgva/CrearGestionEpp";
import CrearEventos from "./Sgva/Eventos";
import ListaEventos from "./Sgva/ListaEventos";
import DashboardPage from "./Sgva/Adicionales";
import ProductosPage from "./Sgva/CrearProducto";

// --- Admin ---
import AdmUsuarios from "./Admin/ListasUsuarios";
import CargosPage from "./Admin/CrearCargo";
import RegistrarUsuario from "./Admin/CrearUsuario";
import AdmAreas from "./Admin/ListarAreas";

// --- User ---
import InicioUser from "./User/InicioUser";
import NavbarUser from "./User/NavUser";
import LectorChequeo from "./User/LectorListasChequeoUser";
import CrearListChequeo from "./User/CreaListChequeo";
import LectorListaReportes from "./User/LectorListasReporteUser";
import CrearListReporte from "./User/CrearListRepo";
import MiDetalleListaChequeo from "./User/DetalleListChe";
import MiDetalleReporte from "./User/DetalleListRepo";
import LectorListasActividadesLudicas from "./User/LectorListAct";
import UserActividadLudica from "./User/CreaActUser";
import MiDetalleActividadLudica from "./User/DetalleActUser";
import ListaEventosEmpresa from "./User/ListaEventosEmpresa";
import MiEvento from "./User/CreaEvento";
import DetalleGestionEPPUser from "./User/DetalleGestion";
import CrearGestionEppUser from "./User/GestionEppUser";

// --- Perfil ---
import Perfil from "./perfil";
import SuperAdminDashboard from "./Super Admin/Empresas";
import LectorMisGestiones from "./User/LectorListasGestionUser";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN / REGISTRO */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registroArea" element={<RegistroArea />} />
        <Route path="/registroEmpresa" element={<RegistroEmpresa />} />
        <Route path="/forgot" element={<Correo />} />
        <Route path="/reset" element={<ResetPasswordForm />} />

        {/* PANEL PRINCIPAL con Navbar */}
        <Route path="/nav" element={<Navbar />}>
          {/* --- SGVA --- */}
          <Route path="inicio" element={<DashboardReportes />} />
          <Route path="gestionEpp" element={<ListarGestiones />} />
          <Route path="detalleGestionEpp" element={<DetalleGestionEPP />} />
          <Route path="creargestionEpp" element={<CrearGestionEpp />} />
          <Route path="blog" element={<ListaEventos />} />
          <Route path="crearBlog" element={<CrearEventos />} />
          <Route path="ListasChequeo" element={<ListasChequeoRecibidas />} />
          <Route path="detalleListasChequeo" element={<DetalleListaChequeo />} />
          <Route path="crearListasChequeo" element={<CrearListaChequeo />} />
          <Route path="reportesC" element={<ListasReportes />} />
          <Route path="detalleReportes" element={<DetalleReporte />} />
          <Route path="crearReportes" element={<CrearReporte />} />
          <Route path="actLudica" element={<ListasActividadesLudicas />} />
          <Route path="detalleActLudica" element={<DetalleActividad />} />
          <Route path="crearActLudica" element={<CrearActividadLudica />} />
          <Route path="productos" element={<ProductosPage />} />

          {/* --- ADMIN --- */}
          <Route path="Admusuarios" element={<AdmUsuarios />} />
          <Route path="Admadicionales" element={<DashboardPage />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="cargos" element={<CargosPage />} />
          <Route path="registroUsuario" element={<RegistrarUsuario />} />
          <Route path="admAreas" element={<AdmAreas />} />
          <Route path="admEmpresas" element={<SuperAdminDashboard></SuperAdminDashboard>} />


          {/* --- USER --- */}
          <Route path="inicioUser" element={<InicioUser />} />
          <Route path="navUser" element={<NavbarUser />} />
          <Route path="lectorUserChe" element={<LectorChequeo />} />
          <Route path="creaListChe" element={<CrearListChequeo />} />
          <Route path="LectorUserRepo" element={<LectorListaReportes />} />
          <Route path="creaListRepo" element={<CrearListReporte />} />
          <Route path="MidetalleChe" element={<MiDetalleListaChequeo />} />
          <Route path="MidetalleRepo" element={<MiDetalleReporte />} />
          <Route path="LectorUserAct" element={<LectorListasActividadesLudicas></LectorListasActividadesLudicas>} />
          <Route path="creaActUser" element={<UserActividadLudica />} />
          <Route path="MidetalleAct" element={<MiDetalleActividadLudica />} />
          <Route path="EventosUser" element={<ListaEventosEmpresa></ListaEventosEmpresa>} />
          <Route path="MiEvento" element={<MiEvento />} />
          <Route path="lectorgestionepp" element={<LectorMisGestiones></LectorMisGestiones>} />
          <Route path="Migestionepp" element={<DetalleGestionEPPUser />} />
          <Route path="CreargestioneppUser" element={<CrearGestionEppUser></CrearGestionEppUser>} />


          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="inicio" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


