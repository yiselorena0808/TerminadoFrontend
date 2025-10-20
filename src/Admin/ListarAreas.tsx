import React, { useEffect, useState } from "react";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import Swal from "sweetalert2";
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

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

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      setUsuario(u);
      fetchAreas(u.id_empresa);
      fetchEmpresas();
    }
  }, []);

  const fetchAreas = async (idEmpresa: number) => {
    try {
      const res = await fetch(apiListar);
      const data = await res.json();
      setAreas(Array.isArray(data) ? data.filter((a) => a.idEmpresa === idEmpresa) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(apiEmpresas);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, codigo, descripcion, id_empresa, estado, esquema, alias }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Éxito", modoEdicion ? "Área actualizada" : "Área creada", "success");
        setMostrarModal(false);
        fetchAreas(usuario!.id_empresa);
      } else {
        Swal.fire("Error", data.message || "No se pudo guardar el área", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  const eliminarArea = async (idArea: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar área?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${apiEliminar}/${idArea}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Eliminado", "Área eliminada correctamente", "success");
        setAreas((prev) => prev.filter((a) => a.idArea !== idArea));
      } else {
        Swal.fire("Error", "No se pudo eliminar el área", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };


  const areasFiltradas = areas.filter((a) =>
    a.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <FaBuilding className="text-yellow-400" /> Gestión de Áreas
          </h1>
          <p className="text-blue-200 mt-1 max-w-md">
            Aquí puedes crear, editar o eliminar áreas de tu empresa. Usa la barra de búsqueda para filtrar rápidamente por nombre de área.
          </p>
        </div>
        <button
          onClick={() => abrirModal("crear")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 shadow-2xl font-semibold flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
        >
          <FaPlus /> Nueva Área
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center bg-white rounded-full shadow-xl px-4 py-2 w-full max-w-md">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar áreas..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full outline-none px-2 text-gray-700"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <table className="min-w-full text-gray-800 rounded-2xl shadow-md">
          <thead className="bg-blue-600 text-whitel rounded-2xl shadow-md">
            <tr>
              {["ID", "Nombre", "Código", "Descripción", "Alias", "Esquema", "Estado", "Acción"].map((header) => (
                <th key={header} className="px-6 py-3 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areasFiltradas.length ? (
              areasFiltradas.map((a) => (
                <tr key={a.idArea} className="hover:bg-blue-100 transition rounded-xl">
                  <td className="px-6 py-3">{a.idArea}</td>
                  <td className="px-6 py-3 font-semibold">{a.nombre}</td>
                  <td className="px-6 py-3">{a.codigo}</td>
                  <td className="px-6 py-3">{a.descripcion}</td>
                  <td className="px-6 py-3">{a.alias || "—"}</td>
                  <td className="px-6 py-3">{a.esquema || "—"}</td>
                  <td className={`px-6 py-3 font-bold ${a.estado ? "text-green-600" : "text-red-600"}`}>
                    {a.estado ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    <button onClick={() => abrirModal("editar", a)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-xl transition shadow">
                      <FaEdit />
                    </button>
                    <button onClick={() => eliminarArea(a.idArea)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition shadow">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-600 italic">
                  No hay áreas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-blue-50 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border-blue-600">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-800">
              {modoEdicion ? "Editar Área" : "Registrar Área"}
            </h2>
            <form className="space-y-4" onSubmit={guardarArea}>
              {[
                { placeholder: "Nombre", value: nombre, setter: setNombre },
                { placeholder: "Código", value: codigo, setter: setCodigo },
                { placeholder: "Descripción", value: descripcion, setter: setDescripcion, textarea: true },
                { placeholder: "Esquema", value: esquema, setter: setEsquema },
                { placeholder: "Alias", value: alias, setter: setAlias },
              ].map((field, idx) =>
                field.textarea ? (
                  <textarea
                    key={idx}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-blue-600 focus:ring-2 focus:ring-blue-500 transition shadow"
                  />
                ) : (
                  <input
                    key={idx}
                    type="text"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-blue-600 focus:ring-2 focus:ring-blue-500 transition shadow"
                  />
                )
              )}
              <select
                value={id_empresa === "" ? "" : String(id_empresa)}
                onChange={(e) => setIdEmpresa(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full px-5 py-3 rounded-2xl border-2 border-blue-600 focus:ring-2 focus:ring-blue-500 transition shadow"
              >
                <option value="">-- Selecciona una empresa --</option>
                {empresas.map((empresa) => (
                  <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} className="accent-blue-600" />
                <span className="text-blue-800 font-semibold">Área activa</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {modoEdicion ? "Actualizar Área" : "Registrar Área"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmAreas;
