import api from "./api";

// Get all tasks
export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}

// Create task
export async function createTask(task) {
  const response = await api.post("/tasks", task);
  return response.data;
}

// Update task
export async function updateTask(id, task) {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
}

// Delete task
export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
  return true;
}

// Format due date
export function formatDueDate(value) {
  if (!value) return "No due date";

  if (["Today", "Tomorrow"].includes(value)) {
    return value;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

// Check overdue
export function isOverdue(task) {
  if (!task.due || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${task.due}T00:00:00`);

  return !Number.isNaN(due.getTime()) && due < today;
}