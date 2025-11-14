import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilePdf,
  FaHardHat,
  FaExclamationTriangle,
  FaPlus,
  FaFolderOpen,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import jsPDF from "jspdf";

interface Empresa {
  nombre?: string;
  direccion?: string;
  nit?: string;
}

interface Area {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
}

interface Gestion {
  id: number;
  idUsuario: number;
  nombre: string;
  apellido: string | null;
  cedula: string;
  cantidad: number;
  importancia: string;
  estado: boolean;
  idCargo?: number;
  idEmpresa?: number;
  idArea?: number;
  empresa?: Empresa;
  area?: Area;
  fechaCreacion: string;
  createdAt: string;
}

const LectorMisGestiones: React.FC = () => {
  const navigate = useNavigate();
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 6;

  const apiListarMisGestiones = import.meta.env.VITE_API_MISGESTIONES;

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    obtenerGestiones();
  }, []);

  const obtenerGestiones = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarMisGestiones, {
        headers: { 'ngrok-skip-browser-warning': 'true',Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGestiones(data && Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error al obtener gestiones:", error);
      setGestiones([]);
    }
  };

  const formatearFecha = (fechaIso: string) => {
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

  const generarPDF = (item: Gestion) => {
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("INFORME DETALLADO DE GESTIÓN DE EPP", 20, 20);
    doc.setTextColor(0, 0, 0);
    let y = 45;
    const margenIzq = 20;
    const agregar = (titulo: string, valor: string | number | null | undefined) => {
      doc.text(`${titulo}: ${valor ?? "-"}`, margenIzq, y);
      y += 8;
    };
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Usuario", margenIzq, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    agregar("ID Gestión", item.id);
    agregar("ID Usuario", item.idUsuario);
    agregar("Nombre", `${item.nombre} ${item.apellido || ""}`);
    agregar("Cédula", item.cedula);
    agregar("Importancia", item.importancia);
    agregar("Cantidad", item.cantidad);
    agregar("Estado", item.estado ? "Activo" : "Inactivo");
    agregar("ID Cargo", item.idCargo);
    agregar("ID Empresa", item.idEmpresa);
    agregar("ID Área", item.idArea);
    agregar("Fecha de creación", formatearFecha(item.createdAt));
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Datos de la Empresa", margenIzq, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    agregar("Nombre", item.empresa?.nombre);
    agregar("Dirección", item.empresa?.direccion);
    agregar("NIT", item.empresa?.nit);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Área", margenIzq, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    agregar("Nombre", item.area?.nombre);
    agregar("Código", item.area?.codigo);
    agregar("Descripción", item.area?.descripcion);
    y += 10;
    doc.setFontSize(10);
    doc.line(margenIzq, y, 190, y);
    y += 10;
    doc.text(
      `Generado por: ${usuario?.nombre || "Sistema"} - ${new Date().toLocaleString("es-CO")}`,
      margenIzq,
      y
    );
    doc.save(`gestion_${item.nombre}_${item.id}.pdf`);
  };

  const gestionesFiltradas = gestiones.filter((item) =>
    `${item.nombre} ${item.cedula} ${item.importancia}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // 🔹 Paginación
  const totalPaginas = Math.ceil(gestionesFiltradas.length / porPagina);
  const indiceInicio = (paginaActual - 1) * porPagina;
  const indiceFin = indiceInicio + porPagina;
  const gestionesPaginadas = gestionesFiltradas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) setPaginaActual(nuevaPagina);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">Mis Gestiones EPP</h2>
          <p className="text-blue-200">
            Consulta, crea y gestiona tus registros personales de protección
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {/* Buscador + Crear gestión */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          <button
            onClick={() => navigate("/nav/CreargestioneppUser")}
            className="ml-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow"
          >
            <FaPlus /> Crear Gestión
          </button>
        </div>

        {/* Listado */}
        {gestionesPaginadas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-blue-500" /> No hay gestiones registradas.
          </p>
        ) : (
          <>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gestionesPaginadas.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
              >
                <div className="mb-2">
                  <h4 className="font-bold text-base text-gray-800 flex items-center gap-2">
                    {item.nombre}
                  </h4>
                  <p className="text-xs text-gray-600">{formatearFecha(item.createdAt)}</p>
                </div>

                <p className="text-gray-700 text-xs mb-1">
                  <strong>Cédula:</strong> {item.cedula}
                </p>
                <p className="text-gray-700 text-xs mb-1">
                  <strong>Importancia:</strong> {item.importancia}
                </p>
                <p className="text-gray-700 text-xs mb-1">
                  <strong>Cantidad:</strong> {item.cantidad}
                </p>
                <p className="text-gray-700 text-xs mb-2">
                  <strong>Estado:</strong> {item.estado ? "Activo" : "Inactivo"}
                </p>

                <div className="flex justify-end mt-3 gap-2">
                  <button
                    onClick={() => navigate("/nav/Migestionepp", { state: item })}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1 text-xs"
                  >
                    <FaFolderOpen /> Abrir
                  </button>

                  <button
                    onClick={() => generarPDF(item)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-1 text-xs"
                  >
                    <FaFilePdf /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>


            {/* 🔹 Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>

                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => cambiarPagina(i + 1)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      paginaActual === i + 1
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LectorMisGestiones;
