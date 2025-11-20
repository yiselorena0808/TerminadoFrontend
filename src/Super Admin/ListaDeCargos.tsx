import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import { FaPlus, FaEdit, FaTrash, FaBuilding } from "react-icons/fa";

interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion: string;
  nit: string;
  estado: boolean;
}

interface Cargo {
  idCargo: number;
  cargo: string;
  idEmpresa: number;
}

const ListaCargos: React.FC = () => {
  const token = localStorage.getItem("token");
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [nuevoCargo, setNuevoCargo] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number>("");

  // Obtener todas las empresas
  const listarEmpresas = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_LISTAREMPRESAS, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.datos)) {
        setEmpresas(data.datos);
      }
    } catch (error) {
      console.error("Error listando empresas:", error);
    }
  };

  // Obtener todos los cargos
  const listarCargos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_TODOSLOSCARGOS, {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCargos(data);
    } catch (error) {
      console.error("Error listando cargos:", error);
    }
  };

  // Agrupar cargos por empresa
  const cargosPorEmpresa = empresas.map(empresa => ({
    empresa,
    cargos: cargos.filter(cargo => cargo.idEmpresa === empresa.idEmpresa)
  })).filter(grupo => grupo.cargos.length > 0); // Solo mostrar empresas que tienen cargos

  const crearCargo = async () => {
    if (!nuevoCargo.trim() || !empresaSeleccionada) {
      Swal.fire("Error", "Debe seleccionar una empresa y escribir un cargo", "error");
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
        id_empresa: parseInt(empresaSeleccionada),
      }),
    });

    if (!res.ok) return Swal.fire("Error", "No se pudo crear el cargo", "error");

    setNuevoCargo("");
    setEmpresaSeleccionada("");
    listarCargos();
    Swal.fire("Éxito", "Cargo creado correctamente", "success");
  };

  const eliminarCargo = async (idCargo: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cargo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
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
      inputValidator: (value) => {
        if (!value) {
          return "El cargo no puede estar vacío";
        }
      }
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
    listarEmpresas();
    listarCargos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <FaBuilding className="text-blue-700" /> 
        Gestión de Cargos por Empresa
      </h1>

      {/* Formulario para crear cargo */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Crear Nuevo Cargo</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={nuevoCargo}
              onChange={(e) => setNuevoCargo(e.target.value)}
              placeholder="Nombre del nuevo cargo"
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
            />
          </div>
          <div className="md:col-span-1">
            <select
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
            >
              <option value="">Seleccionar empresa</option>
              {empresas.map(empresa => (
                <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={crearCargo}
          disabled={!nuevoCargo.trim() || !empresaSeleccionada}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaPlus /> Crear Cargo
        </button>
      </div>

      {/* Lista de cargos organizados por empresa */}
      <div className="space-y-6">
        {cargosPorEmpresa.map(({ empresa, cargos }) => (
          <div key={empresa.idEmpresa} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-800">{empresa.nombre}</h2>
                <p className="text-gray-600 text-sm">
                  {empresa.nit} • {empresa.direccion}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {cargos.length} cargo(s)
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cargos.map((cargo) => (
                <div
                  key={cargo.idCargo}
                  className="border-2 border-blue-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <span className="font-semibold text-gray-800">{cargo.cargo}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editarCargo(cargo)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl transition-colors"
                      title="Editar cargo"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => eliminarCargo(cargo.idCargo)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-colors"
                      title="Eliminar cargo"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cargos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FaBuilding className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No hay cargos registrados para esta empresa</p>
              </div>
            )}
          </div>
        ))}

        {/* Mensaje cuando no hay cargos en ninguna empresa */}
        {cargosPorEmpresa.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaBuilding className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No hay cargos registrados</h3>
            <p className="text-gray-500">Crea el primer cargo usando el formulario superior</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaCargos;