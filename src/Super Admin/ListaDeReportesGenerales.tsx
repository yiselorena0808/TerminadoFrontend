import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHardHat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaFileExcel
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import * as XLSX from 'xlsx';

interface Reporte {
  id_reporte: number;
  id_usuario: number;
  nombre_usuario: string;
  cargo: string;
  cedula: number | string;
  fecha: string | null;
  lugar: string;
  descripcion: string;
  imagen: string;
  archivos: string;
  estado: string;
  id_empresa: number;
}

interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion?: string;
  nit?: string;
  estado?: boolean;
}

const ListaDeReportesGenerales: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaAbierta, setEmpresaAbierta] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [excelLoading, setExcelLoading] = useState(false);

  const apiListarReportes = import.meta.env.VITE_API_REPORTESGENERALES;
  const apiListarEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
  }, []);

  /** 🔵 Obtener empresas */
  const obtenerEmpresas = async () => {
    try {
      const res = await fetch(apiListarEmpresas, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setEmpresas(data.datos || []);
    } catch (error) {
      console.error("Error cargando empresas:", error);
    }
  };

  /** 🟢 Obtener reportes */
  const obtenerListas = async () => {
    try {
      const res = await fetch(apiListarReportes, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const lista = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.datos)
        ? data.datos
        : Array.isArray(data)
        ? data
        : [];

      const reportes: Reporte[] = lista.map((r: any) => ({
        id_reporte: r.idReporte ?? r.id_reporte,
        id_usuario: r.idUsuario ?? r.id_usuario,
        nombre_usuario: r.nombreUsuario ?? r.nombre_usuario,
        cargo: r.cargo,
        cedula: r.cedula,
        fecha: r.fecha,
        lugar: r.lugar,
        descripcion: r.descripcion,
        imagen: r.imagen ?? "",
        archivos: r.archivos ?? "",
        estado: r.estado,
        id_empresa: r.idEmpresa ?? r.id_empresa,
      }));

      setListas(reportes);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  useEffect(() => {
    obtenerEmpresas();
    obtenerListas();
  }, []);

  /** Navegar */
  const abrirDetalle = (item: Reporte) => {
    navigate("/nav/MidetalleRepo", { state: item });
  };

  /** Formato fecha */
  const formatearFecha = (fechaIso: string | null) => {
    if (!fechaIso) return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /** PDF */
  const descargarPDF = (reporte: Reporte) => {
    const doc = new jsPDF();
    doc.text("REPORTE SST", 20, 20);
    doc.text(`Usuario: ${reporte.nombre_usuario}`, 20, 40);
    doc.text(`Fecha: ${formatearFecha(reporte.fecha)}`, 20, 50);
    doc.text(`Lugar: ${reporte.lugar}`, 20, 60);
    doc.text(`Estado: ${reporte.estado}`, 20, 70);
    doc.text(`Descripción: ${reporte.descripcion}`, 20, 80, { maxWidth: 170 });
    doc.save(`Reporte_${reporte.id_reporte}.pdf`);
  };

  /** Agrupar reportes por empresa */
  const reportesPorEmpresa = listas.reduce((acc, r) => {
    if (!acc[r.id_empresa]) acc[r.id_empresa] = [];
    acc[r.id_empresa].push(r);
    return acc;
  }, {} as Record<number, Reporte[]>);

  /** Obtener nombre real empresa */
  const getNombreEmpresa = (id: number) => {
    const emp = empresas.find((e) => e.idEmpresa === id);
    return emp ? emp.nombre : `Empresa ${id}`;
  };

  /** Color estado */
  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Revisado":
        return "bg-blue-100 text-blue-800";
      case "Finalizado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /** Abrir / cerrar empresa */
  const toggleEmpresa = (id: number) => {
    setEmpresaAbierta((prev) => (prev === id ? null : id));
  };

  /** Filtrar empresas con reportes */
  const empresasConReportes = empresas.filter(empresa => 
    (reportesPorEmpresa[empresa.idEmpresa] || []).length > 0
  );

  /** Filtrar empresas por búsqueda */
  const empresasFiltradas = empresasConReportes.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ✅ NUEVA FUNCIÓN CON SHEETJS - SIN CORS
  const descargarExcel = () => {
    try {
      setExcelLoading(true);

      if (listas.length === 0) {
        alert("No hay reportes para exportar");
        return;
      }

      // Preparar datos para Excel
      const datosExcel = listas.map(reporte => ({
        "ID Reporte": reporte.id_reporte,
        "Usuario": reporte.nombre_usuario,
        "Cargo": reporte.cargo || "No especificado",
        "Cédula": reporte.cedula || "No especificada",
        "Fecha": formatearFecha(reporte.fecha),
        "Lugar": reporte.lugar,
        "Estado": reporte.estado,
        "Descripción": reporte.descripcion || "Sin descripción",
        "Empresa": getNombreEmpresa(reporte.id_empresa)
      }));

      // Crear workbook y worksheet
      const worksheet = XLSX.utils.json_to_sheet(datosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes SST");

      // Ajustar el ancho de las columnas
      const colWidths = [
        { wch: 10 },  // ID Reporte
        { wch: 20 },  // Usuario
        { wch: 15 },  // Cargo
        { wch: 12 },  // Cédula
        { wch: 20 },  // Fecha
        { wch: 15 },  // Lugar
        { wch: 12 },  // Estado
        { wch: 40 },  // Descripción
        { wch: 25 }   // Empresa
      ];
      worksheet['!cols'] = colWidths;

      // Generar nombre del archivo con fecha
      const fecha = new Date().toISOString().split('T')[0];
      const fileName = `reportes_sst_${fecha}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, fileName);

      console.log("Excel de reportes generado exitosamente");

    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error al generar el archivo Excel");
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
          <FaHardHat className="text-blue-700" /> 
          Reportes por Empresa
        </h1>
        <button
          onClick={() => navigate("/nav/CrearReporteSA")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-colors"
        >
          <FaPlus /> Nuevo Reporte
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
                placeholder="Buscar empresa..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-600 rounded-xl focus:outline-none focus:border-blue-700"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* BOTÓN EXCEL MEJORADO */}
        <button
          onClick={descargarExcel}
          disabled={excelLoading || listas.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg"
        >
          {excelLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
              <FaFileExcel /> Descargar Excel
            </>
          )}
        </button>

        {/* LISTA DE EMPRESAS CON REPORTES */}
        {listas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No hay reportes registrados
            </h3>
            <p className="text-gray-500">
              Crea el primer reporte usando el botón "Nuevo Reporte"
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {empresasFiltradas.map((empresa) => {
              const empresaId = empresa.idEmpresa;
              const reportes = reportesPorEmpresa[empresaId] || [];
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
                          {reportes.length} reporte(s)
                        </span>
                        {abierta ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* REPORTES DE LA EMPRESA */}
                  {abierta && (
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportes.map((item) => (
                          <div
                            key={item.id_reporte}
                            className="border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg text-gray-800">
                                {item.nombre_usuario}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                                  item.estado
                                )}`}
                              >
                                {item.estado}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500 mb-3">
                              {formatearFecha(item.fecha)}
                            </p>

                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                              <FaMapMarkerAlt className="text-yellow-500" />
                              <span className="text-sm">{item.lugar}</span>
                            </div>

                            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                              {item.descripcion}
                            </p>

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirDetalle(item);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold"
                              >
                                Ver Detalle
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  descargarPDF(item);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold"
                              >
                                <FaFilePdf /> PDF
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {reportes.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FaExclamationTriangle className="text-4xl mx-auto mb-2 text-gray-300" />
                          <p>No hay reportes para esta empresa</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Mensaje cuando no hay empresas con reportes */}
        {listas.length > 0 && empresasFiltradas.length === 0 && (
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

export default ListaDeReportesGenerales;