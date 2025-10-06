import React, { useState } from "react";
import CargosPage from "./CrearCargo";
import ProductosPage from "./CrearProducto";

const DashboardPage: React.FC = () => {
  const [tab, setTab] = useState<"cargos" | "productos">("cargos");

  return (
    <div
      className="min-h-screen p-8 bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200"
      style={{
        backgroundImage:
          "url('https://www.serpresur.com/wp-content/uploads/2023/08/serpresur-El-ABC-de-los-Equipos-de-Proteccion-Personal-EPP-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Encabezado */}
      <div className="bg-yellow-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-bold">Panel de Administración</h1>
        <p className="text-yellow-200 text-lg">
          Gestión de cargos y productos SST
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-4 mb-8 justify-center md:justify-start">
        <button
          onClick={() => setTab("cargos")}
          className={`px-6 py-3 font-semibold rounded-xl transition ${
            tab === "cargos"
              ? "bg-yellow-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-yellow-100"
          }`}
        >
          Cargos
        </button>
        <button
          onClick={() => setTab("productos")}
          className={`px-6 py-3 font-semibold rounded-xl transition ${
            tab === "productos"
              ? "bg-yellow-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-yellow-100"
          }`}
        >
          Productos
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto">
        {tab === "cargos" && <CargosPage />}
        {tab === "productos" && <ProductosPage />}
      </div>
    </div>
  );
};

export default DashboardPage;
