import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UploadExcel from "../Admin/Excel";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaIndustry,
  FaUsers,
  FaSearch,
  FaBuilding,
  FaExclamationTriangle,
  FaUserPlus,
  FaFileExcel,
  FaTimes,
  FaSave,
  FaKey,
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaHashtag,
  FaFileAlt,
  FaTag,
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

interface Usuario {
  id: number;
  idEmpresa: number;
  idArea: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  correoElectronico: string;
  cargo: string;
  rol?: string;
  estado?: boolean;
  createdAt: string;
  updatedAt: string;
  empresa?: Empresa;
  area?: Area;
}

const SuperAdminDashboard: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoModal, setTipoModal] = useState<"empresa" | "area" | null>(null);

  // Estados para el modal de usuarios
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);
  const [busquedaUsuarios, setBusquedaUsuarios] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);

  // Estados para funcionalidades dentro del modal de usuarios
  const [mostrarModalCrearUsuario, setMostrarModalCrearUsuario] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [mostrarModalExcel, setMostrarModalExcel] = useState(false);

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

  // Campos para crear usuario
  const [usuarioForm, setUsuarioForm] = useState({
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

  // Campos para editar usuario
  const [usuarioEditForm, setUsuarioEditForm] = useState({
    nombre: "",
    apellido: "",
    nombre_usuario: "",
    correo_electronico: "",
    cargo: "",
    id_area: "",
  });

  // Campos para Excel
  const [archivoExcel, setArchivoExcel] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // APIs desde .env
  const apiEmpresas = import.meta.env.VITE_API_LISTAREMPRESAS;
  const apiAreas = import.meta.env.VITE_API_LISTARAREAS;
  const apiUsuarios = import.meta.env.VITE_API_LISTARTODOSLOSUSUARIOS;
  const apiCrearUsuario = import.meta.env.VITE_API_REGISTRARUSUARIOS;
  const apiActualizarUsuario = import.meta.env.VITE_API_ACTUALIZARUSUARIO;
  const apiEliminar = import.meta.env.VITE_API_ELIMINARUSUARIO;
  const apiBulkUsuarios = import.meta.env.VITE_API_BULK;

  const apiCrearEmp = import.meta.env.VITE_API_REGISTROEMPRESA;
  const apiEditarEmp = import.meta.env.VITE_API_ACTUALIZAREMPRESA;
  const apiEliminarEmp = import.meta.env.VITE_API_ELIMINAREMPRESA;

  const apiCrearArea = import.meta.env.VITE_API_REGISTROAREA;
  const apiEditarArea = import.meta.env.VITE_API_ACTUALIZARAREA;
  const apiEliminarArea = import.meta.env.VITE_API_ELIMINARAREA;

  const token = localStorage.getItem("token");

  useEffect(() => {
    listarEmpresas();
    listarAreas();
    listarUsuarios();
  }, []);

  const listarEmpresas = async () => {
    try {
      const res = await fetch(apiEmpresas, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      if (Array.isArray(data.datos)) setEmpresas(data.datos);
    } catch (err) {
      console.error("Error listando empresas:", err);
    }
  };

  const listarAreas = async () => {
    try {
      const res = await fetch(apiAreas, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();

      if (Array.isArray(data)) setAreas(data);
      else if (Array.isArray(data.datos)) setAreas(data.datos);
    } catch (err) {
      console.error("Error listando áreas:", err);
    }
  };

  const listarUsuarios = async () => {
    try {
      const res = await fetch(apiUsuarios, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      
      const data = await res.json();
      
      let usuariosData: Usuario[] = [];
      
      if (Array.isArray(data)) usuariosData = data;
      else if (Array.isArray(data.datos)) usuariosData = data.datos;
      else if (Array.isArray(data.data)) usuariosData = data.data;
      
      setUsuarios(usuariosData);
      
    } catch (err) {
      console.error("Error listando usuarios:", err);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      setUsuarios([]);
    }
  };

  // ================================
  // MODAL VER USUARIOS
  // ================================
  const abrirModalUsuarios = (empresa: Empresa) => {
    setEmpresaSeleccionada(empresa);
    setBusquedaUsuarios("");
    const usuariosEmpresa = usuarios.filter(u => u.idEmpresa === empresa.idEmpresa);
    setUsuariosFiltrados(usuariosEmpresa);
    setMostrarModalUsuarios(true);
  };

  const buscarUsuarios = (termino: string) => {
    setBusquedaUsuarios(termino);
    if (!empresaSeleccionada) return;
    
    const usuariosEmpresa = usuarios.filter(u => u.idEmpresa === empresaSeleccionada.idEmpresa);
    
    if (termino.trim() === "") {
      setUsuariosFiltrados(usuariosEmpresa);
    } else {
      const filtrados = usuariosEmpresa.filter(u =>
        obtenerNombreCompleto(u).toLowerCase().includes(termino.toLowerCase()) ||
        (u.correoElectronico && u.correoElectronico.toLowerCase().includes(termino.toLowerCase())) ||
        (u.nombreUsuario && u.nombreUsuario.toLowerCase().includes(termino.toLowerCase())) ||
        (u.cargo && u.cargo.toLowerCase().includes(termino.toLowerCase()))
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  // ================================
  // CREAR USUARIO
  // ================================
  const abrirModalCrearUsuario = () => {
    if (!empresaSeleccionada) return;
    
    setUsuarioForm({
      id_empresa: empresaSeleccionada.idEmpresa.toString(),
      id_area: "",
      nombre: "",
      apellido: "",
      nombre_usuario: "",
      correo_electronico: "",
      cargo: "",
      contrasena: "",
      confirmacion: "",
    });
    setMostrarModalCrearUsuario(true);
  };

  const handleChangeUsuario = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuarioForm(prev => ({ ...prev, [name]: value }));
  };

  const areasFiltradas = areas.filter(area => 
    area.idEmpresa === empresaSeleccionada?.idEmpresa
  );

  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (usuarioForm.contrasena !== usuarioForm.confirmacion) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      setLoading(false);
      return;
    }

    try {
      const body = {
        ...usuarioForm,
        id_empresa: Number(usuarioForm.id_empresa),
        id_area: Number(usuarioForm.id_area),
      };

      const res = await fetch(apiCrearUsuario, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
        setMostrarModalCrearUsuario(false);
        listarUsuarios();
        if (empresaSeleccionada) {
          const usuariosEmpresa = usuarios.filter(u => u.idEmpresa === empresaSeleccionada.idEmpresa);
          setUsuariosFiltrados(usuariosEmpresa);
        }
      } else {
        Swal.fire("Error", data.error || "No se pudo crear el usuario", "error");
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // EDITAR USUARIO
  // ================================
  const abrirModalEditarUsuario = (usuario: Usuario) => {
    setUsuarioAEditar(usuario);
    setUsuarioEditForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      nombre_usuario: usuario.nombreUsuario,
      correo_electronico: usuario.correoElectronico,
      cargo: usuario.cargo,
      id_area: usuario.idArea.toString(),
    });
  };

  const handleChangeEditarUsuario = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuarioEditForm(prev => ({ ...prev, [name]: value }));
  };

  const actualizarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioAEditar) return;

    if (!usuarioEditForm.nombre || !usuarioEditForm.apellido || !usuarioEditForm.nombre_usuario || !usuarioEditForm.correo_electronico) {
      Swal.fire("Error", "Todos los campos obligatorios deben ser completados.", "error");
      return;
    }

    setLoading(true);
    try {
      const body = {
        id_area: Number(usuarioEditForm.id_area),
        nombre: usuarioEditForm.nombre,
        apellido: usuarioEditForm.apellido,
        nombre_usuario: usuarioEditForm.nombre_usuario,
        correo_electronico: usuarioEditForm.correo_electronico,
        cargo: usuarioEditForm.cargo,
      };

      const res = await fetch(`${apiActualizarUsuario}${usuarioAEditar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.datos) {
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
        setUsuarioAEditar(null);
        listarUsuarios();
        if (empresaSeleccionada) {
          const usuariosEmpresa = usuarios.filter(u => u.idEmpresa === empresaSeleccionada.idEmpresa);
          setUsuariosFiltrados(usuariosEmpresa);
        }
      } else {
        Swal.fire("Error", data.error || data.mensaje || "No se pudo actualizar el usuario", "error");
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // ELIMINAR USUARIO - CORREGIDO
  // ================================
  const eliminarUsuario = async (id: number) => {
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
    if (!token) return;

    try {
      const response = await fetch(`${apiEliminar}${id}`, {
        method: "DELETE",
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` 
        },
      });

      if (response.ok) {
        // Actualizar ambos estados
        setUsuarios(prev => prev.filter(u => u.id !== id));
        
        // Actualizar usuarios filtrados si estamos en el modal
        if (empresaSeleccionada) {
          setUsuariosFiltrados(prev => prev.filter(u => u.id !== id));
        }
        
        showToast("success", "Usuario eliminado correctamente");
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("No se pudo eliminar el usuario:", error);
      showToast("error", "No se pudo eliminar el usuario");
    }
  };

  // ================================
  // CARGA MASIVA EXCEL
  // ================================
  const abrirModalExcel = () => {
    setMostrarModalExcel(true);
  };

  const handleUsuariosCreados = () => {
    listarUsuarios();
    if (empresaSeleccionada) {
      const usuariosEmpresa = usuarios.filter(u => u.idEmpresa === empresaSeleccionada.idEmpresa);
      setUsuariosFiltrados(usuariosEmpresa);
    }
    setMostrarModalExcel(false);
  };

  // ================================
  // EMPRESAS Y ÁREAS
  // ================================
  const abrirModal = (tipo: "empresa" | "area", modo: "crear" | "editar", item?: Empresa | Area) => {
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

  const guardarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = modoEdicion ? `${apiEditarEmp}/${empresaActual?.idEmpresa}` : apiCrearEmp;
    const metodo = modoEdicion ? "PUT" : "POST";

    const payload = { nombre: nombreEmp, direccion, nit, estado: estadoEmp, esquema: esquemaEmp, alias: aliasEmp };

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
        Swal.fire("Éxito", modoEdicion ? "Empresa actualizada" : "Empresa creada", "success");
        setMostrarModal(false);
        listarEmpresas();
      } else {
        Swal.fire("Error", data.message || "No se pudo guardar la empresa", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  const guardarArea = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = modoEdicion ? `${apiEditarArea}/${areaActual?.idArea}` : apiCrearArea;
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
    } finally {
      setLoading(false);
    }
  };

  const eliminarItem = async (tipo: "empresa" | "area", id: number) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar ${tipo}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;

    const endpoint = tipo === "empresa" ? `${apiEliminarEmp}/${id}` : `${apiEliminarArea}/${id}`;

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

  // ================================
  // FUNCIONES AUXILIARES
  // ================================
  const obtenerRolUsuario = (usuario: Usuario): string => {
    if (usuario.cargo && usuario.cargo.toLowerCase().includes('admin')) return 'administrador';
    if (usuario.nombreUsuario && usuario.nombreUsuario.toLowerCase().includes('sst')) return 'sg-sst';
    return 'usuario';
  };

  const obtenerNombreCompleto = (usuario: Usuario): string => {
    return `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || usuario.nombreUsuario || 'Sin nombre';
  };

  const obtenerNombreArea = (idArea: number): string => {
    const area = areas.find(a => a.idArea === idArea);
    return area ? area.nombre : 'Sin área';
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-3">
          <FaIndustry className="text-blue-700" /> 
          Panel Super Admin
        </h1>
        <button
          onClick={() => abrirModal("empresa", "crear")}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus /> Nueva Empresa
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar empresa..."
              className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
        </div>
      </div>

      {/* LISTA DE EMPRESAS */}
      <div className="space-y-6">
        {empresas.filter((e) => e.nombre.toLowerCase().includes(filtro.toLowerCase())).map((empresa) => {
          const usuariosEmpresa = usuarios.filter(u => u.idEmpresa === empresa.idEmpresa);
          const areasEmpresa = areas.filter(a => a.idEmpresa === empresa.idEmpresa);
          
          return (
            <div key={empresa.idEmpresa} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-blue-100 overflow-hidden group">
              {/* ENCABEZADO DE EMPRESA */}
              <div className="p-6 border-b-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                      <FaBuilding className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{empresa.nombre}</h2>
                      <p className="text-gray-600">{empresa.direccion || "Sin dirección"}</p>
                      <p className="text-sm text-gray-500">NIT: {empresa.nit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {areasEmpresa.length} área(s) • {usuariosEmpresa.length} usuario(s)
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => abrirModalUsuarios(empresa)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg">
                    <FaUsers /> Ver Usuarios ({usuariosEmpresa.length})
                  </button>
                  <button onClick={() => abrirModal("empresa", "editar", empresa)} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-3 py-2 rounded-xl transition-all duration-300 shadow-lg">
                    <FaEdit />
                  </button>
                  <button onClick={() => eliminarItem("empresa", empresa.idEmpresa)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl transition-all duration-300 shadow-lg">
                    <FaTrash />
                  </button>
                  <button onClick={() => abrirModal("area", "crear")} className="bg-blue-300 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg">
                    <FaPlus /> Nueva Área
                  </button>
                </div>
              </div>

              {/* ÁREAS DE LA EMPRESA */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-700">Áreas de la Empresa</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {areasEmpresa.length} área(s) registrada(s)
                  </span>
                </div>
                
                {areasEmpresa.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-700 border-2 border-blue-200 rounded-xl overflow-hidden">
                      <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <tr>
                          <th className="p-3 text-left">ID</th>
                          <th className="p-3 text-left">Nombre</th>
                          <th className="p-3 text-left">Código</th>
                          <th className="p-3 text-left">Descripción</th>
                          <th className="p-3 text-left">Estado</th>
                          <th className="p-3 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {areasEmpresa.map((area) => (
                          <tr key={area.idArea} className="border-blue-100 hover:bg-blue-50 transition-colors">
                            <td className="p-3 font-medium">{area.idArea}</td>
                            <td className="p-3">{area.nombre}</td>
                            <td className="p-3">{area.codigo}</td>
                            <td className="p-3 max-w-xs"><div className="line-clamp-2">{area.descripcion}</div></td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${area.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {area.estado ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button onClick={() => abrirModal("area", "editar", area)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl transition-colors">
                                  <FaEdit size={14} />
                                </button>
                                <button onClick={() => eliminarItem("area", area.idArea)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-colors">
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-blue-200 rounded-xl">
                    <FaExclamationTriangle className="text-4xl mx-auto mb-2 text-gray-300" />
                    <p className="text-lg font-semibold">No hay áreas registradas</p>
                    <p className="text-sm">Crea la primera área usando el botón "Nueva Área"</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {empresas.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaBuilding className="text-6xl mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No hay empresas registradas</h3>
            <p className="text-gray-500">Comienza creando la primera empresa usando el botón "Nueva Empresa"</p>
          </div>
        )}
      </div>

      {/* MODAL VER USUARIOS */}
      {mostrarModalUsuarios && empresaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-blue-100">
            {/* HEADER DEL MODAL */}
            <div className="p-6 border-b border-gray-200 bg-white sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-xl">
                      <FaUsers className="text-white text-lg" />
                    </div>
                    Usuarios de {empresaSeleccionada.nombre}
                  </h2>
                  <p className="text-gray-600">Total: {usuariosFiltrados.length} usuarios</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={abrirModalExcel} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg">
                    <FaFileExcel /> Cargar Excel
                  </button>
                  <button onClick={abrirModalCrearUsuario} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg">
                    <FaUserPlus /> Crear Usuario
                  </button>
                  <button onClick={() => setMostrarModalUsuarios(false)} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg">
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* BUSCADOR */}
              <div className="mt-4 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar usuarios por nombre, correo o cargo..."
                    value={busquedaUsuarios}
                    onChange={(e) => buscarUsuarios(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                </div>
              </div>
            </div>

            {/* TABLA DE USUARIOS */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              {usuariosFiltrados.length > 0 ? (
                <table className="w-full text-sm text-gray-700">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Nombre Completo</th>
                      <th className="p-3 text-left">Usuario</th>
                      <th className="p-3 text-left">Correo</th>
                      <th className="p-3 text-left">Cargo</th>
                      <th className="p-3 text-left">Área</th>
                      <th className="p-3 text-left">Rol</th>
                      <th className="p-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-t hover:bg-blue-50 transition-colors">
                        <td className="p-3 font-medium">{usuario.id}</td>
                        <td className="p-3 font-medium">{obtenerNombreCompleto(usuario)}</td>
                        <td className="p-3">{usuario.nombreUsuario}</td>
                        <td className="p-3">{usuario.correoElectronico}</td>
                        <td className="p-3">{usuario.cargo}</td>
                        <td className="p-3">{obtenerNombreArea(usuario.idArea)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            obtenerRolUsuario(usuario) === 'administrador' ? 'bg-purple-100 text-purple-800' :
                            obtenerRolUsuario(usuario) === 'sg-sst' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {obtenerRolUsuario(usuario)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button onClick={() => abrirModalEditarUsuario(usuario)} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-2 rounded-xl transition-all duration-300 shadow-lg">
                              <FaEdit size={14} />
                            </button>
                            <button onClick={() => eliminarUsuario(usuario.id)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-xl transition-all duration-300 shadow-lg">
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaUsers className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No se encontraron usuarios</p>
                  {busquedaUsuarios && <p className="text-sm">Intenta con otros términos de búsqueda</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR USUARIO */}
      {mostrarModalCrearUsuario && empresaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
                    <FaUserPlus className="text-white text-lg" />
                  </div>
                  Crear Nuevo Usuario - {empresaSeleccionada.nombre}
                </h2>
                <button onClick={() => setMostrarModalCrearUsuario(false)} className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-300">
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={crearUsuario} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del usuario"
                    value={usuarioForm.nombre}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido del usuario"
                    value={usuarioForm.apellido}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaIdCard className="text-purple-500" /> Usuario *
                  </label>
                  <input
                    type="text"
                    name="nombre_usuario"
                    placeholder="Nombre de usuario"
                    value={usuarioForm.nombre_usuario}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaEnvelope className="text-red-500" /> Correo *
                  </label>
                  <input
                    type="email"
                    name="correo_electronico"
                    placeholder="correo@ejemplo.com"
                    value={usuarioForm.correo_electronico}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-green-500" /> Área *
                </label>
                <select
                  name="id_area"
                  value={usuarioForm.id_area}
                  onChange={handleChangeUsuario}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                >
                  <option value="">Seleccione un Área</option>
                  {areasFiltradas.map((area) => (
                    <option key={area.idArea} value={area.idArea}>{area.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaUser className="text-orange-500" /> Cargo
                </label>
                <input
                  type="text"
                  name="cargo"
                  placeholder="Cargo del usuario"
                  value={usuarioForm.cargo}
                  onChange={handleChangeUsuario}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaKey className="text-yellow-500" /> Contraseña *
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    placeholder="Contraseña"
                    value={usuarioForm.contrasena}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaKey className="text-yellow-500" /> Confirmar *
                  </label>
                  <input
                    type="password"
                    name="confirmacion"
                    placeholder="Confirmar contraseña"
                    value={usuarioForm.confirmacion}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setMostrarModalCrearUsuario(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaUserPlus />}
                  {loading ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO */}
      {usuarioAEditar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-xl">
                    <FaEdit className="text-white text-lg" />
                  </div>
                  Editar Usuario
                </h2>
                <button onClick={() => setUsuarioAEditar(null)} className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-300">
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={actualizarUsuario} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={usuarioEditForm.nombre}
                    onChange={handleChangeEditarUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={usuarioEditForm.apellido}
                    onChange={handleChangeEditarUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaIdCard className="text-purple-500" /> Usuario *
                  </label>
                  <input
                    type="text"
                    name="nombre_usuario"
                    value={usuarioEditForm.nombre_usuario}
                    onChange={handleChangeEditarUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaEnvelope className="text-red-500" /> Correo *
                  </label>
                  <input
                    type="email"
                    name="correo_electronico"
                    value={usuarioEditForm.correo_electronico}
                    onChange={handleChangeEditarUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaBuilding className="text-green-500" /> Área *
                  </label>
                  <input
                    type="number"
                    name="id_area"
                    value={usuarioEditForm.id_area}
                    onChange={handleChangeEditarUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-orange-500" /> Cargo
                  </label>
                  <input
                    type="text"
                    name="cargo"
                    value={usuarioEditForm.cargo}
                    onChange={handleChangeEditarUsuario}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setUsuarioAEditar(null)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXCEL - USANDO EL COMPONENTE UPLOADEXCEL */}
      {mostrarModalExcel && empresaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-xl">
                    <FaFileExcel className="text-white text-lg" />
                  </div>
                  Cargar Usuarios desde Excel
                </h2>
                <button 
                  onClick={() => setMostrarModalExcel(false)} 
                  className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-300"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Empresa: <strong>{empresaSeleccionada.nombre}</strong>
              </p>
            </div>

            <div className="p-6">
              <UploadExcel 
                apiBulk={apiBulkUsuarios}
                onUsuariosCreados={handleUsuariosCreados}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL EMPRESA */}
      {mostrarModal && tipoModal === "empresa" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
                    <FaBuilding className="text-white text-lg" />
                  </div>
                  {modoEdicion ? "Editar Empresa" : "Registrar Empresa"}
                </h2>
                <button onClick={() => setMostrarModal(false)} className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-300">
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={guardarEmpresa} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-blue-500" /> Nombre *
                </label>
                <input type="text" value={nombreEmp} onChange={(e) => setNombreEmp(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-500" /> Dirección
                </label>
                <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaHashtag className="text-purple-500" /> NIT
                  </label>
                  <input type="text" value={nit} onChange={(e) => setNit(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-orange-500" /> Esquema
                  </label>
                  <input type="text" value={esquemaEmp} onChange={(e) => setEsquemaEmp(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaTag className="text-yellow-500" /> Alias
                </label>
                <input type="text" value={aliasEmp} onChange={(e) => setAliasEmp(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={estadoEmp} onChange={(e) => setEstadoEmp(e.target.checked)} className="accent-blue-600" />
                <span>Empresa activa</span>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setMostrarModal(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                  {loading ? "Guardando..." : (modoEdicion ? "Actualizar" : "Registrar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ÁREA */}
      {mostrarModal && tipoModal === "area" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-blue-700 p-2 rounded-xl">
                    <FaBuilding className="text-white text-lg" />
                  </div>
                  {modoEdicion ? "Editar Área" : "Registrar Área"}
                </h2>
                <button onClick={() => setMostrarModal(false)} className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-300">
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={guardarArea} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaBuilding className="text-green-500" /> Nombre
                  </label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaHashtag className="text-purple-500" /> Código
                  </label>
                  <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-orange-500" /> Descripción
                </label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaBuilding className="text-blue-500" /> Empresa *
                  </label>
                  <select value={id_empresa === "" ? "" : String(id_empresa)} onChange={(e) => setIdEmpresa(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                    <option value="">-- Selecciona una empresa --</option>
                    {empresas.map((e) => <option key={e.idEmpresa} value={e.idEmpresa}>{e.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-orange-500" /> Esquema
                  </label>
                  <input type="text" value={esquema} onChange={(e) => setEsquema(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaTag className="text-yellow-500" /> Alias
                </label>
                <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} className="accent-blue-600" />
                <span>Área activa</span>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setMostrarModal(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                  {loading ? "Guardando..." : (modoEdicion ? "Actualizar Área" : "Registrar Área")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;