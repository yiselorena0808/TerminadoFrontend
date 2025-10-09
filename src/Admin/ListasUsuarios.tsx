// AdmUsuariosCompleto.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FaUsers, FaPlus, FaSearch } from "react-icons/fa";
import { getUsuarioFromToken, type UsuarioToken } from "../utils/auth";
import ActualizarUsuarioModal from "../Admin/Actualizarusuarios";

interface Empresa {
  idEmpresa: number;
  nombre: string;
}

interface Area {
  idArea: number;
  descripcion: string;
}

export interface Usuario {
  id: number;
  idEmpresa: number;
  idArea: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  createdAt: string;
  updatedAt: string;
  empresa?: Empresa;
  area?: Area;
}

interface UsuarioExcel {
  id_empresa: string;
  id_area: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo_electronico: string;
  cargo: string;
  contrasena: string;
  confirmacion: string;
}

const AdmUsuariosCompleto: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioToken | null>(
    null
  );
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const apiListar = import.meta.env.VITE_API_LISTARUSUARIOS;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARUSUARIO;
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;
  const apiRegister = import.meta.env.VITE_API_REGISTRARUSUARIOS;

  // 🔹 Listar usuarios
  const obtenerUsuarios = async (id_empresa?: number) => {
    const empresaId = id_empresa || usuarioLogueado?.id_empresa;
    if (!empresaId) return alert("No se encontró la empresa del usuario");

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const base = apiListar.endsWith("/") ? apiListar : `${apiListar}/`;
      const res = await fetch(`${base}${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(Array.isArray(data.datos) ? data.datos : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    const u = getUsuarioFromToken();
    if (u) {
      setUsuarioLogueado(u);
      obtenerUsuarios(u.id_empresa);

      // Cargar empresas
      fetch(apiEmpresas)
        .then((r) => r.json())
        .then((data) => setEmpresas(Array.isArray(data.datos) ? data.datos : []));
    }
  }, []);

  // 🔹 Eliminar usuario
  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
    }
  };

  // 🔹 Actualizar usuario
  const actualizarUsuario = (usuarioActualizado: Usuario) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
    );
    setUsuarioAEditar(null);
  };

  // 🔹 Filtrado
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
      u.id.toString().includes(filtro)
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 🔸 ENCABEZADO */}
      <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaUsers className="text-blue-600" /> Administración de Usuarios
        </h1>
        <button
          onClick={() => setMostrarModalCrear(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <FaPlus className="inline mr-2" /> Crear Usuario
        </button>
      </div>

      {/* 🔸 BUSQUEDA */}
      <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-md mb-6">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar por nombre o usuario..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full border-0 focus:ring-0 text-gray-700"
        />
      </div>

      {/* 🔸 SUBIR EXCEL */}
      <UploadExcel
        apiRegister={apiRegister}
        onUsuariosCreados={() => obtenerUsuarios(usuarioLogueado?.id_empresa)}
      />

      {/* 🔸 TABLA */}
      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-lg">
        <table className="min-w-full text-sm text-gray-800 border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Apellido</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Correo</th>
              <th className="px-4 py-3 text-left">Cargo</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Área</th>
              <th className="px-4 py-3 text-center" colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u, idx) => (
              <tr key={u.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.nombre}</td>
                <td className="px-4 py-2">{u.apellido}</td>
                <td className="px-4 py-2">{u.nombreUsuario}</td>
                <td className="px-4 py-2">{u.correoElectronico}</td>
                <td className="px-4 py-2">{u.cargo}</td>
                <td className="px-4 py-2">{u.empresa?.nombre || "-"}</td>
                <td className="px-4 py-2">{u.area?.descripcion || "-"}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setUsuarioAEditar(u)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔸 MODAL ACTUALIZAR */}
      {usuarioAEditar && (
        <ActualizarUsuarioModal
          usuario={usuarioAEditar}
          onClose={() => setUsuarioAEditar(null)}
          onUpdate={actualizarUsuario}
        />
      )}

      {/* 🔸 MODAL CREAR USUARIO */}
      {mostrarModalCrear && (
        <RegistrarUsuarioModal
          onClose={() => setMostrarModalCrear(false)}
          onUsuarioCreado={() => obtenerUsuarios(usuarioLogueado?.id_empresa)}
          apiEmpresas={apiEmpresas}
          apiAreas={apiAreas}
          apiRegister={apiRegister}
        />
      )}
    </div>
  );
};

export default AdmUsuariosCompleto;

/* ------------------------------------------------------------------- */
/* 🔹 SUBIR EXCEL Y CREAR USUARIOS                                     */
/* ------------------------------------------------------------------- */
const UploadExcel: React.FC<{
  apiRegister: string;
  onUsuariosCreados: () => void;
}> = ({ apiRegister, onUsuariosCreados }) => {
  const [usuarios, setUsuarios] = useState<UsuarioExcel[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as UsuarioExcel[];
      setUsuarios(json);
    };
    reader.readAsBinaryString(file);
  };

  const enviarUsuarios = async () => {
    if (usuarios.length === 0) return Swal.fire("Error", "No hay usuarios cargados", "error");

    for (const [i, u] of usuarios.entries()) {
      if (u.contrasena !== u.confirmacion)
        return Swal.fire("Error", `Fila ${i + 1}: Las contraseñas no coinciden`, "error");
    }

    try {
      const res = await fetch(apiRegister + "/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: usuarios }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Éxito", `Usuarios creados: ${data.created}`, "success");
        setUsuarios([]);
        onUsuariosCreados();
      } else {
        Swal.fire("Error", data.message || "No se pudo registrar", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="mb-4">
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="mb-2" />
      {usuarios.length > 0 && (
        <>
          <table className="w-full text-sm border-collapse border border-gray-300 mb-2">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(usuarios[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.slice(0, 10).map((u, i) => (
                <tr key={i}>
                  {Object.values(u).map((v, j) => (
                    <td key={j} className="border px-2 py-1">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={enviarUsuarios} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Crear Usuarios
          </button>
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------- */
/* 🔹 MODAL CREAR USUARIO MANUAL                                        */
/* ------------------------------------------------------------------- */
const RegistrarUsuarioModal: React.FC<{
  onClose: () => void;
  onUsuarioCreado: () => void;
  apiEmpresas: string;
  apiAreas: string;
  apiRegister: string;
}> = ({ onClose, onUsuarioCreado, apiEmpresas, apiAreas, apiRegister }) => {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_empresa: "",
    id_area: "",
    nombre: "",
    apellido: "",
    nombre_usuario: "",
    correo_electronico: "",
    cargo: "",
    contrasena: "",
    confirmacion: "",
  });

  useEffect(() => {
    fetch(apiEmpresas)
      .then((r) => r.json())
      .then((data) => setEmpresas(Array.isArray(data.datos) ? data.datos : []));
  }, []);

  useEffect(() => {
    if (!formData.id_empresa) return setAreas([]);
    fetch(apiAreas)
      .then((r) => r.json())
      .then((data) => {
        const filtradas = Array.isArray(data)
          ? data.filter((a: any) => a.idEmpresa === Number(formData.id_empresa))
          : [];
        setAreas(filtradas);
      });
  }, [formData.id_empresa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmacion)
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");

    try {
      const res = await fetch(apiRegister, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_empresa: Number(formData.id_empresa),
          id_area: Number(formData.id_area),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Éxito", "Usuario registrado correctamente", "success");
        onUsuarioCreado();
        onClose();
      } else {
        Swal.fire("Error", data.message || "No se pudo registrar", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Crear Usuario</h2>
        <form onSubmit={registrar} className="space-y-4">
          <select name="id_empresa" value={formData.id_empresa} onChange={handleChange} className="w-full border p-2 rounded-lg" required>
            <option value="">Seleccione una Empresa</option>
            {empresas.map((e) => <option key={e.idEmpresa} value={e.idEmpresa}>{e.nombre}</option>)}
          </select>

          <select name="id_area" value={formData.id_area} onChange={handleChange} className="w-full border p-2 rounded-lg" required disabled={!formData.id_empresa}>
            <option value="">Seleccione un Área</option>
            {areas.map((a) => <option key={a.idArea} value={a.idArea}>{a.descripcion}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="border p-2 rounded-lg" required />
            <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="border p-2 rounded-lg" required />
          </div>

          <input type="text" name="nombre_usuario" placeholder="Nombre de usuario" value={formData.nombre_usuario} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
          <input type="email" name="correo_electronico" placeholder="Correo electrónico" value={formData.correo_electronico} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
          <input type="text" name="cargo" placeholder="Cargo" value={formData.cargo} onChange={handleChange} className="w-full border p-2 rounded-lg" />
          <input type="password" name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
          <input type="password" name="confirmacion" placeholder="Confirmar contraseña" value={formData.confirmacion} onChange={handleChange} className="w-full border p-2 rounded-lg" required />

          <div className="flex justify-between gap-3 mt-4">
            <button type="button" onClick={onClose} className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg py-2">Cancelar</button>
            <button type="submit" className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-2">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
