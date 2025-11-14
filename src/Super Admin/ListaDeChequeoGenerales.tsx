import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaHardHat,
  FaCarSide,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  placa: string;
  observaciones: string;
  id_empresa: number;
}

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

const ListasChequeoGenerales: React.FC = () => {
  const navigate = useNavigate();

  const [listas, setListas] = useState<ListaChequeo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaAbierta, setEmpresaAbierta] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);

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

  // ✔ Filtrar por nombre de empresa
  const empresasFiltradas = empresas.filter((e) =>
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

  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 mb-8 flex items-center gap-4">
        <FaHardHat className="text-4xl" />
        <div>
          <h2 className="text-3xl font-bold">Listas de Chequeo por Empresa</h2>
          <p>Sistema de gestión SST</p>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="mb-6 flex items-center gap-3 bg-gray-100 p-3 rounded-xl border max-w-4xl mx-auto">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Buscar empresa..."
          className="w-full p-2 bg-transparent outline-none"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* LISTADO POR EMPRESA */}
      <div className="rounded-3xl shadow-2xl p-8 mx-auto max-w-6xl bg-white">
        {empresasFiltradas.map((empresa) => {
          const empresaId = empresa.idEmpresa;
          const items = listasPorEmpresa[empresaId] || [];
          const abierta = empresaAbierta === empresaId;

          return (
            <div
              key={empresaId}
              className="border rounded-xl shadow-xl bg-gray-50 cursor-pointer mb-6"
              onClick={() => toggleEmpresa(empresaId)}
            >
              {/* CARPETA */}
              <div className="w-full p-6 hover:bg-gray-100 transition">
                <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                  📁 {empresa.nombre}
                </h3>
              </div>

              {abierta && (
                <div className="p-6 border-t">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 rounded-xl border shadow bg-white hover:shadow-lg transition"
                      >
                        {/* TITULO */}
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <FaCarSide className="text-blue-600" />
                          {item.usuario_nombre}
                        </h4>

                        {/* FECHA */}
                        <p className="text-sm text-gray-600">
                          {formatearFecha(item.fecha)} - {item.hora}
                        </p>

                        {/* DETALLES */}
                        <p className="text-gray-700 mt-2">
                          Marca: {item.marca} | Modelo: {item.modelo}
                        </p>

                        <p className="text-gray-600 text-sm">
                          Técnico: {item.tecnico}
                        </p>

                        <p className="text-gray-600 text-sm">
                          Kilometraje: {item.kilometraje}
                        </p>

                        {/* BOTONES */}
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirDetalle(item);
                            }}
                            className="bg-blue-600 text-white px-4 py-1 rounded"
                          >
                            Abrir
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              descargarPDF(item);
                            }}
                            className="bg-red-500 text-white px-4 py-1 rounded flex items-center gap-1"
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
    </div>
  );
};

export default ListasChequeoGenerales;
