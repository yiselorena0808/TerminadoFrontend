import { jwtDecode } from "jwt-decode";

export interface UsuarioToken {
  id: number;
  nombre: string;
  apellido: string;
  id_empresa: number;
  id_gestion:number
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

    const partes = decoded.nombre.split(" ");
    const nombre = partes[0] ?? "";
    const apellido = partes.slice(1).join(" ") || "";

    return {
      id: decoded.id,
      nombre: decoded.nombrePropio ?? nombre,
      apellido: decoded.apellido ?? apellido,
      id_empresa: decoded.id_empresa ?? decoded.idEmpresa,
      id_gestion: decoded.id_gestion ?? decoded.id_gestion,
    };
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}
