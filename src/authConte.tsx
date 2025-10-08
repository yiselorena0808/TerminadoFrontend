// authConte.tsx
import { createContext, useState, useEffect } from "react";
import { getUsuarioFromToken } from "./utils/auth";

interface AuthContextType {
  user: any;
  token: string | null;
  activo: boolean;
  Login: (token: string) => void;
  Logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const usuario = getUsuarioFromToken(savedToken);
      setUser(usuario);
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }
  }, []);

  const Login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);

    const usuario = getUsuarioFromToken(token);
    setUser(usuario);

    localStorage.setItem("usuario", JSON.stringify(usuario));
  };

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, activo: !!user, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
