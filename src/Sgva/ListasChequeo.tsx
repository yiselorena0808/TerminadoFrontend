import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaHardHat,
  FaCarSide,
  FaExclamationTriangle,
  FaFilePdf,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";

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
  id_empresa: number;
}

const ListasChequeoRecibidas: React.FC = () => {
  const navigate = useNavigate();
  const [listas, setListas] = useState<ListaChequeo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

  const apiListarCheq = import.meta.env.VITE_API_LISTARCHEQUEO;

  const obtenerListas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(apiListarCheq, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.datos && Array.isArray(data.datos)) {
        setListas(data.datos);
      } else {
        setListas([]);
      }
    } catch (error) {
      console.error("Error al obtener listas:", error);
      setListas([]);
    }
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) setUsuario(u);
    obtenerListas();
  }, []);

  const abrirDetalle = (item: ListaChequeo) => {
    navigate("/nav/detalleListasChequeo", { state: item });
  };

  const irCrear = () => {
    navigate("/nav/crearListasChequeo");
  };

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return "Sin fecha";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const descargarPDF = (lista: ListaChequeo) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lista de Chequeo - SST", 20, 20);
    doc.setFontSize(12);

    doc.text(`Usuario: ${lista.usuario_nombre}`, 20, 40);
    doc.text(`Fecha: ${formatearFecha(lista.fecha)} ${lista.hora}`, 20, 50);
    doc.text(`Marca: ${lista.marca}`, 20, 60);
    doc.text(`Modelo: ${lista.modelo}`, 20, 70);
    doc.text(`Kilometraje: ${lista.kilometraje}`, 20, 80);
    doc.text(`Técnico: ${lista.tecnico}`, 20, 90);
    doc.text(`SOAT: ${lista.soat}`, 20, 100);

    doc.save(`lista_chequeo_${lista.id}.pdf`);
  };

  const listasFiltradas = listas.filter((item) =>
    `${item.usuario_nombre} ${item.modelo} ${item.marca}`
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
          <h2 className="text-2xl font-bold">SST - Listas de Chequeo</h2>
          <p className="text-yellow-200">
            Control y revisión de vehículos y equipos
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-3xl shadow-2xl p-5 mx-auto max-w-6xl bg-white">
        {/* Filtros y acción */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar por usuario, marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={irCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-400 transition flex items-center gap-2"
          >
            <FaPlus /> Crear Lista
          </button>
        </div>

        {/* Listado */}
          {listasFiltradas.length === 0 ? (
  <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2">
    <FaExclamationTriangle className="text-yellow-500" />
    No hay listas registradas
  </p>
) : (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {listasFiltradas.map((item) => (
      <div
        key={item.id}
        className="p-3 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
      >
        <div className="mb-2">
          <h4 className="font-semibold text-base text-gray-800 flex items-center gap-2">
            <FaCarSide className="text-yellow-600 text-lg" />
            {item.usuario_nombre}
          </h4>
          <p className="text-xs text-gray-600">
            {formatearFecha(item.fecha)} - {item.hora}
          </p>
        </div>

        <p className="text-gray-700 text-sm mb-1">
          Marca: <span className="font-medium">{item.marca}</span> | Modelo:{" "}
          <span className="font-medium">{item.modelo}</span>
        </p>
        <p className="text-gray-600 text-xs mb-1">
          Kilometraje: {item.kilometraje}
        </p>
        <p className="text-gray-600 text-xs mb-1">Técnico: {item.tecnico}</p>
        <p className="text-gray-500 text-xs">SOAT: {item.soat}</p>

        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => abrirDetalle(item)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
          >
            Abrir
          </button>
          <button
            onClick={() => descargarPDF(item)}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition flex items-center gap-1"
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

export default ListasChequeoRecibidas;
