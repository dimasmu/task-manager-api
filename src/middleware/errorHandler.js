import { ZodError } from "zod";

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const validationErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
    return res.status(400).json({
      error: "Validation failed",
      details: validationErrors,
      fieldErrors: validationErrors,
    });
  }

  if (err instanceof AppError) {
    if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message || "Task not found" });
    }
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
