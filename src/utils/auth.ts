import { jwtDecode } from "jwt-decode";

export interface UsuarioToken {
  id: number;
  nombre: string;
  apellido: string;
  id_empresa: number;
}

export function getUsuarioFromToken(): UsuarioToken | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);

    if (!decoded?.id || !decoded?.nombre || !decoded?.id_empresa) {
      console.error("Token incompleto:", decoded);
      return null;
    }

    // Caso 1: backend manda "nombre" como "Juan Perez"
    const partes = decoded.nombre.split(" ");
    const nombre = partes[0] ?? "";
    const apellido = partes.slice(1).join(" ") || "";

    // Caso 2: backend ya trae campos separados
    return {
      id: decoded.id,
      nombre: decoded.nombrePropio ?? nombre,
      apellido: decoded.apellido ?? apellido,
      id_empresa: decoded.id_empresa ?? decoded.idEmpresa,
    };
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}
