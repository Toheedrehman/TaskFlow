import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

import {
  getTasks,
  updateTask,
  isOverdue,
} from "../services/taskStore";

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tasks from MongoDB
  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError("");

        const data = await getTasks();

        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load tasks:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load tasks."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  // Dashboard statistics
  const stats = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.completed
    ).length;

    const progress = tasks.filter(
      (task) =>
        task.status === "In Progress" &&
        !task.completed
    ).length;

    const overdue = tasks.filter(isOverdue).length;

    const percentage = tasks.length
      ? Math.round((completed / tasks.length) * 100)
      : 0;

    return {
      total: tasks.length,
      completed,
      progress,
      overdue,
      percentage,
    };
  }, [tasks]);

  // Latest 4 tasks
  const recent = tasks
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 4);

  // Complete / incomplete task
  const toggle = async (id) => {
    const task = tasks.find(
      (item) => (item._id || item.id) === id
    );

    if (!task) return;

    const taskId = task._id || task.id;

    try {
      const updated = await updateTask(taskId, {
        ...task,

        completed: !task.completed,

        status: !task.completed
          ? "Completed"
          : "Todo",
      });

      setTasks((items) =>
        items.map((item) =>
          (item._id || item.id) === taskId
            ? updated
            : item
        )
      );
    } catch (err) {
      console.error(
        "Failed to update task:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update task."
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <AppLayout>
        <div className="empty-state">
          <h3>Loading tasks...</h3>
          <p>Please wait.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Error */}
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {/* Welcome */}
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">
            GOOD TO SEE YOU
          </span>

          <h2>
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || "there"}.
          </h2>

          <p>
            Here is what's happening with your tasks
            today.
          </p>
        </div>

        <div
          className="progress-ring"
          aria-label={`${stats.percentage}% completed`}
        >
          <strong>{stats.percentage}%</strong>
          <span>completed</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-grid">
        <StatCard
          type="total"
          label="Total tasks"
          value={stats.total}
          change="Your workspace"
        />

        <StatCard
          type="completed"
          label="Completed"
          value={stats.completed}
          change={`${stats.percentage}% of all tasks`}
        />

        <StatCard
          type="progress"
          label="In progress"
          value={stats.progress}
          change="Currently active"
        />

        <StatCard
          type="overdue"
          label="Overdue"
          value={stats.overdue}
          change={
            stats.overdue
              ? "Needs attention"
              : "You're on track"
          }
          positive={!stats.overdue}
        />
      </section>

      {/* Dashboard */}
      <section className="dashboard-grid">
        {/* Recent Tasks */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                RECENT WORK
              </span>

              <h2>Recent tasks</h2>
            </div>

            <Link
              to="/tasks"
              className="text-link"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="task-list">
            {recent.map((task) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                onToggle={toggle}
              />
            ))}

            {!recent.length && (
              <div className="empty-state">
                <h3>No tasks yet</h3>

                <p>
                  Create your first task from My
                  Tasks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Task Health */}
        <div className="panel activity-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                OVERVIEW
              </span>

              <h2>Task health</h2>
            </div>
          </div>

          <div className="activity-list">
            {/* Completed */}
            <div className="activity-item">
              <div className="activity-icon done">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <strong>
                  {stats.completed} completed
                </strong>

                <p>
                  Tasks finished successfully
                </p>
              </div>
            </div>

            {/* In progress */}
            <div className="activity-item">
              <div className="activity-icon progress">
                <Clock3 size={17} />
              </div>

              <div>
                <strong>
                  {stats.progress} in progress
                </strong>

                <p>
                  Tasks currently being worked on
                </p>
              </div>
            </div>

            {/* Overdue */}
            <div className="activity-item">
              <div className="activity-icon new">
                <AlertCircle size={17} />
              </div>

              <div>
                <strong>
                  {stats.overdue} overdue
                </strong>

                <p>
                  Tasks that need your attention
                </p>
              </div>
            </div>

            {/* Active */}
            <div className="activity-item">
              <div className="activity-icon">
                <Circle size={17} />
              </div>

              <div>
                <strong>
                  {stats.total -
                    stats.completed}{" "}
                  active
                </strong>

                <p>
                  Open tasks remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}