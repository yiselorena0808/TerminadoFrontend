import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login'; 
import Registro from './Registro';
import RegistroArea from './RegistroArea';
import RegistroEmpresa from './RegistroEmpresa';
import Navba from './Navbar';
import ListarGestiones from './ListasGestionEPP';
import ListasChequeoRecibidas from './ListasChequeo';
import ListasReportes from './ListasReportes';
import ListasActividadesLudicas from './ListasActLudicas';
import AdmUsuarios from './ListasUsuarios';
import CrearActividadLudica from './CrearActLudica';
import DetalleReporte from './DetalleReporte';
import DetalleListaChequeo from './DetalleListaChqueo';
import DetalleActividad from './DetalleActLudica';
import DetalleGestionEPP from './DetalleGestionEpp';
import CrearListaChequeo from './CrearListaChequeo';
import Perfil from './perfil';
import NavbarUser from './User/NavUser';
import ListarGestionesUser from './User/GestionEppUser';
import LectorGestion from './User/LectorGestion';
import CrearReporte from './CrearReporte';
import DashboardReportes from './DashboardReportes';
import CrearGestionEpp from './CrearGestionEpp';
import CrearEventos from './Eventos';
import ForgotPasswordForm from './Correo';
import ListaPublicaciones from './ListaEventos';
import Correo from './Correo';

// 👇 Importaciones nuevas
import Productos from './CrearProducto';
import CargoProducto from './Adicionales';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login y registro */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registroArea" element={<RegistroArea />} />
        <Route path="/registroEmpresa" element={<RegistroEmpresa />} />
        <Route path="/forgot" element={<ForgotPasswordForm />} />
        <Route path="/reset" element={<Correo />} />

        {/* Panel principal con Navbar */}
        <Route path="/nav" element={<Navba />}>
          <Route path="navUser" element={<NavbarUser />} />
          <Route path="inicio" element={<DashboardReportes />} />

          {/* Gestión EPP */}
          <Route path="gestionEpp" element={<ListarGestiones />} />
          <Route path="detalleGestionEpp" element={<DetalleGestionEPP />} />
          <Route path="creargestionEpp" element={<CrearGestionEpp />} />

          {/* Blog/Eventos */}
          <Route path="blog" element={<ListaPublicaciones />} />
          <Route path="crearBlog" element={<CrearEventos />} />

          {/* Listas de Chequeo */}
          <Route path="ListasChequeo" element={<ListasChequeoRecibidas />} />
          <Route path="detalleListasChequeo" element={<DetalleListaChequeo />} />
          <Route path="crearListasChequeo" element={<CrearListaChequeo />} />

          {/* Reportes */}
          <Route path="reportesC" element={<ListasReportes />} />
          <Route path="detalleReportes" element={<DetalleReporte />} />
          <Route path="crearReportes" element={<CrearReporte />} />

          {/* Actividades Lúdicas */}
          <Route path="actLudica" element={<ListasActividadesLudicas />} />
          <Route path="detalleActLudica" element={<DetalleActividad />} />
          <Route path="crearActLudica" element={<CrearActividadLudica />} />

          {/* Otros */}
          <Route path="perfil" element={<Perfil />} />
          <Route path="usuarios" element={<AdmUsuarios />} />

          {/* 🚀 Panel Admin */}
          <Route path="adicionales" element={<CargoProducto></CargoProducto>} />
          <Route path="prod" element={<Productos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
