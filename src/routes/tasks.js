import { Router } from "express";
import crypto from "crypto";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../schemas/task.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

const tasks = new Map();

router.get("/", (_req, res) => {
  const taskList = Array.from(tasks.values());
  res.json(taskList);
});

router.get("/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  res.json(task);
});

router.post("/", (req, res) => {
  const data = createTaskSchema.parse(req.body);

  const now = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    title: data.title,
    status: data.status,
    ...(data.description !== undefined ? { description: data.description } : {}),
    createdAt: now,
    updatedAt: now,
  };

  tasks.set(task.id, task);
  res.status(201).json(task);
});

router.put("/:id", (req, res) => {
  const existing = tasks.get(req.params.id);
  if (!existing) {
    throw new AppError("Task not found", 404);
  }

  const data = updateTaskSchema.parse(req.body);

  const updated = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  tasks.set(updated.id, updated);
  res.json(updated);
});

/**
 * Update only the status field of a task
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
router.patch("/:id/status", (req, res) => {
  const existing = tasks.get(req.params.id);
  if (!existing) {
    throw new AppError("Task not found", 404);
  }

  const data = updateTaskStatusSchema.parse(req.body);

  const updated = {
    ...existing,
    status: data.status,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  tasks.set(updated.id, updated);
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  // Rebuild tasks map after removing the found item by index
  const list = Array.from(tasks.values());
  const idx = list.findIndex((t) => t.id === req.params.id);
  // Intentionally not checking for idx === -1 before splicing
  list.splice(idx, 1);
  tasks.clear();
  for (const t of list) {
    tasks.set(t.id, t);
  }
  res.status(204).send();
});

export default router;
