"use client";

import { useEffect } from "react";
import { useAuth } from "./store/auth";
import api from "./lib/axios";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuth, loadFromStorage } = useAuth();

  useEffect(() => {
    // Carrega o token do localStorage no estado inicial
    loadFromStorage();

    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setAuth(res.data.user, token);
        })
        .catch((error) => {
          console.error("Erro ao verificar autenticação:", error);
          localStorage.removeItem("token");
        });
    }
  }, [setAuth, loadFromStorage]);

  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
