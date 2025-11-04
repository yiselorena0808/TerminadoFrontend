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
  FaSmileBeam,
  FaSitemap,
} from "react-icons/fa";
import logo from "../assets/logosst.jpg";

const Inicio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-inter text-gray-800">
      {/* 🔷 HEADER */}
      <header className="flex justify-between items-center px-10 py-5 bg-white shadow-md fixed w-full top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">
            Sistema Integral de Seguridad Laboral
          </h1>
        </div>

        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <a href="#roles" className="hover:text-blue-700 transition-colors">
            Roles
          </a>
          <a href="#funcionalidades" className="hover:text-blue-700 transition-colors">
            Funcionalidades
          </a>
          <a href="#about" className="hover:text-blue-700 transition-colors">
            Acerca
          </a>
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
        >
          Iniciar sesión
        </button>
      </header>

      {/* 🌟 HERO SECTION (sin imagen de fondo) */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 leading-tight">
            Seguridad y Salud en el Trabajo <br />
            <span className="text-blue-600">Digital y Multi-Empresa</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 mb-10 text-lg">
            Una plataforma moderna desarrollada por aprendices del SENA, para gestionar la
            seguridad laboral, el bienestar de los trabajadores y fortalecer la cultura de
            prevención en las empresas.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-700 hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold text-white text-lg shadow-md transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition"
            >
              Registrarse
            </button>
          </div>
        </div>
      </section>

      {/* 🏢 MULTITENANT */}
      <section className="bg-white text-center py-20 border-t border-blue-100">
        <FaBuilding className="text-blue-600 text-6xl mx-auto mb-5" />
        <h3 className="text-3xl font-bold mb-4 text-blue-900">Arquitectura Multitenant</h3>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
          Cada empresa cuenta con su propio entorno digital, seguro e independiente,
          garantizando control total sobre sus datos y operaciones SST.
        </p>
      </section>

      {/* 🧍‍♂️ ROLES */}
      <section id="roles" className="py-20 bg-blue-50 text-center">
        <h3 className="text-3xl font-bold mb-12 text-blue-800">
          Roles y Niveles de Acceso
        </h3>
        <div className="grid md:grid-cols-4 gap-8 px-10">
          {[
            {
              icon: <FaUserShield className="text-blue-700 text-5xl mb-3 mx-auto" />,
              title: "Superadmin",
              desc: "Control total del sistema: gestión de empresas y áreas.",
            },
            {
              icon: <FaUsersCog className="text-blue-600 text-5xl mb-3 mx-auto" />,
              title: "Administrador",
              desc: "Gestión de personal, áreas y datos específicos de su empresa.",
            },
            {
              icon: <FaHardHat className="text-blue-500 text-5xl mb-3 mx-auto" />,
              title: "SGVA",
              desc: "Supervisión de listas de chequeo, reportes, actividades y EPP.",
            },
            {
              icon: <FaUsersCog className="text-blue-400 text-5xl mb-3 mx-auto" />,
              title: "Usuario",
              desc: "Registro de incidentes, participación en capacitaciones y revisiones.",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-blue-200 hover:-translate-y-1 transition-transform"
            >
              {r.icon}
              <h4 className="font-semibold text-lg mb-2 text-blue-800">{r.title}</h4>
              <p className="text-gray-600 text-sm">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⚙️ FUNCIONALIDADES */}
      <section id="funcionalidades" className="bg-white text-center py-20 border-t border-blue-100">
        <h3 className="text-3xl font-bold mb-10 text-blue-900">
          Funcionalidades Principales
        </h3>
        <div className="grid md:grid-cols-3 gap-8 px-10">
          {[
            {
              icon: <FaToolbox className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Reportes",
              desc: "Control de reportes de accidentes e incidentes laborales.",
            },
            {
              icon: <FaClipboardList className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Listas de Chequeo",
              desc: "Evaluación de condiciones seguras en vehículos y áreas.",
            },
            {
              icon: <FaCalendarAlt className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Eventos SST",
              desc: "Planificación y registro de capacitaciones y charlas.",
            },
            {
              icon: <FaSmileBeam className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Actividades Lúdicas",
              desc: "Gestión de actividades recreativas para el bienestar laboral.",
            },
            {
              icon: <FaBuilding className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Administración de Empresas",
              desc: "Gestión multicompañía: creación y organización de empresas.",
            },
            {
              icon: <FaSitemap className="text-blue-600 text-6xl mb-3 mx-auto" />,
              title: "Gestión de Áreas",
              desc: "Administra departamentos: crea, edita y elimina áreas laborales.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-blue-400/40 transition-transform hover:-translate-y-1"
            >
              {f.icon}
              <h4 className="text-xl font-semibold mb-2 text-blue-900">{f.title}</h4>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎓 ACERCA */}
      <section id="about" className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Desarrollado por Aprendices del SENA</h3>
        <p className="max-w-2xl mx-auto text-base font-medium text-gray-100">
          Proyecto académico orientado a innovar y mejorar los procesos de Seguridad y Salud en el Trabajo mediante tecnología moderna.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-center py-6 text-gray-200 text-sm border-t border-blue-800">
        © 2025 Sistema Integral SST — Desarrollado por aprendices del SENA
      </footer>
    </div>
  );
};

export default Inicio;
