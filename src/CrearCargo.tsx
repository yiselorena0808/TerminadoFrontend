import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUsuarioFromToken, type UsuarioToken } from "./utils/auth";

interface Cargo {
  idCargo: number;
  cargo: string;
  idEmpresa: number;
}

const CargosPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const usuario: UsuarioToken | null = getUsuarioFromToken();

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [nuevoCargo, setNuevoCargo] = useState("");

  const listarCargos = async () => {
    const res = await fetch(import.meta.env.VITE_API_CARGOS, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      Swal.fire("Sesión expirada", "Vuelve a iniciar sesión", "warning");
      return;
    }

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

    if (!res.ok) {
      Swal.fire("Error", "No se pudo crear el cargo", "error");
      return;
    }

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

    if (!res.ok) {
      Swal.fire("Error", "No se pudo eliminar el cargo", "error");
      return;
    }

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

    if (nuevo && nuevo.trim()) {
      const res = await fetch(`${import.meta.env.VITE_API_ACTUALIZARCARGO}${cargo.idCargo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cargo: nuevo }),
      });

      if (!res.ok) {
        Swal.fire("Error", "No se pudo actualizar el cargo", "error");
        return;
      }

      listarCargos();
      Swal.fire("Actualizado", "Cargo modificado correctamente", "success");
    }
  };

  useEffect(() => {
    listarCargos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Gestión de Cargos</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={nuevoCargo}
          onChange={(e) => setNuevoCargo(e.target.value)}
          placeholder="Nuevo cargo"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={crearCargo}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Crear
        </button>
      </div>

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
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarCargo(c.idCargo)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CargosPage;
