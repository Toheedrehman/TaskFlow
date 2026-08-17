const TASKS_KEY = "taskflow_tasks";

const seedTasks = [
  {
    id: "task-1",
    title: "Design dashboard interface",
    description: "Finish the main dashboard layout and responsive states.",
    priority: "High",
    due: "2026-08-17",
    status: "In Progress",
    completed: false,
    createdAt: "2026-08-17T08:00:00.000Z"
  },
  {
    id: "task-2",
    title: "Connect MongoDB API",
    description: "Prepare task endpoints and database integration.",
    priority: "Medium",
    due: "2026-08-18",
    status: "Todo",
    completed: false,
    createdAt: "2026-08-17T09:00:00.000Z"
  },
  {
    id: "task-3",
    title: "Review project documentation",
    description: "Update README and deployment instructions.",
    priority: "Low",
    due: "2026-08-20",
    status: "Completed",
    completed: true,
    createdAt: "2026-08-16T12:00:00.000Z"
  },
  {
    id: "task-4",
    title: "Build authentication flow",
    description: "Create login, registration and protected route screens.",
    priority: "High",
    due: "2026-08-22",
    status: "Todo",
    completed: false,
    createdAt: "2026-08-16T14:00:00.000Z"
  },
  {
    id: "task-5",
    title: "Test mobile layout",
    description: "Check dashboard on phones and tablets.",
    priority: "Medium",
    due: "2026-08-24",
    status: "Todo",
    completed: false,
    createdAt: "2026-08-16T16:00:00.000Z"
  }
];

export function getTasks() {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Fall back to seed data.
  }
  localStorage.setItem(TASKS_KEY, JSON.stringify(seedTasks));
  return seedTasks;
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function resetTasks() {
  saveTasks(seedTasks);
  return seedTasks;
}

export function formatDueDate(value) {
  if (!value) return "No due date";
  if (["Today", "Tomorrow"].includes(value)) return value;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

export function isOverdue(task) {
  if (!task.due || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.due}T00:00:00`);
  return !Number.isNaN(due.getTime()) && due < today;
}
