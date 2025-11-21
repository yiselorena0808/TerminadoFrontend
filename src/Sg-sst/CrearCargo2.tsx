import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle } from "react-icons/fa";

interface Cargo {
  idCargo: number;
  cargo: string;
  idEmpresa: number;
}

const CargosPage2: React.FC = () => {
  const token = localStorage.getItem("token");
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [nuevoCargo, setNuevoCargo] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const listarCargos = async () => {
    const res = await fetch(import.meta.env.VITE_API_CARGOS, {
      headers: { 
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}` 
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    setCargos(data);
  };

  const crearCargo = async () => {
    if (!nuevoCargo.trim() || !usuario?.id_empresa) {
      Swal.fire("Error", "Faltan datos del usuario para crear el cargo", "error");
      return;
    }

    const res = await fetch(import.meta.env.VITE_API_CREARCARGO, {
      method: "POST",
      headers: {
        'ngrok-skip-browser-warning': 'true',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cargo: nuevoCargo,
        id_empresa: usuario.id_empresa,
      }),
    });

    if (!res.ok) return Swal.fire("Error", "No se pudo crear el cargo", "error");

    setNuevoCargo("");
    listarCargos();
    Swal.fire("Éxito", "Cargo creado correctamente", "success");
  };

  const eliminarCargo = async (idCargo: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cargo?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    const res = await fetch(`${import.meta.env.VITE_API_ELIMINARCARGO}${idCargo}`, {
      method: "DELETE",
      headers: {
        'ngrok-skip-browser-warning': 'true', 
        Authorization: `Bearer ${token}` 
      },
    });
    if (!res.ok) return Swal.fire("Error", "No se pudo eliminar el cargo", "error");

    listarCargos();
    Swal.fire("Eliminado", "Cargo eliminado correctamente", "success");
  };

  const editarCargo = async (cargo: Cargo) => {
    const { value: nuevo } = await Swal.fire({
      title: "Editar Cargo",
      input: "text",
      inputValue: cargo.cargo,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
    });

    if (!nuevo || !nuevo.trim()) return;

    const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARCARGO}${cargo.idCargo}`, {
      method: "PUT",
      headers: {
        'ngrok-skip-browser-warning': 'true',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cargo: nuevo }),
    });
    if (!res.ok) return Swal.fire("Error", "No se pudo actualizar el cargo", "error");

    listarCargos();
    Swal.fire("Actualizado", "Cargo modificado correctamente", "success");
  };

  useEffect(() => {
    listarCargos();
  }, []);

  const cargosFiltrados = cargos.filter(cargo =>
    cargo.cargo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* CONTADOR */}
      <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
        <p className="text-blue-800 font-semibold">
          Total: <span className="text-blue-600">{cargosFiltrados.length}</span> cargos
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cargo..."
              className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
        </div>
      </div>

      {/* CREAR CARGO */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Cargo</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={nuevoCargo}
            onChange={(e) => setNuevoCargo(e.target.value)}
            placeholder="Nombre del cargo"
            className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
          />
          <button
            onClick={crearCargo}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <FaPlus /> Crear
          </button>
        </div>
      </div>

      {/* LISTA DE CARGOS */}
      {cargosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
          <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {cargos.length === 0 ? "No hay cargos registrados" : "No se encontraron cargos"}
          </h3>
          <p className="text-gray-500">
            {cargos.length === 0 
              ? "Crea el primer cargo usando el formulario superior" 
              : "Intenta con otros términos de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cargosFiltrados.map((c) => (
            <div
              key={c.idCargo}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {c.cargo}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editarCargo(c)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-2 rounded-xl transition-all duration-300 shadow-lg"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => eliminarCargo(c.idCargo)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-xl transition-all duration-300 shadow-lg"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CargosPage2;