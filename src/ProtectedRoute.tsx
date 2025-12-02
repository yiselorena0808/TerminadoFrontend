import { Navigate, Outlet } from "react-router-dom";
import { getUsuarioFromToken } from "./utils/auth";

export default function ProtectedRoute() {
  const usuario = getUsuarioFromToken();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
