import React, { useEffect, useState } from "react";

interface Cargo {
  id_cargo: number;
  cargo: string;
}

export default function GestionEppForm() {
  const apiCrear = import.meta.env.VITE_API_CREARGESTION;
  const apiCargos = import.meta.env.VITE_API_CARGOS;

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [formData, setFormData] = useState({
    cedula: "",
    id_cargo: 0,       
    productos: "",
    importancia: "",
    estado: "",
    fecha_creacion: new Date().toISOString().split("T")[0],
    nombre: "",
    apellido: "",
    id_empresa: 0,    
  });

  // Extraer datos del JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const partes = (decoded.nombre || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          nombre: partes[0] || "",
          apellido: partes.slice(1).join(" ") || "",
          id_empresa: Number(decoded.id_empresa) || 0, 
        }));
      } catch (error) {
        console.error("Error decodificando token", error);
      }
    }
  }, []);


  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const res = await fetch(apiCargos, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setCargos(data);
      } catch (err) {
        console.error("Error cargando cargos", err);
      }
    };
    fetchCargos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_cargo" ? Number(value) : value, 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

 
    const payload = {
      ...formData,
      id_empresa: Number(formData.id_empresa),
      id_cargo: Number(formData.id_cargo),
    };

    try {
      const response = await fetch(apiCrear, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      alert(data.mensaje || "Error al crear gestión");
    } catch (err) {
      console.error("Error enviando formulario:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Crear Gestión EPP</h2>

      {/* Datos del JWT */}
      <div>
        <label className="block">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block">ID Empresa</label>
        <input
          type="text"
          name="id_empresa"
          value={formData.id_empresa}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {/* Campos editables */}
      <div>
        <label className="block">Cédula</label>
        <input
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block">Cargo</label>
        <select
          name="id_cargo"
          value={formData.id_cargo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value={0}>Seleccione un cargo</option>
          {cargos.map((c) => (
            <option key={c.id_cargo} value={c.id_cargo}>
              {c.cargo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block">Productos</label>
        <input
          type="text"
          name="productos"
          value={formData.productos}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block">Importancia</label>
        <select
          name="importancia"
          value={formData.importancia}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccione</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div>
        <label className="block">Estado</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccione</option>
          <option value="activo">Pendiente</option>
          <option value="inactivo">Revisado</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      <div>
        <label className="block">Fecha de creación</label>
        <input
          type="date"
          name="fecha_creacion"
          value={formData.fecha_creacion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Guardar
      </button>
    </form>
  );
}
