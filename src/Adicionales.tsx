import React, { useState } from "react";
import CargosPage from "./CrearCargo";
import ProductosPage from "./CrearProducto";

const DashboardPage: React.FC = () => {
  const [tab, setTab] = useState("cargos");

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setTab("cargos")}
          className={`px-4 py-2 font-semibold ${
            tab === "cargos"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Cargos
        </button>
        <button
          onClick={() => setTab("productos")}
          className={`px-4 py-2 font-semibold ${
            tab === "productos"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Productos
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        {tab === "cargos" && <CargosPage />}
        {tab === "productos" && <ProductosPage />}
      </div>
    </div>
  );
};

export default DashboardPage;
