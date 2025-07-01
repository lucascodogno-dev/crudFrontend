import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { login, register, getMe } from "../controllers/auth.controller";
const router = express.Router();

router.use(authenticate);

// Criar tarefa
router.post("/", createTask);

// Listar tarefas por projeto
router.get("/:projectId", getTasksByProject);

// Atualizar tarefa
router.put("/:id", updateTask);

// Deletar tarefa
router.delete("/:id", deleteTask);

router.get("/me", authenticate, getMe);

export default router;
