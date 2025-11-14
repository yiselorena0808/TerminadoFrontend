import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHardHat,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

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
}

const ListaDeReportesGenerales: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Reporte[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaAbierta, setEmpresaAbierta] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [busqueda, setBusqueda] = useState("");

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
        return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "Revisado":
        return "bg-blue-100 text-blue-800 border-blue-400";
      case "Finalizado":
        return "bg-green-100 text-green-800 border-green-400";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  /** Abrir / cerrar empresa */
  const toggleEmpresa = (id: number) => {
    setEmpresaAbierta((prev) => (prev === id ? null : id));
  };

  /** Filtrar empresas */
  const empresasFiltradas = empresas.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}
      <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaHardHat className="text-4xl" />
          <div>
            <h2 className="text-3xl font-bold">SST - Reportes por Empresa</h2>
            <p>Organización automática por carpetas</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {/* 🔎 BUSCADOR */}
        <div className="mb-6 flex items-center gap-3 bg-gray-100 p-3 rounded-xl border">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar empresa..."
            className="w-full p-2 bg-transparent outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {listas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            No hay reportes registrados
          </p>
        ) : (
          <div className="space-y-8">
            {empresasFiltradas.map((empresa) => {
              const empresaId = empresa.idEmpresa;
              const reportes = reportesPorEmpresa[empresaId] || [];
              const abierta = empresaAbierta === empresaId;

              return (
                <div
                  key={empresaId}
                  className="border rounded-xl shadow-xl bg-gray-50 cursor-pointer"
                  onClick={() => toggleEmpresa(empresaId)}
                >
                  {/* ENCABEZADO SIN FLECHAS */}
                  <div className="w-full text-left p-6 hover:bg-gray-100 transition">
                    <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                      📁 {empresa.nombre}
                    </h3>
                  </div>

                  {abierta && (
                    <div className="p-6 border-t">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportes.map((item) => (
                          <div
                            key={item.id_reporte}
                            className="p-6 rounded-xl border shadow bg-white hover:shadow-lg transition"
                          >
                            <h4 className="font-bold text-lg flex items-center gap-2">
                              {item.nombre_usuario}
                              <span
                                className={`px-2 py-1 text-xs rounded-full border ${getBadgeColor(
                                  item.estado
                                )}`}
                              >
                                {item.estado}
                              </span>
                            </h4>

                            <p className="text-sm text-gray-600">
                              {formatearFecha(item.fecha)}
                            </p>

                            <p className="text-gray-700 mt-2">
                              <FaMapMarkerAlt className="inline mr-2 text-yellow-600" />
                              {item.lugar}
                            </p>

                            <p className="text-gray-600 text-sm mt-2 mb-4">
                              {item.descripcion}
                            </p>

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirDetalle(item);
                                }}
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                              >
                                Abrir
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  descargarPDF(item);
                                }}
                                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                              >
                                <FaFilePdf /> PDF
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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

export default ListaDeReportesGenerales;
