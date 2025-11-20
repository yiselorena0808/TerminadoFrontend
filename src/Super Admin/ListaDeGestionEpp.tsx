import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBox,
  FaEye,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaExclamationTriangle,
  FaUser,
  FaCalendar,
  FaClipboardList
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const [empresaAbierta, setEmpresaAbierta] = useState<number | null>(null);

  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiGestiones = import.meta.env.VITE_API_LISTARGESTIONES_GENERAL;

  
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
    return fecha.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // -------------------------------------------
  // 🔵 BUSQUEDA GLOBAL
  // -------------------------------------------
  const gestionesFiltradas = epps.filter((g) =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    g.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    g.cedula.toLowerCase().includes(busqueda.toLowerCase())
  );

  // -------------------------------------------
  // 🔵 AGRUPAR POR EMPRESA
  // -------------------------------------------
  const gestionesPorEmpresa = gestionesFiltradas.reduce(
    (acc, gest) => {
      if (!acc[gest.idEmpresa]) acc[gest.idEmpresa] = [];
      acc[gest.idEmpresa].push(gest);
      return acc;
    },
    {} as Record<number, EPP[]>
  );

  // -------------------------------------------
  // 🔵 FILTRAR EMPRESAS CON GESTIONES
  // -------------------------------------------
  const empresasConGestiones = empresas.filter(empresa => 
    (gestionesPorEmpresa[empresa.idEmpresa] || []).length > 0
  );

  // -------------------------------------------
  // 🔵 FILTRAR EMPRESAS POR BÚSQUEDA
  // -------------------------------------------
  const empresasFiltradas = empresasConGestiones.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleEmpresa = (id: number) => {
    setEmpresaAbierta((prev) => (prev === id ? null : id));
  };

  const obtenerNombreEmpresa = (id: number) => {
    return empresas.find((emp) => emp.idEmpresa === id)?.nombre || "Empresa desconocida";
  };

  const irCrear = () => navigate("/nav/creargestionEpp");

  // Color para importancia
  const getImportanciaColor = (importancia: string) => {
    switch (importancia.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
          <FaBox className="text-blue-700" /> 
          Gestión EPP por Empresa
        </h1>
        <button
          onClick={irCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-colors"
        >
          <FaPlus /> Nueva Gestión
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="space-y-6">
        {/* BUSCADOR */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, cédula o empresa..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* LISTADO POR EMPRESA */}
        {epps.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaBox className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No hay gestiones EPP registradas
            </h3>
            <p className="text-gray-500">
              Crea la primera gestión usando el botón "Nueva Gestión"
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {empresasFiltradas.map((empresa) => {
              const empresaId = empresa.idEmpresa;
              const gestiones = gestionesPorEmpresa[empresaId] || [];
              const abierta = empresaAbierta === empresaId;

              return (
                <div key={empresaId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* ENCABEZADO DE EMPRESA */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-blue-50 transition-colors border-b-2 border-blue-200"
                    onClick={() => toggleEmpresa(empresaId)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <FaBuilding className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-blue-800">{empresa.nombre}</h2>
                          <p className="text-gray-600 text-sm">
                            {empresa.nit} • {empresa.direccion}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {gestiones.length} gestión(es)
                        </span>
                        {abierta ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* GESTIONES EPP DE LA EMPRESA */}
                  {abierta && (
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gestiones.map((gestion) => (
                          <div
                            key={gestion.id}
                            className="border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <FaUser className="text-blue-600" />
                                {gestion.nombre} {gestion.apellido}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getImportanciaColor(gestion.importancia)}`}>
                                {gestion.importancia}
                              </span>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaClipboardList className="text-green-500" />
                                <span>Cédula: {gestion.cedula}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaBox className="text-orange-500" />
                                <span>Cantidad: {gestion.cantidad}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaCalendar className="text-purple-500" />
                                <span>{formatearFecha(gestion.fecha)}</span>
                              </div>
                            </div>

                            {/* Productos */}
                            {gestion.productos.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Productos:</p>
                                <div className="flex flex-wrap gap-1">
                                  {gestion.productos.slice(0, 3).map((producto, index) => (
                                    <span 
                                      key={index}
                                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                    >
                                      {producto.nombre}
                                    </span>
                                  ))}
                                  {gestion.productos.length > 3 && (
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                      +{gestion.productos.length - 3} más
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/nav/detalleGestionEpp", { state: gestion });
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold flex items-center gap-2"
                              >
                                <FaEye /> Ver Detalle
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {gestiones.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FaBox className="text-4xl mx-auto mb-2 text-gray-300" />
                          <p>No hay gestiones EPP para esta empresa</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Mensaje cuando no hay empresas con gestiones */}
        {epps.length > 0 && empresasFiltradas.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaSearch className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No se encontraron empresas
            </h3>
            <p className="text-gray-500">
              No hay empresas que coincidan con tu búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaDeGestionEppGeneral;