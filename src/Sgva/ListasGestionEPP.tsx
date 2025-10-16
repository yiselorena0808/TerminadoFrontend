import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaHardHat,
  FaExclamationTriangle,
  FaBox,
  FaFilePdf,
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
        headers: { Authorization: `Bearer ${token}` },
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
        empresa: item.empresa || {
          nombre: "Sin empresa",
          direccion: "-",
          nit: "-",
        },
        area: item.area || {
          nombre: "Sin área",
          descripcion: "-",
          codigo: "-",
        },
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

  const eppsFiltrados = epps.filter((item) =>
    `${item.nombre} ${item.empresa.nombre} ${item.area.nombre} ${item.importancia}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div
    >
      {/* Encabezado */}
      <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 mb-6 flex items-center gap-3">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-2xl font-bold">SST - Gestión de EPP</h2>
          <p className="text-yellow-200">Control y entrega de equipos de protección</p>
        </div>
      </div>

      {/* Contenedor */}
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {/* Buscador */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar por nombre, empresa o área..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <button
            onClick={irCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-400 transition flex items-center gap-2"
          >
            <FaPlus /> Crear Gestión
          </button>
        </div>

        {/* Listado */}
            {eppsFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
          <FaExclamationTriangle className="text-yellow-500" /> No hay gestiones registradas
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eppsFiltrados.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
            >
              <div className="mb-2">
                <h4 className="font-semibold text-base text-gray-800 flex items-center gap-2">
                  <FaBox className="text-yellow-600 text-lg" /> {item.nombre}
                </h4>
                <p className="text-xs text-gray-600">{formatearFecha(item.fecha)}</p>
              </div>

              <p className="text-gray-700 text-sm mb-1">
                <strong>Empresa:</strong> {item.empresa.nombre}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <strong>Área:</strong> {item.area.nombre}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <strong>Importancia:</strong> {item.importancia}
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Cantidad:</strong> {item.cantidad}
              </p>

              {item.productos.length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                  <strong>Productos:</strong>{" "}
                  {item.productos.map((p) => p.nombre).join(", ")}
                </div>
              )}

              <div className="flex justify-end mt-3 gap-2">
                <button
                  onClick={() => navigate("/nav/detalleGestionEpp", { state: item })}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                >
                  Ver Detalle
                </button>

                <button
                  onClick={() => generarPDF(item)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition flex items-center gap-1"
                >
                  <FaFilePdf /> PDF
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionEPP;

