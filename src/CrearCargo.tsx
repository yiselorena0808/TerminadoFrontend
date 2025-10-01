import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Cargo {
  id_cargo: number;
  cargo: string;
}

const CargosPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [nuevoCargo, setNuevoCargo] = useState("");

  const listarCargos = async () => {
    const res = await fetch(import.meta.env.VITE_API_CARGOS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCargos(await res.json());
  };

  const crearCargo = async () => {
    if (!nuevoCargo.trim()) return;
    await fetch(import.meta.env.VITE_API_CREARCARGO, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cargo: nuevoCargo }),
    });
    setNuevoCargo("");
    listarCargos();
    Swal.fire("Éxito", "Cargo creado correctamente", "success");
  };

  const eliminarCargo = async (id: number) => {
    const confirm = await Swal.fire({ title: "¿Eliminar cargo?", showCancelButton: true });
    if (!confirm.isConfirmed) return;
    await fetch(`${import.meta.env.VITE_API_ELIMINARCARGO}${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    listarCargos();
    Swal.fire("Eliminado", "Cargo eliminado correctamente", "success");
  };

  useEffect(() => { listarCargos(); }, []);

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
        <button onClick={crearCargo} className="bg-green-600 text-white px-4 rounded">Crear</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargos.map((c) => (
          <div key={c.id_cargo} className="bg-white shadow-lg rounded p-4 flex justify-between items-center">
            <span className="font-semibold">{c.cargo}</span>
            <button 
              onClick={() => eliminarCargo(c.id_cargo)} 
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CargosPage;
