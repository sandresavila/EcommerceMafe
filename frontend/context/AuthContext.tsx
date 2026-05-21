"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  loginRequest,
} from "@/services/authService";

import {
  Usuario,
} from "@/types/auth";

interface AuthContextType {

  usuario: Usuario | null;

  token: string | null;

  login: (
    correo: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // =====================================
  // TOKEN
  // =====================================
  const [token, setToken] =
    useState<string | null>(null);

  // =====================================
  // USUARIO
  // =====================================
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  // =====================================
  // CARGAR SOLO CLIENT
  // =====================================
  useState(() => {

    if (
      typeof window !==
      "undefined"
    ) {

      const storedToken =
        localStorage.getItem(
          "token"
        );

      const storedUsuario =
        localStorage.getItem(
          "usuario"
        );

      if (storedToken) {

        setToken(storedToken);
      }

      if (storedUsuario) {

        setUsuario(
          JSON.parse(
            storedUsuario
          )
        );
      }
    }
  });

  // =====================================
  // LOGIN
  // =====================================
  const login = async (
    correo: string,
    password: string
  ) => {

    const data =
      await loginRequest(
        correo,
        password
      );

    setToken(data.token);

    setUsuario(data.usuario);

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "usuario",
      JSON.stringify(
        data.usuario
      )
    );
  };

  // =====================================
  // LOGOUT
  // =====================================
  const logout = () => {

    setToken(null);

    setUsuario(null);

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================
// HOOK
// =====================================
export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );
  }

  return context;
};