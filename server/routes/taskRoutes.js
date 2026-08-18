// taskRoutes.js
// Task Manager project scaffold. Implementation will be added here.
import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// All task routes require authentication
router.use(auth);

// GET TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load tasks.",
    });
  }
});

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due,
      status,
      completed,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      priority: priority || "Medium",
      due: due || "",
      status: status || "Todo",
      completed: Boolean(completed),
      user: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task.",
    });
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const {
      title,
      description,
      priority,
      due,
      status,
      completed,
    } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (due !== undefined) task.due = due;
    if (status !== undefined) task.status = status;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task.",
    });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task.",
    });
  }
});

export default router;