import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaCarSide,
  FaSearch,
  FaPlus,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaCalendar,
  FaTachometerAlt,
  FaFileExcel
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import * as XLSX from 'xlsx';

interface ListaChequeo {
  id: number;
  id_usuario: number;
  usuario_nombre: string;
  fecha: string;
  hora: string;
  modelo: string;
  marca: string;
  soat: string;
  tecnico: string;
  kilometraje: string;
  placa: string;
  observaciones: string;
  id_empresa: number;
}

interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion?: string;
  nit?: string;
  estado?: boolean;
}

const ListasChequeoGenerales: React.FC = () => {
  const navigate = useNavigate();

  const [listas, setListas] = useState<ListaChequeo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaAbierta, setEmpresaAbierta] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);

  const apiListar = import.meta.env.VITE_API_CHEQUEOGENERALES;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const token = localStorage.getItem("token");

  // ✔ Cargar usuario desde token
  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
  }, []);

  // ✔ Obtener empresas
  const obtenerEmpresas = async () => {
    try {
      const res = await fetch(apiEmpresas, {
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

  // ✔ Obtener listas de chequeo
  const obtenerListas = async () => {
    try {
      const res = await fetch(apiListar, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const lista = Array.isArray(data.datos) ? data.datos : [];

      const formateada: ListaChequeo[] = lista.map((r: any) => ({
        id: r.id,
        id_usuario: r.idUsuario,
        usuario_nombre: r.usuarioNombre,
        fecha: r.fecha,
        hora: r.hora,
        modelo: r.modelo,
        marca: r.marca,
        soat: r.soat,
        tecnico: r.tecnico,
        kilometraje: r.kilometraje,
        placa: r.placa,
        observaciones: r.observaciones,
        id_empresa: r.idEmpresa,
      }));

      setListas(formateada);
    } catch (error) {
      console.error("Error cargando listas:", error);
    }
  };

  useEffect(() => {
    obtenerEmpresas();
    obtenerListas();
  }, []);

  // ✔ Obtener nombre empresa
  const getNombreEmpresa = (id: number) => {
    const emp = empresas.find((e) => e.idEmpresa === id);
    return emp ? emp.nombre : `Empresa ${id}`;
  };

  // ✔ Agrupar por empresa
  const listasPorEmpresa = listas.reduce((acc, item) => {
    if (!acc[item.id_empresa]) acc[item.id_empresa] = [];
    acc[item.id_empresa].push(item);
    return acc;
  }, {} as Record<number, ListaChequeo[]>);

  // ✔ Filtrar empresas con listas de chequeo
  const empresasConListas = empresas.filter(empresa => 
    (listasPorEmpresa[empresa.idEmpresa] || []).length > 0
  );

  // ✔ Filtrar por nombre de empresa
  const empresasFiltradas = empresasConListas.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirDetalle = (item: ListaChequeo) => {
    navigate("/nav/detalleListasChequeo", { state: item });
  };

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const descargarPDF = (lista: ListaChequeo) => {
    const doc = new jsPDF();
    doc.text("LISTA DE CHEQUEO", 20, 20);
    doc.text(`Usuario: ${lista.usuario_nombre}`, 20, 40);
    doc.text(`Fecha: ${formatearFecha(lista.fecha)} ${lista.hora}`, 20, 50);
    doc.text(`Marca: ${lista.marca}`, 20, 60);
    doc.text(`Modelo: ${lista.modelo}`, 20, 70);
    doc.text(`Técnico: ${lista.tecnico}`, 20, 80);
    doc.save(`lista_${lista.id}.pdf`);
  };

  const toggleEmpresa = (id: number) => {
    setEmpresaAbierta((prev) => (prev === id ? null : id));
  };

  const irCrear = () => navigate("/nav/CrearListaChequeoSA");

  // ✅ NUEVA FUNCIÓN CON SHEETJS - SIN CORS
  const descargarExcel = () => {
    try {
      setExcelLoading(true);

      if (listas.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      // Preparar datos para Excel
      const datosExcel = listas.map(item => ({
        "ID": item.id,
        "Usuario": item.usuario_nombre,
        "Fecha": formatearFecha(item.fecha),
        "Hora": item.hora,
        "Vehículo": `${item.marca} ${item.modelo}`,
        "Placa": item.placa,
        "Kilometraje": `${item.kilometraje} km`,
        "Técnico": item.tecnico,
        "SOAT": item.soat,
        "Observaciones": item.observaciones || "Sin observaciones",
        "Empresa": getNombreEmpresa(item.id_empresa)
      }));

      // Crear workbook y worksheet
      const worksheet = XLSX.utils.json_to_sheet(datosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Listas de Chequeo");

      // Generar nombre del archivo con fecha
      const fecha = new Date().toISOString().split('T')[0];
      const fileName = `listas_chequeo_${fecha}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, fileName);

      console.log("Excel generado exitosamente");

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
          <FaCarSide className="text-blue-700" /> 
          Listas de Chequeo por Empresa
        </h1>
        <button
          onClick={irCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-colors"
        >
          <FaPlus /> Nueva Lista
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

        {/* LISTADO POR EMPRESA */}
        {listas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaCarSide className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No hay listas de chequeo registradas
            </h3>
            <p className="text-gray-500">
              Crea la primera lista usando el botón "Nueva Lista"
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {empresasFiltradas.map((empresa) => {
              const empresaId = empresa.idEmpresa;
              const items = listasPorEmpresa[empresaId] || [];
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
                          {items.length} lista(s)
                        </span>
                        {abierta ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* LISTAS DE CHEQUEO DE LA EMPRESA */}
                  {abierta && (
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <FaCarSide className="text-blue-600" />
                                {item.usuario_nombre}
                              </h3>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCalendar className="text-green-500" />
                                <span>
                                  {formatearFecha(item.fecha)} - {item.hora}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaUser className="text-purple-500" />
                                <span>{item.tecnico}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaTachometerAlt className="text-orange-500" />
                                <span>Km: {item.kilometraje}</span>
                              </div>
                            </div>

                            <div className="text-sm text-gray-700 mb-4">
                              <p><strong>Vehículo:</strong> {item.marca} {item.modelo}</p>
                              <p><strong>Placa:</strong> {item.placa}</p>
                              <p><strong>SOAT:</strong> {item.soat}</p>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              <strong>Observaciones:</strong> {item.observaciones || "Sin observaciones"}
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

                      {items.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FaCarSide className="text-4xl mx-auto mb-2 text-gray-300" />
                          <p>No hay listas de chequeo para esta empresa</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Mensaje cuando no hay empresas con listas */}
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

export default ListasChequeoGenerales;