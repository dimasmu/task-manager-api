import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    const responseTimeMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${responseTimeMs}ms`);
  });
  next();
});

app.get("/", (_req, res) => {
  res.redirect("/tasks");
});

app.use("/tasks", taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
