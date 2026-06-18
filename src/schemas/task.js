import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["todo", "in-progress", "done"]),
});
