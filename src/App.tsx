import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// --- Login y Registro ---
import Login from "./Register/Login";
import Registro from "./Register/Registro";
import RegistroArea from "./Register/RegistroArea";
import RegistroEmpresa from "./Register/RegistroEmpresa";
import ForgotPassword from "./Register/ForgotPassword";
import ResetPasswordForm from "./Register/ResetPasswordForm";
import VerifyCode from "./Register/VerifyCode"
import Inicio from "./Welcome.tsx/Inicio"
// --- Navbar principal ---
import Navbar from "./Navbar";

// --- SGVA ---
import GestionNotificaciones from "./Sg-sst/GestionNotificaciones"
import ListarGestiones from "./Sg-sst/ListasGestionEPP";
import ListasChequeoRecibidas from "./Sg-sst/ListasChequeo";
import ListasReportes from "./Sg-sst/ListasReportes";
import ListasActividadesLudicas from "./Sg-sst/ListasActLudicas";
import CrearActividadLudica from "./Sg-sst/CrearActLudica";
import DetalleReporte from "./Sg-sst/DetalleReporte";
import DetalleListaChequeo from "./Sg-sst/DetalleListaChqueo";
import DetalleActividad from "./Sg-sst/DetalleActLudica";
import DetalleGestionEPP from "./Sg-sst/DetalleGestionEpp";
import CrearListaChequeo from "./Sg-sst/CrearListaChequeo";
import CrearReporte from "./Sg-sst/CrearReporte";
import DashboardReportes from "./Sg-sst/DashboardReportes";
import CrearGestionEpp from "./Sg-sst/CrearGestionEpp";
import CrearEventos from "./Sg-sst/Eventos";
import ListaEventos from "./Sg-sst/ListaEventos";
import DashboardPage from "./Sg-sst/Adicionales";
import ProductosPage from "./Sg-sst/CrearProducto";
import CajaComentarios from "./components/CajaComentarios";

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

//superAdim

import ListaDeReportesGenerales from "./Super Admin/ListaDeReportesGenerales";
import ListaDeActividadesGenerales from './Super Admin/ListaDeActividadesGenerales';
import ListasChequeoGenerales from "./Super Admin/ListaDeChequeoGenerales";
import ListaDeGestionEppGeneral from "./Super Admin/ListaDeGestionEpp";
import ListaDeEventosGenerales from "./Super Admin/ListaDeEventosGenerales"
import CrearReporteSA from "./Super Admin/CrearReporte"
import ListaCargos from "./Super Admin/ListaDeCargos";
import ListaProductos from "./Super Admin/ListaEquiposDeProteccion";
import CrearActividadLudicaSA from "./Super Admin/CrearEvidencia";
import CrearListaChequeoSA from "./Super Admin/CrearListaChequeo";
import CrearGestionEppSA from "./Super Admin/CrearGestionEpp";
import DetalleListaChequeoSuper from "./Super Admin/DetalleListaChqueo";
// --- Perfil ---
import Perfil from "./perfil";
import SuperAdminDashboard from "./Super Admin/Empresas";
import LectorMisGestiones from "./User/LectorListasGestionUser";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN / REGISTRO */}
         <Route path="/" element={<Inicio></Inicio>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registroArea" element={<RegistroArea />} />
        <Route path="/registroEmpresa" element={<RegistroEmpresa />} />
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/verify-code" element={<VerifyCode></VerifyCode>} />

        <Route element={<ProtectedRoute />}>
        {/* PANEL PRINCIPAL con Navbar */}
        <Route path="/nav" element={<Navbar />}>
          {/* --- SGVA --- */}
          <Route path="GestionNotificaciones" element={<GestionNotificaciones></GestionNotificaciones>}></Route>
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
          <Route path="caja" element={<CajaComentarios></CajaComentarios>} />
          <Route path="DetalleListaChequeoSuper" element={<DetalleListaChequeoSuper></DetalleListaChequeoSuper>}></Route>
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

          <Route path="ListaDeReportesGenerales" element={<ListaDeReportesGenerales></ListaDeReportesGenerales>} />
          <Route path="ListaDeActividadesGenerales" element={<ListaDeActividadesGenerales></ListaDeActividadesGenerales>}></Route>
          <Route path="ListaChequeoGenerales" element={<ListasChequeoGenerales></ListasChequeoGenerales>}></Route>
          <Route path="ListaDeGestionEppGeneral"element={<ListaDeGestionEppGeneral></ListaDeGestionEppGeneral>}></Route>
          <Route path="ListaDeEventosGenerales" element={<ListaDeEventosGenerales></ListaDeEventosGenerales>}></Route>
          <Route path="CrearReporteSA" element={<CrearReporteSA></CrearReporteSA>}></Route>
          <Route path="ListaCargos" element={<ListaCargos></ListaCargos>}></Route>
          <Route path="ListaProductos" element={<ListaProductos></ListaProductos>}></Route>
          <Route path="CrearActividadLudicaSA" element={<CrearActividadLudicaSA></CrearActividadLudicaSA>}></Route>
          <Route path="CrearListaChequeoSA" element={<CrearListaChequeoSA></CrearListaChequeoSA>}></Route>
          <Route path="CrearGestionEppSA" element={<CrearGestionEppSA></CrearGestionEppSA>}></Route>
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="inicio" />} />
        </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


