import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaBuilding,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

// ----------- TIPOS -------------
interface ActividadLudica {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreActividad: string;
  fechaActividad: string | null;
  descripcion: string;
  imagenVideo: string;
  archivoAdjunto: string;
  idEmpresa: number;
  createdAt: string;
  updatedAt: string;
}

interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion?: string;
  nit?: string;
  estado?: boolean;
}

// ----------- COMPONENTE -------------
const ListaDeActividadesGenerales: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [empresaAbierta, setEmpresaAbierta] = useState<number | null>(null);

  const apiListarAct = import.meta.env.VITE_API_ACTIVIDADESGENERALES;
  const apiListarEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;

  // -------------------------------------------
  // 🔵 CARGAR DATOS: actividades + empresas
  // -------------------------------------------
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      const usuario: UsuarioToken | null = getUsuarioFromToken();

      if (!token || !usuario) throw new Error("Usuario no autenticado");

      // 👉 Fetch actividades
      const resAct = await fetch(apiListarAct, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resAct.ok) throw new Error("Error al obtener actividades");
      const dataAct = await resAct.json();

      const listaActividades = Array.isArray(dataAct.data)
        ? dataAct.data
        : Array.isArray(dataAct.datos)
        ? dataAct.datos
        : Array.isArray(dataAct)
        ? dataAct
        : [];

      setActividades(listaActividades);

      // 👉 Fetch empresas (para mostrar nombre)
      const resEmp = await fetch(apiListarEmpresas, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resEmp.ok) throw new Error("Error al obtener empresas");

      const dataEmp = await resEmp.json();

      const listaEmpresas = Array.isArray(dataEmp.datos)
        ? dataEmp.datos
        : Array.isArray(dataEmp.data)
        ? dataEmp.data
        : [];

      setEmpresas(listaEmpresas);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // -------------------------------------------
  // 🔵 BUSQUEDA GLOBAL
  // -------------------------------------------
  const actividadesFiltradas = actividades.filter(
    (act) =>
      act.nombreActividad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // -------------------------------------------
  // 🔵 AGRUPAR POR EMPRESA
  // -------------------------------------------
  const actividadesPorEmpresa = actividadesFiltradas.reduce(
    (acc, act) => {
      if (!acc[act.idEmpresa]) acc[act.idEmpresa] = [];
      acc[act.idEmpresa].push(act);
      return acc;
    },
    {} as Record<number, ActividadLudica[]>
  );

  // -------------------------------------------
  // 🔵 OBTENER NOMBRE DE EMPRESA POR ID
  // -------------------------------------------
  const obtenerNombreEmpresa = (idEmpresa: number) => {
    return empresas.find((emp) => emp.idEmpresa === idEmpresa)?.nombre || "Empresa desconocida";
  };

  // -------------------------------------------
  // TOGGLE EMPRESA
  // -------------------------------------------
  const toggleEmpresa = (id: number) => {
    setEmpresaAbierta((prev) => (prev === id ? null : id));
  };

  // -------------------------------------------
  // DESCARGAR PDF
  // -------------------------------------------
  const descargarPDF = (act: ActividadLudica) => {
    const doc = new jsPDF();
    const azul = [25, 86, 212];
    const blanco = [255, 255, 255];

    doc.setFillColor(...azul);
    doc.rect(0, 0, 220, 35, "F");
    doc.setTextColor(...blanco);
    doc.setFontSize(18);
    doc.text("Reporte de Actividad Lúdica", 20, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let y = 50;

    doc.text(`Actividad: ${act.nombreActividad}`, 20, y);
    y += 10;

    doc.text(
      `Fecha: ${
        act.fechaActividad
          ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
          : "Sin fecha"
      }`,
      20,
      y
    );
    y += 10;

    doc.text("Descripción:", 20, y);
    y += 8;
    doc.text(act.descripcion || "Sin descripción", 20, y, { maxWidth: 170 });
    y += 30;

    doc.text(`Usuario: ${act.nombreUsuario}`, 20, y);
    y += 10;

    doc.text(`ID Actividad: ${act.id}`, 20, y);
    y += 10;

    doc.text(`Empresa: ${obtenerNombreEmpresa(act.idEmpresa)}`, 20, y);

    doc.save(`actividad_${act.id}.pdf`);
  };

  // -------------------------------------------
  // 🔵 FILTRAR EMPRESAS CON ACTIVIDADES
  // -------------------------------------------
  const empresasConActividades = empresas.filter(empresa => 
    (actividadesPorEmpresa[empresa.idEmpresa] || []).length > 0
  );

  // -------------------------------------------
  // 🔵 FILTRAR EMPRESAS POR BÚSQUEDA
  // -------------------------------------------
  const empresasFiltradas = empresasConActividades.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const irCrear = () => navigate("/nav/crearActLudica");

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
          <FaUserTie className="text-blue-700" /> 
          Actividades Lúdicas por Empresa
        </h1>
        <button
          onClick={irCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-colors"
        >
          <FaPlus /> Nueva Actividad
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
                placeholder="Buscar actividad, descripción o usuario..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-red-300" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Error al cargar</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {empresasFiltradas.map((empresa) => {
              const empresaId = empresa.idEmpresa;
              const actividadesEmpresa = actividadesPorEmpresa[empresaId] || [];
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
                            {empresa.nit} • {empresa.direccion || "Sin dirección"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {actividadesEmpresa.length} actividad(es)
                        </span>
                        {abierta ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVIDADES DE LA EMPRESA */}
                  {abierta && (
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {actividadesEmpresa.map((actividad) => (
                          <div
                            key={actividad.id}
                            className="border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-600" />
                                {actividad.nombreActividad}
                              </h3>
                            </div>

                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <FaUserTie className="text-green-500" />
                                <span>{actividad.nombreUsuario}</span>
                              </p>
                              
                              <p className="text-sm text-gray-500">
                                {actividad.fechaActividad
                                  ? new Date(actividad.fechaActividad).toLocaleDateString("es-CO")
                                  : "Sin fecha"}
                              </p>
                            </div>

                            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                              {actividad.descripcion || "Sin descripción"}
                            </p>

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/nav/detalleActLudica", { state: actividad });
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold flex items-center gap-2"
                              >
                                <FaEye /> Ver Detalle
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  descargarPDF(actividad);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold"
                              >
                                <FaFilePdf /> PDF
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {actividadesEmpresa.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FaCalendarAlt className="text-4xl mx-auto mb-2 text-gray-300" />
                          <p>No hay actividades para esta empresa</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Mensaje cuando no hay actividades */}
        {!cargando && !error && actividades.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaCalendarAlt className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No hay actividades registradas
            </h3>
            <p className="text-gray-500">
              Crea la primera actividad usando el botón "Nueva Actividad"
            </p>
          </div>
        )}

        {/* Mensaje cuando no hay empresas con actividades */}
        {!cargando && !error && actividades.length > 0 && empresasFiltradas.length === 0 && (
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

export default ListaDeActividadesGenerales;