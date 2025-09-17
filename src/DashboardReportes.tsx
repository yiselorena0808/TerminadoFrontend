import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FuncionalidadData {
  nombre: string;
  total: number;
}

const DashboardReportes: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [dataFuncionalidad, setDataFuncionalidad] = useState<FuncionalidadData[]>([]);

  const apiDashboard = import.meta.env.VITE_API_DASHBOARD; // tu endpoint que devuelve datos por funcionalidad

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
  }, []);

  const obtenerDatos = async () => {
    if (!usuario) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const res = await fetch(apiDashboard, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      // esperar un array [{ nombre: 'Crear Reporte', total: 10 }, ...]
      setDataFuncionalidad(result.datos || []);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    }
  };

  useEffect(() => {
    if (usuario) obtenerDatos();
  }, [usuario]);

  const chartData = {
    labels: dataFuncionalidad.map((f) => f.nombre),
    datasets: [
      {
        label: "Porcentaje de uso",
        data: dataFuncionalidad.map((f) => f.total),
        backgroundColor: [
          "#4ade80",
          "#60a5fa",
          "#facc15",
          "#f87171",
          "#a78bfa",
          "#f472b6",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Dashboard Funcionalidades</h2>
        {dataFuncionalidad.length === 0 ? (
          <p className="text-center text-gray-500">Cargando datos...</p>
        ) : (
          <Pie data={chartData} />
        )}
      </div>
    </div>
  );
};

export default DashboardReportes;
