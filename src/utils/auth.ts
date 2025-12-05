import { jwtDecode } from "jwt-decode";

export interface UsuarioToken {
  id: number;
  nombre: string;
  apellido: string;
  id_empresa: number;
  id_gestion: number;
  cargo?: string;
}

export interface UserData {
  id: number;
  idEmpresa: number;
  idArea?: number;
  nombre: string;
  apellido?: string;
  nombreUsuario?: string;
  correoElectronico: string;
  cargo: string; 
  contrasena?: string;
  createdAt?: string;
  updatedAt?: string;
  empresa?: any;
  area?: any;
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

    const userData = getUserDataFromLocalStorage();
    const cargo = userData?.cargo || decoded.cargo;

    return {
      id: decoded.id,
      nombre: decoded.nombrePropio ?? nombre,
      apellido: decoded.apellido ?? apellido,
      id_empresa: decoded.id_empresa ?? decoded.idEmpresa,
      id_gestion: decoded.id_gestion ?? decoded.id_gestion,
      cargo: cargo, 
    };
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}

export function getUserDataFromLocalStorage(): UserData | null {
  try {
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) {
      console.log("⚠️ No hay userData en localStorage");
      return null;
    }

    const userData: UserData = JSON.parse(userDataStr);
    console.log("📦 userData obtenido de localStorage:", {
      nombre: userData.nombre,
      cargo: userData.cargo,
      empresa: userData.idEmpresa
    });
    
    return userData;
  } catch (error) {
    console.error("❌ Error parseando userData:", error);
    return null;
  }
}

export function getCargoUsuario(): string | null {
  const userData = getUserDataFromLocalStorage();
  if (userData?.cargo) {
    console.log("🎯 Cargo obtenido de userData:", userData.cargo);
    return userData.cargo;
  }
  
  const usuario = getUsuarioFromToken();
  console.log("🎯 Cargo obtenido del token:", usuario?.cargo || "No encontrado");
  return usuario?.cargo || null;
}

export function esUsuarioSGSST(): boolean {
  const cargo = getCargoUsuario() || "";
  const cargoUpper = cargo.toUpperCase();
  
  const esSGSST = cargoUpper.includes("SG-SST") || 
                  cargoUpper.includes("SST") || 
                  cargoUpper === "SST";
  
  console.log(`🔍 Verificando SG-SST: Cargo="${cargo}", Es SG-SST=${esSGSST}`);
  return esSGSST;
}

export function getUsuarioCompleto(): (UsuarioToken & { cargo: string }) | null {
  const usuarioToken = getUsuarioFromToken();
  const userData = getUserDataFromLocalStorage();
  
  if (!usuarioToken) return null;
  
  const cargo = userData?.cargo || usuarioToken.cargo || "";
  
  return {
    ...usuarioToken,
    cargo: cargo 
  };
}

export function guardarUserDataEnLocalStorage(userData: UserData): void {
  try {
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("✅ userData guardado en localStorage:", {
      nombre: userData.nombre,
      cargo: userData.cargo
    });
  } catch (error) {
    console.error("❌ Error guardando userData:", error);
  }
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("usuario");
  localStorage.removeItem("auth");
  localStorage.removeItem("idEmpresa");
  console.log("✅ Datos de autenticación eliminados");
}

export function haySesionActiva(): boolean {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");
  
  if (!token) {
    console.log("🔒 No hay token, sesión no activa");
    return false;
  }
  
  try {
    const decoded: any = jwtDecode(token);
    const ahora = Math.floor(Date.now() / 1000);
    
    if (decoded.exp && decoded.exp < ahora) {
      console.log("⏰ Token expirado");
      logout();
      return false;
    }
    
    console.log("🔑 Sesión activa para:", decoded.nombre);
    return true;
  } catch (error) {
    console.error("❌ Error verificando sesión:", error);
    return false;
  }
}

export function getDebugInfo() {
  return {
    token: localStorage.getItem("token") ? "✅ Presente" : "❌ Ausente",
    userData: localStorage.getItem("userData") ? "✅ Presente" : "❌ Ausente",
    usuario: getUsuarioFromToken(),
    cargo: getCargoUsuario(),
    esSGSST: esUsuarioSGSST(),
    usuarioCompleto: getUsuarioCompleto()
  };
}