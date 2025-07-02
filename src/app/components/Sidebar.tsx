"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "../lib/axios";
import { useProjectStore } from "../store/project";
import { useAuth } from "../store/auth";
import ProjectForm from "./forms/ProjectForm";
import UserModal from "./UserModal";
import Link from "next/link";

interface EditData {
  id: number;
  title: string;
  description?: string;
}

export default function Sidebar() {
  const { projects, setProjects, setSelectedProject } = useProjectStore();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<EditData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Erro ao buscar projetos", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectProject = (projectId: number) => {
    const selected = projects.find((p) => p.id === projectId);
    if (selected) {
      setSelectedProject(selected);
      router.push(`/dashboard/${projectId}`);
    }
  };

  const handleEdit = (project: EditData) => {
    setEditProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId: number) => {
    if (confirm("Deseja excluir este projeto? Essa ação é irreversível.")) {
      try {
        await api.delete(`/projects/${projectId}`);
        fetchProjects();
        router.push("/dashboard");
      } catch (err) {
        alert("Erro ao excluir projeto");
      }
    }
  };

  const handleProjectCreatedOrUpdated = () => {
    setShowForm(false);
    setEditProject(null);
    fetchProjects();
  };

  return (
    <>
      <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Tarefas</h2>
          </Link>
        </div>

        {/* Lista de Projetos */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Seus Projetos</h3>
            <button
              onClick={() => {
                setEditProject(null);
                setShowForm(true);
              }}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              title="Novo Projeto"
            >
              +
            </button>
          </div>

          <ul className="space-y-1">
            {projects.map((project) => (
              <li
                key={project.id}
                className={`group rounded-md hover:bg-gray-100 transition-colors ${
                  pathname.includes(`/dashboard/${project.id}`)
                    ? "bg-blue-50 border border-blue-100"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between p-2">
                  <span
                    onClick={() => handleSelectProject(project.id)}
                    className="cursor-pointer text-sm flex-1 truncate"
                  >
                    {project.title}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project);
                      }}
                      className="text-xs text-gray-500 hover:text-blue-600 p-1"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="text-xs text-gray-500 hover:text-red-600 p-1"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Área do Usuário */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-left truncate">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.name || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Modal de Projeto */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-md">
            <button
              onClick={() => {
                setShowForm(false);
                setEditProject(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <ProjectForm
              editProject={editProject || undefined}
              onCreated={handleProjectCreatedOrUpdated}
            />
          </div>
        </div>
      )}

      {/* Modal do Usuário */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={user}
        onLogout={logout}
      />
    </>
  );
}
