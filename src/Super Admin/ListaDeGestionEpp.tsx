import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaBox, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { getUsuarioFromToken, UsuarioToken } from "../utils/auth";

// Interfaces
interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion: string;
  nit: string;
}

interface Producto {
  nombre: string;
  descripcion: string;
}

interface EPP {
  id: number;
  idEmpresa: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  cedula: string;
  cantidad: number;
  importancia: string;
  estado: boolean;
  fecha: string;
  empresa: Empresa;
  productos: Producto[];
}

const ListaDeGestionEppGeneral: React.FC = () => {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [epps, setEpps] = useState<EPP[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiGestiones = import.meta.env.VITE_API_LISTARGESTIONES;

  useEffect(() => {
    cargarEmpresas();
    cargarGestiones();
  }, []);

  const cargarEmpresas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(apiEmpresas, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    const data = await res.json();
    setEmpresas(data.datos || []);
  };

  const cargarGestiones = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(apiGestiones, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    const data = await res.json();
    let lista = Array.isArray(data) ? data : data.datos;

    const mapped = lista.map((item: any) => ({
      id: item.id,
      idEmpresa: item.idEmpresa,
      idUsuario: item.idUsuario,
      nombre: item.nombre,
      apellido: item.apellido,
      cedula: item.cedula,
      cantidad: item.cantidad,
      importancia: item.importancia,
      estado: item.estado,
      fecha: item.createdAt,
      productos: item.productos || [],
      empresa: item.empresa,
    }));

    setEpps(mapped);
  };

  const formatearFecha = (f: string) => {
    const fecha = new Date(f);
    return fecha.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  };

  // Filtrar empresas según búsqueda
  const empresasFiltradas = empresas.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Buscador */}
      <div className="flex items-center border rounded-lg px-3 py-2 mb-6">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar empresas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      {/* Listado General de Empresas */}
      <div className="space-y-4">
        {empresasFiltradas.map((empresa) => {
          const gestionesEmpresa = epps.filter((e) => e.idEmpresa === empresa.idEmpresa);

          return (
            <div
              key={empresa.idEmpresa}
              className="border rounded-xl shadow bg-white p-5 cursor-pointer"
            >
              <h3
                className="text-xl font-bold text-blue-700"
                onClick={() =>
                  setExpanded(expanded === empresa.idEmpresa ? null : empresa.idEmpresa)
                }
              >
                {empresa.nombre}
              </h3>

              {expanded === empresa.idEmpresa && (
                <div className="mt-4 pl-4 border-l-4 border-blue-400 space-y-3">
                  {gestionesEmpresa.length === 0 ? (
                    <p className="text-gray-500">No hay gestiones registradas.</p>
                  ) : (
                    gestionesEmpresa.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gray-50 rounded-lg shadow-sm flex justify-between"
                      >
                        <div>
                          <p className="font-semibold text-blue-700 flex items-center gap-2">
                            <FaBox /> {item.nombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            Fecha: {formatearFecha(item.fecha)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Importancia: {item.importancia}
                          </p>
                          {item.productos.length > 0 && (
                            <p className="text-xs text-gray-500">
                              Productos: {item.productos.map((p) => p.nombre).join(", ")}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => navigate("/nav/detalleGestionEpp", { state: item })}
                          className="bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListaDeGestionEppGeneral;
