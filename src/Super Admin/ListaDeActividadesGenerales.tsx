import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaFolder,
  FaFolderOpen,
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
}

// ----------- COMPONENTE -------------
const ListaDeActividadesGenerales: React.FC = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<ActividadLudica[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [carpetasAbiertas, setCarpetasAbiertas] = useState<number[]>([]);

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
      act.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
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
  // 🔵 ABRIR CARPETAS AUTOMÁTICAMENTE AL BUSCAR
  // -------------------------------------------
  useEffect(() => {
    const ids = Object.keys(actividadesPorEmpresa).map(Number);
    setCarpetasAbiertas(ids);
  }, [busqueda, actividades]);

  // -------------------------------------------
  // TOGGLE CARPETA
  // -------------------------------------------
  const toggleCarpeta = (empresaId: number) => {
    if (carpetasAbiertas.includes(empresaId)) {
      setCarpetasAbiertas(carpetasAbiertas.filter((id) => id !== empresaId));
    } else {
      setCarpetasAbiertas([...carpetasAbiertas, empresaId]);
    }
  };

  // -------------------------------------------
  // 🔵 OBTENER NOMBRE DE EMPRESA POR ID
  // -------------------------------------------
  const obtenerNombreEmpresa = (idEmpresa: number) => {
    return empresas.find((emp) => emp.idEmpresa === idEmpresa)?.nombre || "Empresa desconocida";
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

  const irCrear = () => navigate("/nav/crearActLudica");

  return (
    <div className="min-h-screen">
      {/* Encabezado */}
      <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 mb-6 flex items-center gap-3">
        <FaUserTie className="text-4xl text-yellow-400" />
        <div>
          <h2 className="text-2xl font-bold">SST - Actividades Lúdicas</h2>
          <p className="text-gray-300">Visualiza todas las actividades</p>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 bg-white border border-gray-200 max-w-7xl mx-auto">
        {/* Buscador */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={irCrear}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition flex items-center gap-2"
          >
            <FaPlus /> Nueva Actividad
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(actividadesPorEmpresa).map(([idEmpresa, acts]) => {
              const abierta = carpetasAbiertas.includes(Number(idEmpresa));
              const nombreEmpresa = obtenerNombreEmpresa(Number(idEmpresa));

              return (
                <div key={idEmpresa} className="border rounded-xl shadow p-4">
                  {/* Carpeta */}
                  <button
                    onClick={() => toggleCarpeta(Number(idEmpresa))}
                    className="flex items-center gap-3 text-xl font-bold text-blue-700 w-full"
                  >
                    {abierta ? (
                      <FaFolderOpen className="text-yellow-500" />
                    ) : (
                      <FaFolder className="text-yellow-500" />
                    )}
                    {nombreEmpresa}
                  </button>

                  {/* Listado */}
                  {abierta && (
                    <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {acts.map((act) => (
                        <div
                          key={act.id}
                          className="p-6 rounded-2xl border shadow bg-gray-50 hover:shadow-md transition"
                        >
                          <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                            <FaCalendarAlt />
                            {act.nombreActividad}
                          </h3>

                          <p className="text-sm">
                            <b>Usuario:</b> {act.nombreUsuario}
                          </p>
                          <p className="text-sm">
                            <b>Fecha:</b>{" "}
                            {act.fechaActividad
                              ? new Date(act.fechaActividad).toLocaleDateString("es-CO")
                              : "Sin fecha"}
                          </p>

                          <p className="text-xs text-gray-700 mt-2">
                            {act.descripcion.length > 80
                              ? act.descripcion.substring(0, 80) + "..."
                              : act.descripcion}
                          </p>

                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              onClick={() =>
                                navigate("/nav/detalleActLudica", { state: act })
                              }
                              className="bg-blue-700 text-white px-3 py-1 text-sm rounded flex items-center gap-1"
                            >
                              <FaEye /> Abrir
                            </button>

                            <button
                              onClick={() => descargarPDF(act)}
                              className="bg-red-500 text-white px-3 py-1 text-sm rounded flex items-center gap-1"
                            >
                              <FaFilePdf /> PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaDeActividadesGenerales;
