import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHardHat,
  FaUsersCog,
  FaBuilding,
  FaClipboardList,
  FaToolbox,
  FaCalendarAlt,
  FaUserShield,
  FaLayerGroup,
  FaSmileBeam,
  FaSitemap,
} from "react-icons/fa";

const Inicio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-inter">
      {/* 🔷 HEADER */}
      <header className="flex justify-between items-center px-8 py-5 bg-black/80 backdrop-blur-md border-b border-blue-700/40 fixed top-0 w-full z-50">
        <div className="flex items-center space-x-3">
          <FaHardHat className="text-blue-500 text-3xl" />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Plataforma SST Multitenant
          </h1>
        </div>
        <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <a href="#roles" className="hover:text-blue-400 transition-colors">
            Roles
          </a>
          <a href="#funcionalidades" className="hover:text-blue-400 transition-colors">
            Funcionalidades
          </a>
          <a href="#about" className="hover:text-blue-400 transition-colors">
            Acerca
          </a>
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg transition"
        >
          Iniciar sesión
        </button>
      </header>

      {/* 🌟 HERO SECTION */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-32 md:py-44 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Seguridad y Salud en el Trabajo <br />
            <span className="text-blue-400">Digital, Inteligente y Multitenant</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300 mb-10 text-lg">
            Un entorno profesional desarrollado por aprendices del SENA, diseñado para
            gestionar la seguridad laboral, promover el bienestar y fortalecer la cultura
            de prevención en las empresas.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-400 px-8 py-3 rounded-lg font-semibold text-white text-lg shadow-md transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="bg-blue-500 hover:bg-blue-400 px-8 py-3 rounded-lg font-semibold text-white text-lg shadow-md transition"
            >
              Registrarse
            </button>
          </div>
        </div>
      </section>

      {/* 🏢 MULTITENANT */}
      <section className="bg-white text-black py-20 text-center">
        <FaBuilding className="text-blue-500 text-6xl mx-auto mb-5" />
        <h3 className="text-3xl font-bold mb-4">Arquitectura Multitenant</h3>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
          Cada empresa tiene su propio espacio digital aislado y seguro, garantizando
          independencia y control de los datos en la gestión SST.
        </p>
      </section>

      {/* 🧍‍♂️ ROLES */}
      <section id="roles" className="py-20 bg-black text-center">
        <h3 className="text-3xl font-bold mb-12 text-blue-400">
          Roles y niveles de acceso
        </h3>
        <div className="grid md:grid-cols-4 gap-8 px-10">
          {[
            {
              icon: <FaUserShield className="text-blue-400 text-5xl mb-3 mx-auto" />,
              title: "Superadmin",
              desc: "Control total del sistema: gestion de empresas y areas.",
            },
            {
              icon: <FaUsersCog className="text-blue-500 text-5xl mb-3 mx-auto" />,
              title: "Administrador",
              desc: "Gestión de personal y áreas con relacion a su empresa.",
            },
            {
              icon: <FaHardHat className="text-blue-300 text-5xl mb-3 mx-auto" />,
              title: "SGVA",
              desc: "Gestion y supervision de listas de chequeo,reportes,actividades ludicas,gestion epp,entre otras.",
            },
            {
              icon: <FaUsersCog className="text-white text-5xl mb-3 mx-auto" />,
              title: "Usuario",
              desc: "Registro de incidentes, participación en capacitaciones y revision de vehiculos, entre otras.",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-blue-950 to-black border border-blue-800/50 rounded-2xl p-6 shadow-lg hover:shadow-blue-600/40 hover:-translate-y-1 transition-transform duration-300"
            >
              {r.icon}
              <h4 className="font-semibold text-lg mb-2 text-white">{r.title}</h4>
              <p className="text-gray-400 text-sm">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⚙️ FUNCIONALIDADES */}
      <section id="funcionalidades" className="bg-white text-black py-20 text-center">
        <h3 className="text-3xl font-bold mb-10 text-blue-800">
          Funcionalidades Principales
        </h3>
        <div className="grid md:grid-cols-3 gap-8 px-10">
          {[
             {
              icon: <FaToolbox className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Reportes",
              desc: "Control de entrega de reportes de accidentes e incidentes dentro de la empresa o horario laboral.",
            },
            {
              icon: <FaToolbox className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Gestión EPP",
              desc: "Control de entrega y solicitudes de equipos de protección personal.",
            },
            {
              icon: <FaClipboardList className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Listas de Chequeo",
              desc: "Evaluación de condiciones seguras en vehículos.",
            },
            {
              icon: <FaCalendarAlt className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Eventos SST",
              desc: "Planificación y registro de capacitaciones y charlas de seguridad.",
            },
            {
              icon: <FaSmileBeam className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Actividades Lúdicas",
              desc: "Entrega de evidencias de realizacion de actividades recreativas dentro de la empresa por medio del aplicativo movil",
            },
            {
              icon: <FaBuilding className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Administración de Empresas",
              desc: "Gestión multicompañía: crea, edita y organiza los entornos empresariales.",
            },
            {
              icon: <FaSitemap className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Gestión de Áreas",
              desc: "Administra departamentos: crea,edita y elimina areas de la empresa",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-blue-400/40 transition-transform hover:-translate-y-1"
            >
              {f.icon}
              <h4 className="text-xl font-semibold mb-2 text-black">{f.title}</h4>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎓 ACERCA */}
      <section
        id="about"
        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 text-center"
      >
        <h3 className="text-2xl font-bold mb-4">Desarrollado por Aprendices del SENA</h3>
        <p className="max-w-2xl mx-auto text-base font-medium text-gray-100">
          Proyecto académico orientado a la innovación y mejora de procesos de Seguridad
          y Salud en el Trabajo mediante herramientas tecnológicas modernas.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-center py-6 text-gray-400 text-sm border-t border-blue-800">
        © 2025 Plataforma SST — Desarrollado por aprendices del SENA | Todos los derechos reservados
      </footer>
    </div>
  );
};

export default Inicio;
