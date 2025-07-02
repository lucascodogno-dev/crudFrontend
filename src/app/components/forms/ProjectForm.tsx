"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/lib/axios";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onCreated?: () => void;
  editProject?: { id: number; title: string; description?: string };
}

export default function ProjectForm({ onCreated, editProject }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: editProject || { title: "", description: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (editProject) {
        await api.put(`/projects/${editProject.id}`, data);
      } else {
        await api.post("/projects", data);
      }

      onCreated?.();
      reset();
    } catch (err) {
      alert("Erro ao salvar projeto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md max-w-md border border-gray-100"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editProject ? "Editar Projeto" : "Novo Projeto"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          {...register("title")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
          }`}
          placeholder="Digite o título do projeto"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          placeholder="Adicione uma descrição (opcional)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {editProject ? "Salvando..." : "Criando..."}
          </span>
        ) : editProject ? (
          "Salvar alterações"
        ) : (
          "Criar Projeto"
        )}
      </button>
    </form>
  );
}
