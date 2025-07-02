"use client";

import { useAuth } from "../store/auth";
import { useProjectStore } from "../store/project";

export default function DashboardPage() {
  // Obtém o usuário autenticado e os projetos do estado global
  // usando os hooks personalizados useAuth e useProjectStore
  // useAuth fornece o usuário e o token de autenticação
  // useProjectStore fornece os projetos e as funções para manipulação
  const { user } = useAuth();
  const { projects } = useProjectStore();
  
  const totalProjects = projects.length;
  // Calcula o total de tarefas e as concluídas
  const totalTasks = projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  // Conta as tarefas concluídas filtrando por status "DONE"
  const completedTasks = projects.reduce(
    (acc, project) =>
      acc + project.tasks.filter((t) => t.status === "DONE").length,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Bem-vindo, {user?.name} 👋
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Projetos</h2>
          <p className="text-3xl font-bold text-blue-600">{totalProjects}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Tarefas</h2>
          <p className="text-3xl font-bold text-yellow-500">{totalTasks}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Concluídas</h2>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>
      </div>
    </div>
  );
}
