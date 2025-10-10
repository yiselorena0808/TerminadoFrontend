import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilePdf,
  FaHardHat,
  FaExclamationTriangle,
  FaPlus,
  FaFolderOpen,
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        setGestiones(data.data);
      } else {
        setGestiones([]);
      }
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

    // Fondo blanco
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    // Encabezado azul
    doc.setFillColor(37, 99, 235); // azul-600
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

    // Sección Usuario
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

    // Sección Empresa
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Datos de la Empresa", margenIzq, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    agregar("Nombre", item.empresa?.nombre);
    agregar("Dirección", item.empresa?.direccion);
    agregar("NIT", item.empresa?.nit);

    // Sección Área
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Área", margenIzq, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    agregar("Nombre", item.area?.nombre);
    agregar("Código", item.area?.codigo);
    agregar("Descripción", item.area?.descripcion);

    // Pie
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
        {gestionesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
            <FaExclamationTriangle className="text-blue-500" /> No hay gestiones registradas.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {gestionesFiltradas.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-xl border shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
              >
                <div className="mb-3">
                  <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    {item.nombre}
                  </h4>
                  <p className="text-sm text-gray-600">{formatearFecha(item.createdAt)}</p>
                </div>

                <p className="text-gray-700 text-sm mb-1">
                  <strong>Cédula:</strong> {item.cedula}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Importancia:</strong> {item.importancia}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Cantidad:</strong> {item.cantidad}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Estado:</strong> {item.estado ? "Activo" : "Inactivo"}
                </p>

                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={() => navigate("/nav/Migestionepp", { state: item })}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1"
                  >
                    <FaFolderOpen /> Abrir
                  </button>

                  <button
                    onClick={() => generarPDF(item)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition flex items-center gap-1"
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

export default LectorMisGestiones;
