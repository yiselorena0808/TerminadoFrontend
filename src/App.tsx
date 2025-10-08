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

// --- User ---
import InicioUser from "./User/InicioUser";
import NavbarUser from "./User/NavUser";
import LectorChequeo from "./User/LectorListasChequeoUser";
import CrearListChequeo from "./User/CreaListChequeo";
import LectorListaReportes from "./User/LectorListasReporteUser";
import CrearListReporte from "./User/CrearListRepo";
import MiDetalleListaChequeo from "./User/DetalleListChe";
import MiDetalleReporte from "./User/DetalleListRepo";
import LectorAct from "./User/LectorActUser";
import UserActividadLudica from "./User/CreaActUser";
import MiDetalleActividadLudica from "./User/DetalleActUser";
import ListaEventosEmpresa from "./User/ListaEventosEmpresa";
import MiEvento from "./User/CreaEvento";
import UserGestionEPP from "./User/GestionEppUser";
import DetalleGestionEPPUser from "./User/DetalleGestion";

// --- Perfil ---
import Perfil from "./perfil";

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
          <Route path="sgvaperfil" element={<Perfil />} />

          {/* --- ADMIN --- */}
          <Route path="Admusuarios" element={<AdmUsuarios />} />
          <Route path="Admadicionales" element={<DashboardPage />} />
          <Route path="Admperfil" element={<Perfil />} />
          <Route path="cargos" element={<CargosPage />} />

          {/* --- USER --- */}
          <Route path="inicioUser" element={<InicioUser />} />
          <Route path="navUser" element={<NavbarUser />} />
          <Route path="lectorUserChe" element={<LectorChequeo />} />
          <Route path="creaListChe" element={<CrearListChequeo />} />
          <Route path="LectorUserRepo" element={<LectorListaReportes />} />
          <Route path="creaListRepo" element={<CrearListReporte />} />
          <Route path="MidetalleChe" element={<MiDetalleListaChequeo />} />
          <Route path="MidetalleRepo" element={<MiDetalleReporte />} />
          <Route path="LectorUserAct" element={<LectorAct />} />
          <Route path="creaActUser" element={<UserActividadLudica />} />
          <Route path="MidetalleAct" element={<MiDetalleActividadLudica />} />
          <Route path="EventosUser" element={<ListaEventosEmpresa />} />
          <Route path="MiEvento" element={<MiEvento />} />
          <Route path="gestionepp" element={<UserGestionEPP />} />
          <Route path="Migestionepp" element={<DetalleGestionEPPUser />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="inicio" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

