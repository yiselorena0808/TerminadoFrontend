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
import CalendarEventos from './Eventos';
import CrearReporte from './CrearReporte';
import DashboardReportes from './DashboardReportes';
import CrearGestionEpp from './CrearGestionEpp';
import CrearEventos from './Eventos';
import ForgotPasswordForm from './Correo';
import ResetPasswordForm from './Recuperar';
import Correo from './Correo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/registroArea" element={<RegistroArea />} />
        <Route path="/registroEmpresa" element={<RegistroEmpresa />} />
        <Route path='/forgot' element={<ForgotPasswordForm></ForgotPasswordForm>}></Route>
        <Route path='/reset' element={<Correo></Correo>}></Route>
         <Route path="/nav" element={<Navba />}>
          <Route path="/navUser" element={<NavbarUser></NavbarUser>}></Route>
          <Route path="inicio" element={<DashboardReportes></DashboardReportes>} />

          <Route path="gestionEpp" element={<ListarGestiones></ListarGestiones>} />
          <Route path="detalleGestionEpp" element={<DetalleGestionEPP />} />

          <Route path="blog" element={<CalendarEventos></CalendarEventos>} />
          <Route path='crearBlog' element={<CrearEventos></CrearEventos>}></Route>
          
          <Route path="gUser" element={<ListarGestionesUser></ListarGestionesUser>} />
          <Route path="lectorUser" element={<LectorGestion />} />

          <Route path="creargestionEpp" element={<CrearGestionEpp></CrearGestionEpp>} ></Route>

          <Route path="ListasChequeo" element={<ListasChequeoRecibidas  />} />
          <Route path="detalleListasChequeo" element={<DetalleListaChequeo />} />
          <Route path="crearListasChequeo" element={<CrearListaChequeo></CrearListaChequeo>} ></Route>


          <Route path="reportesC" element={<ListasReportes></ListasReportes>} />
          <Route path="detalleReportes" element={<DetalleReporte />} />
          <Route path="crearReportes" element={<CrearReporte></CrearReporte>}></Route>

          <Route path="actLudica" element={<ListasActividadesLudicas></ListasActividadesLudicas>} />
          <Route path="detalleActLudica" element={<DetalleActividad/>} />
          <Route path="crearActLudica" element={<CrearActividadLudica></CrearActividadLudica>} />
          <Route path='perfil' element={<Perfil></Perfil>}></Route>
          
          <Route path="usuarios" element={<AdmUsuarios />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
