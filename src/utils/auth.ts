import {jwtDecode} from "jwt-decode";

export interface UsuarioToken {
  id: number;
  nombre: string;
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

    return {
      id: decoded.id,
      nombre: decoded.nombre,
      id_empresa: decoded.id_empresa ?? decoded.idEmpresa,
    };
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}

