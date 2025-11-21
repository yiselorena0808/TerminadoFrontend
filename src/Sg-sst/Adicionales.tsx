import React, { useState } from "react";
import CargosPage2 from "./CrearCargo2";
import ProductosPage from "./CrearProducto";
import { FaHardHat } from "react-icons/fa";

const DashboardPage: React.FC = () => {
  const [tab, setTab] = useState<"cargos" | "productos">("cargos");

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaHardHat className="text-blue-700" /> 
            Panel de Administración
          </h1>
          {/* CONTADOR EN HEADER */}
          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Gestión de {tab === "cargos" ? "Cargos" : "Equipos"}
            </p>
          </div>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("cargos")}
            className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
              tab === "cargos"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Cargos
          </button>
          <button
            onClick={() => setTab("productos")}
            className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
              tab === "productos"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Equipos de Protección
          </button>
        </div>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        {tab === "cargos" && <CargosPage2 />}
        {tab === "productos" && <ProductosPage />}
      </div>
    </div>
  );
};

export default DashboardPage;