import React, { useEffect, useState } from "react";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import Swal from "sweetalert2";
import { 
  FaBuilding, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaHashtag,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

interface Area {
  idArea: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  idEmpresa: number;
  estado: boolean;
  esquema?: string;
  alias?: string;
}

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

const AdmAreas: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [areaActual, setAreaActual] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const areasPorPagina = 5;

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_empresa, setIdEmpresa] = useState<number | "">("");
  const [estado, setEstado] = useState(true);
  const [esquema, setEsquema] = useState("");
  const [alias, setAlias] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtro, setFiltro] = useState("");

  const apiListar = import.meta.env.VITE_API_LISTARAREAS;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiCrear = import.meta.env.VITE_API_REGISTROAREA;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARAREA;
  const apiEditar = import.meta.env.VITE_API_ACTUALIZARAREA;

  const showToast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1f2937',
    });
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      setUsuario(u);
      fetchAreas(u.id_empresa);
      fetchEmpresas();
    }
  }, []);

  // 🔹 AUTORECARGA AUTOMÁTICA CADA 10 SEGUNDOS
  useEffect(() => {
    if (!usuario) return;

    const interval = setInterval(() => {
      fetchAreas(usuario.id_empresa);
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [usuario]);

  const fetchAreas = async (idEmpresa: number) => {
    try {
      setLoading(true);
      const res = await fetch(apiListar, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await res.json();
      setAreas(Array.isArray(data) ? data.filter((a) => a.idEmpresa === idEmpresa) : []);
    } catch (err) {
      console.error(err);
      showToast("error", "Error cargando áreas");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(apiEmpresas, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await res.json();

      if (Array.isArray(data.datos)) {
        setEmpresas(
          data.datos.map((e: any) => ({
            idEmpresa: Number(e.id_empresa ?? e.idEmpresa),
            nombre: e.nombre ?? "Sin nombre",
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const abrirModal = (modo: "crear" | "editar", area?: Area) => {
    if (modo === "crear") {
      setModoEdicion(false);
      setNombre("");
      setCodigo("");
      setDescripcion("");
      setIdEmpresa(usuario?.id_empresa ?? "");
      setEstado(true);
      setEsquema("");
      setAlias("");
      setAreaActual(null);
    } else {
      setModoEdicion(true);
      setAreaActual(area || null);
      setNombre(area?.nombre || "");
      setCodigo(area?.codigo || "");
      setDescripcion(area?.descripcion || "");
      setIdEmpresa(area?.idEmpresa || usuario?.id_empresa || "");
      setEstado(area?.estado ?? true);
      setEsquema(area?.esquema || "");
      setAlias(area?.alias || "");
    }
    setMostrarModal(true);
  };

  const guardarArea = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = modoEdicion ? `${apiEditar}/${areaActual?.idArea}` : apiCrear;
    const metodo = modoEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method: metodo,
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, codigo, descripcion, id_empresa, estado, esquema, alias }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", modoEdicion ? "Área actualizada" : "Área creada");
        setMostrarModal(false);
        fetchAreas(usuario!.id_empresa);
      } else {
        showToast("error", data.message || "No se pudo guardar el área");
      }
    } catch (err) {
      showToast("error", "Error de conexión con el servidor");
    }
  };

  const eliminarArea = async (idArea: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: "#ffffff",
      color: "#1f2937",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "Usuario no autenticado");
      return;
    }

    try {
      const res = await fetch(`${apiEliminar}/${idArea}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setAreas((prev) => prev.filter((a) => a.idArea !== idArea));
        showToast("success", "Área eliminada correctamente");
      } else {
        showToast("error", "No se pudo eliminar el área");
      }
    } catch (err) {
      showToast("error", "Error de conexión con el servidor");
    }
  };

  const areasFiltradas = areas.filter((a) =>
    a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    a.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    a.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  // 🔹 PAGINACIÓN
  const totalPaginas = Math.ceil(areasFiltradas.length / areasPorPagina);
  const indiceInicial = (paginaActual - 1) * areasPorPagina;
  const indiceFinal = indiceInicial + areasPorPagina;
  const areasPaginadas = areasFiltradas.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <FaBuilding className="text-white text-2xl" />
          </div>
          Gestión de Áreas
        </h1>
        <button
          onClick={() => abrirModal("crear")}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-lg" /> Nueva Área
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar áreas por nombre, código o descripción..."
              className="w-full px-4 py-4 pl-14 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
          </div>
        </div>
      </div>

      {/* CONTADOR */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg border-2 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{areasFiltradas.length}</div>
              <div className="text-blue-100 text-sm font-medium">Áreas Activas</div>
              <div className="text-blue-200 text-xs mt-1">Actualización automática</div>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <FaHashtag className="text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE ÁREAS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-pulse">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBuilding className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                Cargando áreas...
              </h3>
            </div>
          </div>
        ) : areasFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBuilding className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              No hay áreas
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {areas.length === 0 
                ? "Comienza registrando la primera área de tu empresa" 
                : "No se encontraron áreas con los criterios de búsqueda"}
            </p>
            <button
              onClick={() => abrirModal("crear")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Crear Primera Área
            </button>
          </div>
        ) : (
          <>
            {/* TABLA */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <FaHashtag />
                        ID
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Información del Área
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-sm">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {areasPaginadas.map((area, index) => (
                    <tr 
                      key={area.idArea} 
                      className={`hover:bg-blue-50 transition-colors duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold text-sm">
                            #{area.idArea}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {area.nombre}
                          </div>
                          {area.alias && (
                            <div className="text-gray-500 text-xs mt-1">
                              Alias: {area.alias}
                            </div>
                          )}
                          {area.esquema && (
                            <div className="text-gray-500 text-xs">
                              Esquema: {area.esquema}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-medium inline-block">
                          {area.codigo}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-600 text-sm max-w-xs">
                          {area.descripcion}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          area.estado 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {area.estado ? (
                            <>
                              <FaCheckCircle className="text-green-500" />
                              Activo
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="text-red-500" />
                              Inactivo
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => abrirModal("editar", area)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
                            title="Editar área"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => eliminarArea(area.idArea)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
                            title="Eliminar área"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 text-xs">
                    Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, areasFiltradas.length)} de {areasFiltradas.length} áreas
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 1}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-2 rounded-lg transition-all duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    
                    {[...Array(totalPaginas)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => cambiarPagina(i + 1)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all duration-300 text-xs ${
                          paginaActual === i + 1
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-2 rounded-lg transition-all duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
                  <FaBuilding className="text-white text-lg" />
                </div>
                {modoEdicion ? "Editar Área" : "Crear Nueva Área"}
              </h2>
            </div>

            <form onSubmit={guardarArea} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre del Área *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del área"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Código *
                  </label>
                  <input
                    type="text"
                    placeholder="Código del área"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción del área"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Esquema
                  </label>
                  <input
                    type="text"
                    placeholder="Esquema del área"
                    value={esquema}
                    onChange={(e) => setEsquema(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Alias
                  </label>
                  <input
                    type="text"
                    placeholder="Alias del área"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Empresa *
                  </label>
                  <select
                    value={id_empresa === "" ? "" : String(id_empresa)}
                    onChange={(e) =>
                      setIdEmpresa(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  >
                    <option value="">Seleccione una empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-semibold text-gray-700">
                    Área activa
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {modoEdicion ? "Actualizar Área" : "Crear Área"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmAreas;