// src/controllers/project.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: number;
}

// Criar um novo projeto
export const createProject = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const userId = req.userId;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: userId!,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar projeto." });
  }
};

// Listar todos os projetos do usuário autenticado
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      include: { tasks: true },
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar projetos." });
  }
};

// Buscar projeto por ID do usuario autenticado
export const getProjectById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      include: { tasks: true },
    });

    if (!project)
      return res.status(404).json({ error: "Projeto não encontrado." });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar projeto." });
  }
};

// Atualizar projeto
export const updateProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updated = await prisma.project.updateMany({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      data: {
        title,
        description,
      },
    });

    if (updated.count === 0)
      return res
        .status(404)
        .json({ error: "Projeto não encontrado ou sem permissão." });

    res.json({ message: "Projeto atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar projeto." });
  }
};

// Deletar projeto
export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const projectId = parseInt(id);

    // Verifica se o projeto pertence ao usuário que esta deletando
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId,
      },
    });

    if (!project) {
      return res
        .status(404)
        .json({ error: "Projeto não encontrado ou sem permissão." });
    }

    // Primeiro exclui as tarefas relacionadas
    await prisma.task.deleteMany({
      where: { projectId },
    });

    // Depois exclui o projeto
    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({ message: "Projeto excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir projeto." });
  }
};
