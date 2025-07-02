"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/auth";
import api from "../lib/axios";

export const useProtectedRoute = () => {
  const router = useRouter();
  const { user, token, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função para verificar se o usuário está autenticado
    const verifyAuth = async () => {
      const localStorageToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // Se não há token redireciona para o login
      if (!token && !localStorageToken) {
        router.replace("/login");
        return;
      }

      // Se já tem o usuario logado, não precisa verificar novamente
      if (user) {
        setIsLoading(false);
        return;
      }

      // Se tem o Token mas nao o usuario vou ir verifica com a API
      try {
        const response = await api.get("/auth/me");
        setAuth(response.data.user, localStorageToken || token || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Falha na verificação de autenticação:", error);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    verifyAuth();
  }, [user, token, router, setAuth]);

  return { isLoading };
};

// obs Possibilidade de colocar um speinner de carregamento ou uma mensagem de loading...
