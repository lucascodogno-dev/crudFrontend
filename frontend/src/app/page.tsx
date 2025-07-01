"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./store/auth";
import "./globals.css";

export default function HomePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não há token, redireciona para login
    if (!token && !localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }

    // Se há usuário, redireciona para dashboard
    if (user) {
      router.replace("/dashboard");
      return;
    }

    // Se chegou aqui, estamos esperando a verificação do token
    const timer = setTimeout(() => {
      setLoading(false);
      if (!user) {
        router.replace("/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, token, router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return null;
}
