"use client";

import TaskBoard from "@/app/components/TaskBoard";
import { useProjectStore } from "@/app/store/project";
import { useParams } from "next/navigation";

/**
 * Página do projeto que exibe o quadro de tarefas.
 * Obtém o ID do projeto da URL e usa o estado global para obter o projeto selecionado.
 */
export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { selectedProject } = useProjectStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Projeto: {selectedProject?.title || `#${projectId}`}
      </h1>

      <TaskBoard projectId={Number(projectId)} />
    </div>
  );
}
