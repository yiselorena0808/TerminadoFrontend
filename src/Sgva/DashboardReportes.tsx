import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import { FaChartPie } from "react-icons/fa";

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels
);

interface FuncionalidadData {
  nombre: string;
  total: number;
}

const DashboardReportes: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [dataFuncionalidad, setDataFuncionalidad] = useState<FuncionalidadData[]>([]);
  const [filtro, setFiltro] = useState<string>("");

  const apiDashboard = import.meta.env.VITE_API_DASH;

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
        headers: {  'ngrok-skip-browser-warning': 'true',  Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setDataFuncionalidad(result.datos || []);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    }
  };

  useEffect(() => {
    if (usuario) obtenerDatos();
  }, [usuario]);

  const dataFiltrada = dataFuncionalidad.filter((f) =>
    f.nombre.toLowerCase().includes(filtro.toLowerCase())
  );
  const totalGeneral = dataFiltrada.reduce((sum, f) => sum + f.total, 0);

  const colores = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa", "#f472b6"];

  // Datos para Bar chart
  const barData = {
    labels: dataFiltrada.map((f) => f.nombre),
    datasets: [
      {
        label: "Cantidad de usos",
        data: dataFiltrada.map((f) => f.total),
        backgroundColor: colores,
        borderRadius: 6,
      },
    ],
  };

  // Datos para Line chart (tiempo estimado en minutos)
  const lineData = {
    labels: dataFiltrada.map((f) => f.nombre),
    datasets: [
      {
        label: "⏱ Tiempo de uso (minutos)",
        data: dataFiltrada.map((f) => f.total * 5), // simulado: cada uso = 5 minutos
        fill: false,
        borderColor: "#f59e0b",
        backgroundColor: "#fbbf24",
        tension: 0.3,
      },
    ],
  };

  // Opciones
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end" as const,
        align: "top" as const,
        color: "#374151",
        font: { weight: "bold" },
        formatter: (value: number) => value,
      },
    },
    scales: {
      x: { ticks: { color: "#374151", font: { weight: "bold" } } },
      y: { ticks: { color: "#374151" }, beginAtZero: true },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      datalabels: {
        align: "top" as const,
        anchor: "end" as const,
        color: "#374151",
        formatter: (value: number) => `${value}m`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Minutos",
        },
      },
    },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/fotos-premium/equipos-proteccion-personal-para-la-seguridad-industrial_1033579-251259.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Card */}
      <div className="relative w-full max-w-6xl bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-blue-600 space-y-10">
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <FaChartPie className="text-blue-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">📊 Dashboard Funcionalidades</h2>
        </div>

        {/* Filtro */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar funcionalidad..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-xl px-4 py-3 shadow focus:ring focus:ring-yellow-300 focus:outline-none"
          />
        </div>

        {dataFiltrada.length === 0 ? (
          <p className="text-center text-gray-600 font-semibold">
            ⚠️ No hay resultados para tu búsqueda.
          </p>
        ) : (
          <>
            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-xl shadow border border-blue-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Cantidad de usos</h3>
                <Bar data={barData} options={barOptions} />
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-blue-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">⏱ Tiempo de uso estimado</h3>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Ranking de funcionalidades */}
            <div className="bg-white p-6 rounded-xl shadow border border-blue-600">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">🏆 Ranking de funcionalidades</h3>
              <ul className="space-y-2">
                {dataFiltrada
                  .sort((a, b) => b.total - a.total)
                  .map((f, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200"
                    >
                      <span className="font-semibold text-gray-700">
                        #{i + 1} - {f.nombre}
                      </span>
                      <span className="text-yellow-600 font-bold">{f.total} usos</span>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardReportes;

