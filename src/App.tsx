import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import CrearReporte from './CrearReporte';
import DashboardReportes from './DashboardReportes';
import CrearGestionEpp from './CrearGestionEpp';
import CrearEventos from './Eventos';
import InicioUser from '../src/User/InicioUser';
import Correo from './Correo';
import ResetPasswordForm from './Recuperar';
import DashboardPage from './Adicionales';

import CargosPage from './CrearCargo';
import ProductosPage from './CrearProducto';
import LectorChequeo from './User/LectorListasChequeoUser';
import CrearListChequeo from './User/CreaListChequeo';
import LectorListaReportes from './User/LectorListasReporteUser';
import CrearListReporte from './User/CrearListRepo';
import MiDetalleListaChequeo from './User/DetalleListChe';
import MiDetalleReporte from './User/DetalleListRepo';
import LectorAct from './User/LectorActUser';
import UserActividadLudica from './User/CreaActUser';
import MiDetalleActividadLudica from './User/DetalleActUser';
import ListaEventosEmpresa from './User/ListaEventosEmpresa';
import MiEvento from './User/CreaEvento';
import ListaEventos from './ListaEventos';
import UserGestionEPP from './User/GestionEppUser';
import DetalleGestionEPPUser from './User/DetalleGestion';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login y registro */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registroArea" element={<RegistroArea />} />
        <Route path="/registroEmpresa" element={<RegistroEmpresa />} />
        <Route path="/forgot" element={<Correo />} />
        <Route path="/reset" element={<ResetPasswordForm />} />

        {/* Panel principal con Navbar */}
        <Route path="/nav" element={<Navba />}>
          <Route path="navUser" element={<NavbarUser />} />
          <Route path="inicio" element={<DashboardReportes />} />

          {/* Gestión EPP */}
          <Route path="gestionEpp" element={<ListarGestiones />} />
          <Route path="detalleGestionEpp" element={<DetalleGestionEPP />} />
          <Route path="creargestionEpp" element={<CrearGestionEpp />} />

          {/* Blog/Eventos */}
          <Route path="blog" element={<ListaEventos></ListaEventos>} />
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
          <Route path="actLudica" element={<ListasActividadesLudicas></ListasActividadesLudicas>} />
          <Route path="detalleActLudica" element={<DetalleActividad />} />
          <Route path="crearActLudica" element={<CrearActividadLudica />} />

          {/* Otros */}
          <Route path="perfil" element={<Perfil />} />
          <Route path="usuarios" element={<AdmUsuarios />} />

          {/* Panel Admin con Navbare */}
          <Route path="adicionales" element={<DashboardPage></DashboardPage>}>
            <Route path="cargos" element={<CargosPage />} />
            <Route path="productos" element={<ProductosPage />} />
            {/* Redirigir por defecto a cargos */}
            <Route path="*" element={<Navigate to="cargos" />} />
          </Route>

          {/*USER */}
          <Route path="inicioUser" element={<InicioUser />} />
          <Route path='lectorUserChe' element={<LectorChequeo></LectorChequeo>}></Route>
          <Route path='creaListChe' element={<CrearListChequeo></CrearListChequeo>}></Route>
          <Route path='LectorUserRepo' element={<LectorListaReportes></LectorListaReportes>}></Route>
          <Route path='creaListRepo' element={<CrearListReporte></CrearListReporte>}></Route>
          <Route path='MidetalleChe' element={<MiDetalleListaChequeo></MiDetalleListaChequeo>}></Route>
          <Route path='MidetalleRepo' element={<MiDetalleReporte></MiDetalleReporte>}></Route>
          <Route path='LectorUserAct' element={<LectorAct></LectorAct>}></Route>
          <Route path='creaActUser' element={<UserActividadLudica></UserActividadLudica>}></Route>
          <Route path='MidetalleAct' element={<MiDetalleActividadLudica></MiDetalleActividadLudica>}></Route>
          <Route path='EventosUser' element={<ListaEventosEmpresa></ListaEventosEmpresa>}></Route>
           <Route path='MiEvento' element={<MiEvento></MiEvento>}></Route>
           <Route path='gestionepp' element={<UserGestionEPP></UserGestionEPP>}></Route>
            <Route path='Migestionepp' element={<DetalleGestionEPPUser></DetalleGestionEPPUser>}></Route>
           
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
