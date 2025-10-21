import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

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

  const listarCargos = async () => {
    const res = await fetch(import.meta.env.VITE_API_CARGOS, {
      headers: { Authorization: `Bearer ${token}` },
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
      headers: { Authorization: `Bearer ${token}` },
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

  return (
    <div>
      {/* Crear Cargo */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={nuevoCargo}
          onChange={(e) => setNuevoCargo(e.target.value)}
          placeholder="Nuevo cargo"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={crearCargo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> Crear
        </button>
      </div>

      {/* Lista de cargos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargos.map((c) => (
          <div
            key={c.idCargo}
            className="bg-white shadow-lg rounded p-4 flex justify-between items-center"
          >
            <span className="font-semibold">{c.cargo}</span>
            <div className="flex gap-2">
              <button
                onClick={() => editarCargo(c)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl"
              >
              <FaEdit />
              </button>
              <button
                onClick={() => eliminarCargo(c.idCargo)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
               >
              <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CargosPage2;
