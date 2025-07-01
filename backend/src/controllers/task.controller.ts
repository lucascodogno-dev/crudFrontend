// src/controllers/task.controller.ts
import { Request, Response } from "express";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: number;
}

// Criar nova tarefa
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, dueDate, projectId, status } = req.body;

  try {
    // Verifica se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
    });

    if (!project)
      return res
        .status(403)
        .json({ error: "Projeto não encontrado ou acesso negado." });

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        projectId,
        status: status || "TODO",
      },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa." });
  }
};

// Listar tarefas de um projeto
export const getTasksByProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;

  try {
    // Confirma se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: { id: parseInt(projectId), userId: req.userId },
    });

    if (!project)
      return res.status(403).json({ error: "Acesso negado ao projeto." });

    const tasks = await prisma.task.findMany({
      where: { projectId: parseInt(projectId) },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas." });
  }
};

// Atualizar tarefa
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, status, dueDate } = req.body;

  try {
    // Confirma se a tarefa pertence a um projeto do usuário
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada." });

    const project = await prisma.project.findFirst({
      where: { id: task.projectId, userId: req.userId },
    });

    if (!project)
      return res
        .status(403)
        .json({ error: "Sem permissão para alterar essa tarefa." });

    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa." });
  }
};

// Deletar tarefa
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada." });

    const project = await prisma.project.findFirst({
      where: { id: task.projectId, userId: req.userId },
    });

    if (!project)
      return res
        .status(403)
        .json({ error: "Sem permissão para deletar essa tarefa." });

    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Tarefa deletada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar tarefa." });
  }
};
