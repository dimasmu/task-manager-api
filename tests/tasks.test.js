import request from "supertest";
import app from "../src/index.js";

describe("Tasks API", () => {
  let createdTask;

  describe("POST /api/tasks", () => {
    it("should create a task with valid data", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Test task" })
        .expect(201);

      expect(res.body).toMatchObject({
        title: "Test task",
        status: "todo",
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();

      createdTask = res.body;
    });

    it("should create a task with description", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "With desc", description: "A description" })
        .expect(201);

      expect(res.body.description).toBe("A description");
    });

    it("should create a task with valid status", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "In progress task", status: "in-progress" })
        .expect(201);

      expect(res.body.status).toBe("in-progress");
    });

    it("should return 400 when title is missing", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({})
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
      expect(res.body.fieldErrors).toBeDefined();
    });

    it("should return 400 when title is empty", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "" })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });

    it("should return 400 when title exceeds 100 chars", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "a".repeat(101) })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });

    it("should return 400 when description exceeds 500 chars", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Valid title", description: "a".repeat(501) })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });

    it("should return 400 for invalid status", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Valid title", status: "invalid" })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      const res = await request(app).get("/api/tasks").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return a task by id", async () => {
      const res = await request(app)
        .get(`/api/tasks/${createdTask.id}`)
        .expect(200);

      expect(res.body.title).toBe("Test task");
      expect(res.body.id).toBe(createdTask.id);
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app)
        .get("/api/tasks/non-existent-id")
        .expect(404);

      expect(res.body.error).toBe("Task not found");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task", async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTask.id}`)
        .send({ title: "Updated task", status: "done" })
        .expect(200);

      expect(res.body.title).toBe("Updated task");
      expect(res.body.status).toBe("done");
      expect(res.body.id).toBe(createdTask.id);
      expect(res.body.createdAt).toBe(createdTask.createdAt);
      expect(res.body.updatedAt).not.toBe(createdTask.updatedAt);
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app)
        .put("/api/tasks/non-existent-id")
        .send({ title: "Nope" })
        .expect(404);

      expect(res.body.error).toBe("Task not found");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${createdTask.id}`)
        .expect(204);

      expect(res.body).toEqual({});
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app)
        .delete("/api/tasks/non-existent-id")
        .expect(404);

      expect(res.body.error).toBe("Task not found");
    });

    it("should 404 when getting deleted task", async () => {
      await request(app).get(`/api/tasks/${createdTask.id}`).expect(404);
    });
  });
});
