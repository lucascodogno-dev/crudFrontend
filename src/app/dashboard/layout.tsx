"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { useProtectedRoute } from "../middleware/client-auth";
import Sidebar from "../components/Sidebar";
import "../globals.css";

// Layout do Dashboard que inclui o Sidebar e o ThemeProvider
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useProtectedRoute();
  // useProtectedRoute verifica se o usuário está autenticado e retorna isLoading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="flex-1 p-4">{children}</section>
    </main>
    // </ThemeProvider>
  );
}

//obs verifiquei que iria gastar muito tempo para fazer o sidebar responsivo e thema provider, então deixei para depois.
