import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

interface FuncionalidadData {
  nombre: string;
  total: number;
}

const DashboardReportes: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [dataFuncionalidad, setDataFuncionalidad] = useState<FuncionalidadData[]>([]);
  const [filtro, setFiltro] = useState<string>(""); // 🔍 texto de búsqueda

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
        headers: { Authorization: `Bearer ${token}` },
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

  // 🔍 Aplicar filtro por nombre
  const dataFiltrada = dataFuncionalidad.filter((f) =>
    f.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalGeneral = dataFiltrada.reduce((sum, f) => sum + f.total, 0);

  const colores = [
    "#4ade80",
    "#60a5fa",
    "#facc15",
    "#f87171",
    "#a78bfa",
    "#f472b6",
  ];

  const pieData = {
    labels: dataFiltrada.map((f) => f.nombre),
    datasets: [
      {
        label: "Uso de funcionalidades",
        data: dataFiltrada.map((f) => f.total),
        backgroundColor: colores,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

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

  const pieOptions = {
    plugins: {
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
        formatter: (value: number) => {
          if (totalGeneral === 0) return "0%";
          const porcentaje = ((value / totalGeneral) * 100).toFixed(1);
          return `${value} (${porcentaje}%)`;
        },
      },
    },
  };

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

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg space-y-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          📊 Dashboard Funcionalidades
        </h2>

        {/* 🔍 Buscador */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Buscar funcionalidad..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {dataFiltrada.length === 0 ? (
          <p className="text-center text-gray-500">No hay resultados para tu búsqueda.</p>
        ) : (
          <>
            {/* Gráfico de pastel y barras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Distribución (%)</h3>
                <Pie data={pieData} options={pieOptions} />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Cantidad de usos</h3>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="overflow-x-auto bg-gray-50 p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">📋 Resumen</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">Funcionalidad</th>
                    <th className="p-3 text-center">Cantidad</th>
                    <th className="p-3 text-center">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFiltrada.map((f, i) => {
                    const porcentaje = totalGeneral
                      ? ((f.total / totalGeneral) * 100).toFixed(1)
                      : "0";
                    return (
                      <tr key={i} className="border-b">
                        <td className="p-3">{f.nombre}</td>
                        <td className="p-3 text-center">{f.total}</td>
                        <td className="p-3 text-center">{porcentaje}%</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-3">TOTAL</td>
                    <td className="p-3 text-center">{totalGeneral}</td>
                    <td className="p-3 text-center">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardReportes;
