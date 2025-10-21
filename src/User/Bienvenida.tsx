import React from "react";
import { FaHardHat, FaUserShield, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const Bienvenida: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-800 via-blue-500 to-blue-300 text-white flex flex-col items-center justify-start py-20 px-6">

      {/* Fondo parallax */}
      <div className="absolute inset-0 -z-10 bg-[url('/ruta/fondo-sst.jpg')] bg-cover bg-center opacity-20"></div>

      {/* Título principal */}
      <motion.div 
        className="text-center mb-20 max-w-4xl"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Bienvenido al Sistema Integral de SST
        </h1>
        <p className="text-lg md:text-xl text-blue-100">
          La plataforma profesional que potencia la seguridad, salud y bienestar laboral. Gestiona riesgos, optimiza procesos y fomenta la prevención de manera efectiva.
        </p>
      </motion.div>

      {/* Secciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">

        {/* Prevención */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          whileHover={{ scale: 1.08 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FaHardHat size={60} className="mb-4 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-2">Prevención</h3>
          <p className="text-blue-100">
            Evalúa riesgos, accede a protocolos de seguridad y realiza inspecciones periódicas para proteger a tu equipo.
          </p>
        </motion.div>

        {/* Seguridad */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          whileHover={{ scale: 1.08 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FaUserShield size={60} className="mb-4 text-red-400" />
          <h3 className="text-2xl font-bold mb-2">Seguridad</h3>
          <p className="text-blue-100">
            Gestiona reportes, controla incidencias y asegura que cada colaborador cumpla con los estándares de protección.
          </p>
        </motion.div>

        {/* Mejora continua */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          whileHover={{ scale: 1.08 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <FaChartLine size={60} className="mb-4 text-green-400" />
          <h3 className="text-2xl font-bold mb-2">Mejora Continua</h3>
          <p className="text-blue-100">
            Monitorea métricas, analiza resultados y toma decisiones estratégicas para optimizar la seguridad y bienestar de todos.
          </p>
        </motion.div>

      </div>

      {/* Botón principal */}
      <motion.div 
        className="mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <a
          href="/dashboard"
          className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-blue-100 hover:text-blue-800 transition-colors"
        >
          Ir al Panel de Control
        </a>
      </motion.div>

      {/* Mensaje adicional */}
      <motion.p 
        className="mt-12 text-blue-100 max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        La prevención es responsabilidad de todos. Usa esta plataforma para fortalecer la cultura de seguridad y crear un ambiente laboral seguro y saludable.
      </motion.p>
    </div>
  );
};

export default Bienvenida;
