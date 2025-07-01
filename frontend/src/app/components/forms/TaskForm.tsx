"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import api from "@/app/lib/axios";

const schema = z.object({
  title: z.string().min(1, "Título obrigatório").max(100, "Título muito longo"),
  dueDate: z
    .string()
    .min(1, "Data obrigatória")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "A data de entrega não pode ser anterior à data atual"),
  status: z.enum(["TODO", "DOING", "DONE"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  projectId: number;
  onCreated?: () => void;
}

export default function TaskForm({ projectId, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "TODO" },
  });

  const today = new Date().toISOString().split("T")[0];
  const statusValue = watch("status");

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await api.post("/tasks", {
        ...data,
        projectId,
      });
      reset();
      onCreated?.();
    } catch (err) {
      alert("Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    {
      value: "TODO",
      label: "A Fazer",
      icon: "🕒",
      color: "bg-gray-200 text-gray-800",
    },
    {
      value: "DOING",
      label: "Fazendo",
      icon: "🚧",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "DONE",
      label: "Feito",
      icon: "✅",
      color: "bg-green-100 text-green-800",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl shadow-lg max-w-md border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Criar nova tarefa
      </h2>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Título *
        </label>
        <input
          {...register("title")}
          className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? "border-red-500 focus:ring-red-200 dark:border-red-600"
              : "border-gray-300 focus:ring-blue-200 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          }`}
          placeholder="Descreva a tarefa..."
          maxLength={100}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Data de entrega *
        </label>
        <div className="relative">
          <input
            type="date"
            {...register("dueDate")}
            min={today}
            className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.dueDate
                ? "border-red-500 focus:ring-red-200 dark:border-red-600"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            }`}
          />
          {errors.dueDate && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {errors.dueDate && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.dueDate.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                statusValue === option.value
                  ? `${
                      option.color
                    } border-transparent ring-2 ring-offset-2 ring-opacity-50 ${
                      option.value === "TODO"
                        ? "ring-gray-300"
                        : option.value === "DOING"
                        ? "ring-blue-300"
                        : "ring-green-300"
                    }`
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                {...register("status")}
                value={option.value}
                className="hidden"
              />
              <span className="mr-2 text-lg">{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
          loading
            ? "bg-blue-400 cursor-not-allowed focus:ring-blue-200"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
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
            Criando...
          </span>
        ) : (
          "Criar Tarefa"
        )}
      </button>
    </form>
  );
}
