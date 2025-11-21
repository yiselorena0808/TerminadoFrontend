import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaHardHat,
  FaExclamationTriangle,
  FaBox,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import jsPDF from "jspdf";

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
}

interface Empresa {
  nombre: string;
  direccion: string;
  nit: string;
}

interface Area {
  nombre: string;
  descripcion: string;
  codigo: string;
}

interface EPP {
  id: number;
  idUsuario: number;
  nombre: string;
  apellido: string | null;
  cedula: string;
  cantidad: number;
  importancia: string;
  estado: boolean;
  empresa: Empresa;
  area: Area;
  fecha: string;
  productos: Producto[];
}

const GestionEPP: React.FC = () => {
  const navigate = useNavigate();
  const [epps, setEpps] = useState<EPP[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 6;

  const apiListarEpp = import.meta.env.VITE_API_LISTARGESTIONES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    obtenerEpps();
  }, []);

  const obtenerEpps = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarEpp, {
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      let lista: any[] = [];
      if (Array.isArray(data)) lista = data;
      else if (data.datos && Array.isArray(data.datos)) lista = data.datos;

      const eppsMapped: EPP[] = lista.map((item) => ({
        id: item.id,
        idUsuario: item.idUsuario,
        nombre: item.nombre || "Sin nombre",
        apellido: item.apellido || "",
        cedula: item.cedula || "",
        cantidad: item.cantidad || 0,
        importancia: item.importancia || "Sin definir",
        estado: item.estado ?? false,
        empresa: item.empresa || { nombre: "Sin empresa", direccion: "-", nit: "-" },
        area: item.area || { nombre: "Sin área", descripcion: "-", codigo: "-" },
        fecha: item.createdAt || "Sin fecha",
        productos: item.productos || [],
      }));

      setEpps(eppsMapped);
    } catch (error) {
      console.error("Error al obtener EPP:", error);
      setEpps([]);
    }
  };

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso || fechaIso === "Sin fecha") return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const irCrear = () => navigate("/nav/creargestionEpp");

  const generarPDF = (item: EPP) => {
    const doc = new jsPDF();
    const margenIzq = 20;
    let y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INFORME DETALLADO DE GESTIÓN DE EPP", margenIzq, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const agregar = (titulo: string, valor: string | number | null) => {
      doc.text(`${titulo}: ${valor ?? "-"}`, margenIzq, y);
      y += 7;
    };

    doc.setFont("helvetica", "bold");
    doc.text("Datos del Usuario", margenIzq, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    agregar("ID Gestión", item.id);
    agregar("ID Usuario", item.idUsuario);
    agregar("Nombre", `${item.nombre} ${item.apellido || ""}`);
    agregar("Cédula", item.cedula);
    agregar("Importancia", item.importancia);
    agregar("Cantidad", item.cantidad);
    agregar("Estado", item.estado ? "Activo" : "Inactivo");
    agregar("Fecha de creación", formatearFecha(item.fecha));

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Empresa", margenIzq, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    agregar("Nombre", item.empresa.nombre);
    agregar("Dirección", item.empresa.direccion);
    agregar("NIT", item.empresa.nit);

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Área", margenIzq, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    agregar("Nombre", item.area.nombre);
    agregar("Código", item.area.codigo);
    agregar("Descripción", item.area.descripcion);

    if (item.productos && item.productos.length > 0) {
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Productos Asignados", margenIzq, y);
      doc.setFont("helvetica", "normal");
      y += 8;

      item.productos.forEach((p, i) => {
        doc.text(`${i + 1}. ${p.nombre}`, margenIzq, y);
        y += 6;
        if (p.descripcion) {
          doc.setFontSize(10);
          doc.text(`    ${p.descripcion}`, margenIzq, y);
          y += 6;
          doc.setFontSize(12);
        }
      });
    } else {
      y += 8;
      doc.text("No hay productos asignados.", margenIzq, y);
      y += 8;
    }

    y += 8;
    doc.line(margenIzq, y, 190, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(
      `Generado por: ${usuario?.nombre || "Sistema"} - ${new Date().toLocaleString("es-CO")}`,
      margenIzq,
      y
    );

    doc.save(`informe_gestion_${item.nombre}_${item.id}.pdf`);
  };

  // 🔹 Filtrado y paginación
  const eppsFiltrados = epps.filter((item) =>
    `${item.nombre} ${item.empresa.nombre} ${item.area.nombre} ${item.importancia}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(eppsFiltrados.length / porPagina);
  const indiceInicio = (paginaActual - 1) * porPagina;
  const indiceFin = indiceInicio + porPagina;
  const eppsPaginados = eppsFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
            <FaHardHat className="text-blue-700" /> 
            Gestión de EPP
          </h1>
          {/* CONTADOR DE GESTIONES - EN EL HEADER */}
          <div className="bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">
              Total: <span className="text-blue-600">{eppsFiltrados.length}</span> gestiones
            </p>
          </div>
        </div>
        <button
          onClick={irCrear}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus /> Crear Gestión
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
                placeholder="Buscar por nombre, empresa o área..."
                className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
          </div>
        </div>

        {/* LISTA DE GESTIONES */}
        {eppsFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {epps.length === 0 ? "No hay gestiones registradas" : "No se encontraron gestiones"}
            </h3>
            <p className="text-gray-500">
              {epps.length === 0 
                ? "Crea la primera gestión usando el botón 'Crear Gestión'" 
                : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE GESTIONES */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eppsPaginados.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                          <FaBox className="text-blue-500" /> {item.nombre}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.apellido ? `${item.nombre} ${item.apellido}` : item.nombre}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.estado 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.estado ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    {/* FECHA */}
                    <p className="text-sm text-gray-500 mb-4">
                      {formatearFecha(item.fecha)}
                    </p>

                    {/* INFORMACIÓN */}
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-700 text-sm">
                        <strong>Empresa:</strong> {item.empresa.nombre}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Área:</strong> {item.area.nombre}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Importancia:</strong> {item.importancia}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Cantidad:</strong> {item.cantidad}
                      </p>
                    </div>

                    {/* PRODUCTOS */}
                    {item.productos.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Productos:</strong> {item.productos.map((p) => p.nombre).join(", ")}
                        </p>
                      </div>
                    )}

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate("/nav/detalleGestionEpp", { state: item })}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg font-semibold text-sm"
                      >
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => generarPDF(item)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg flex items-center gap-2 font-semibold text-sm"
                      >
                        <FaFilePdf /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {[...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => cambiarPagina(i + 1)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        paginaActual === i + 1
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GestionEPP;