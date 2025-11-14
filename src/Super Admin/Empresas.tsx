import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaIndustry,
} from "react-icons/fa";

interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion: string;
  nit: string;
  estado: boolean;
  esquema?: string;
  alias?: string;
}

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

const SuperAdminDashboard: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoModal, setTipoModal] = useState<"empresa" | "area" | null>(null);
  const [empresaActual, setEmpresaActual] = useState<Empresa | null>(null);
  const [areaActual, setAreaActual] = useState<Area | null>(null);

  // Campos Empresa
  const [nombreEmp, setNombreEmp] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nit, setNit] = useState("");
  const [estadoEmp, setEstadoEmp] = useState(true);
  const [esquemaEmp, setEsquemaEmp] = useState("");
  const [aliasEmp, setAliasEmp] = useState("");

  // Campos Área
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_empresa, setIdEmpresa] = useState<number | "">("");
  const [estado, setEstado] = useState(true);
  const [esquema, setEsquema] = useState("");
  const [alias, setAlias] = useState("");

  // APIs desde .env
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;
  const apiCrearEmp = import.meta.env.VITE_API_REGISTROEMPRESA;
  const apiEditarEmp = import.meta.env.VITE_API_ACTUALIZAREMPRESA;
  const apiEliminarEmp = import.meta.env.VITE_API_ELIMINAREMPRESA;

  const apiCrearArea = import.meta.env.VITE_API_REGISTROAREA;
  const apiEditarArea = import.meta.env.VITE_API_ACTUALIZARAREA;
  const apiEliminarArea = import.meta.env.VITE_API_ELIMINARAREA;

  useEffect(() => {
    listarEmpresas();
    listarAreas();
  }, []);

  const listarEmpresas = async () => {
    try {
      const res = await fetch(apiEmpresas, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      if (Array.isArray(data.datos)) setEmpresas(data.datos);
    } catch (err) {
      console.error(err);
    }
  };

  const listarAreas = async () => {
    try {
      const res = await fetch(apiAreas, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      console.log("ÁREAS desde API:", data);

      if (Array.isArray(data)) setAreas(data);
      else if (Array.isArray(data.datos)) setAreas(data.datos);
    } catch (err) {
      console.error(err);
    }
  };

  const abrirModal = (
    tipo: "empresa" | "area",
    modo: "crear" | "editar",
    item?: Empresa | Area
  ) => {
    setTipoModal(tipo);
    setModoEdicion(modo === "editar");

    if (tipo === "empresa") {
      if (modo === "editar" && item && "idEmpresa" in item) {
        const emp = item as Empresa;
        setEmpresaActual(emp);
        setNombreEmp(emp.nombre);
        setDireccion(emp.direccion);
        setNit(emp.nit);
        setEstadoEmp(emp.estado);
        setEsquemaEmp(emp.esquema || "");
        setAliasEmp(emp.alias || "");
      } else {
        setEmpresaActual(null);
        setNombreEmp("");
        setDireccion("");
        setNit("");
        setEstadoEmp(true);
        setEsquemaEmp("");
        setAliasEmp("");
      }
    } else {
      if (modo === "editar" && item && "idArea" in item) {
        const ar = item as Area;
        setAreaActual(ar);
        setNombre(ar.nombre);
        setCodigo(ar.codigo);
        setDescripcion(ar.descripcion);
        setIdEmpresa(ar.idEmpresa);
        setEstado(ar.estado);
        setEsquema(ar.esquema || "");
        setAlias(ar.alias || "");
      } else {
        setAreaActual(null);
        setNombre("");
        setCodigo("");
        setDescripcion("");
        setIdEmpresa("");
        setEstado(true);
        setEsquema("");
        setAlias("");
      }
    }

    setMostrarModal(true);
  };

  // --- GUARDAR EMPRESA ---
  const guardarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = modoEdicion
      ? `${apiEditarEmp}/${empresaActual?.idEmpresa}`
      : apiCrearEmp;
    const metodo = modoEdicion ? "PUT" : "POST";

    const payload = {
      nombre: nombreEmp,
      direccion,
      nit,
      estado: estadoEmp,
      esquema: esquemaEmp,
      alias: aliasEmp,
    };

    try {
      const res = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire(
          "Éxito",
          modoEdicion ? "Empresa actualizada" : "Empresa creada",
          "success"
        );
        setMostrarModal(false);
        listarEmpresas();
      } else {
        Swal.fire("Error", data.message || "No se pudo guardar la empresa", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  // --- GUARDAR ÁREA ---
  const guardarArea = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = modoEdicion
      ? `${apiEditarArea}/${areaActual?.idArea}`
      : apiCrearArea;
    const metodo = modoEdicion ? "PUT" : "POST";

    const payload = { nombre, codigo, descripcion, id_empresa, estado, esquema, alias };

    try {
      const res = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Éxito", modoEdicion ? "Área actualizada" : "Área creada", "success");
        setMostrarModal(false);
        listarAreas();
      } else {
        Swal.fire("Error", data.message || "No se pudo guardar el área", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  // --- ELIMINAR ---
  const eliminarItem = async (tipo: "empresa" | "area", id: number) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar ${tipo}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;

    const endpoint =
      tipo === "empresa" ? `${apiEliminarEmp}/${id}` : `${apiEliminarArea}/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (res.ok) {
        Swal.fire("Eliminado", `${tipo} eliminado correctamente`, "success");
        tipo === "empresa" ? listarEmpresas() : listarAreas();
      }
    } catch {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };


  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <FaIndustry className="text-yellow-400" /> Panel Super Admin
        </h1>
        <button
          onClick={() => abrirModal("empresa", "crear")}
          className="bg-blue-600 hover:bg-white text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
        >
          <FaPlus /> Nueva Empresa
        </button>
      </div>

      {empresas
        .filter((e) => e.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .map((empresa) => (
          <div key={empresa.idEmpresa} className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-blue-800">{empresa.nombre}</h2>
                <p className="text-gray-600">{empresa.direccion || "Sin dirección"}</p>
                <p className="text-sm text-gray-500">NIT: {empresa.nit}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirModal("empresa", "editar", empresa)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-xl"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => eliminarItem("empresa", empresa.idEmpresa)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => abrirModal("area", "crear")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl"
                >
                  <FaPlus /> Área
                </button>
              </div>
            </div>

            <table className="w-full mt-4 text-sm text-gray-700 border">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Código</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Alias</th>
                  <th className="p-2">Esquema</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {areas
                  .filter((a) => a.idEmpresa === empresa.idEmpresa)
                  .map((a) => (
                    <tr key={a.idArea} className="border-t hover:bg-white">
                      <td className="p-2">{a.idArea}</td>
                      <td className="p-2">{a.nombre}</td>
                      <td className="p-2">{a.codigo}</td>
                      <td className="p-2">{a.descripcion}</td>
                      <td className="p-2">{a.alias}</td>
                      <td className="p-2">{a.esquema}</td>
                      <td className="p-2">
                        {a.estado ? (
                          <span className="text-green-600 font-semibold">Activo</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Inactivo</span>
                        )}
                      </td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => abrirModal("area", "editar", a)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => eliminarItem("area", a.idArea)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-blue-50 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border-blue-600">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            {tipoModal === "empresa" ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
                  {modoEdicion ? "Editar Empresa" : "Registrar Empresa"}
                </h2>
                <form onSubmit={guardarEmpresa} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombreEmp}
                    onChange={(e) => setNombreEmp(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="NIT"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Esquema"
                    value={esquemaEmp}
                    onChange={(e) => setEsquemaEmp(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Alias"
                    value={aliasEmp}
                    onChange={(e) => setAliasEmp(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={estadoEmp}
                      onChange={(e) => setEstadoEmp(e.target.checked)}
                      className="accent-blue-600"
                    />
                    <span>Empresa activa</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                  >
                    {modoEdicion ? "Actualizar" : "Registrar"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
                  {modoEdicion ? "Editar Área" : "Registrar Área"}
                </h2>
                <form onSubmit={guardarArea} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Código"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <select
                    value={id_empresa === "" ? "" : String(id_empresa)}
                    onChange={(e) =>
                      setIdEmpresa(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  >
                    <option value="">-- Selecciona una empresa --</option>
                    {empresas.map((e) => (
                      <option key={e.idEmpresa} value={e.idEmpresa}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Esquema"
                    value={esquema}
                    onChange={(e) => setEsquema(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-600 rounded-xl"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={estado}
                      onChange={(e) => setEstado(e.target.checked)}
                      className="accent-blue-600"
                    />
                    <span>Área activa</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                  >
                    {modoEdicion ? "Actualizar Área" : "Registrar Área"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
