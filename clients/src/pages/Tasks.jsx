import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import AppLayout from "../components/AppLayout";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskStore";

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [modal, setModal] = useState(
    searchParams.get("new") === "1"
      ? { mode: "create" }
      : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setModal({ mode: "create" });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Completed"
          ? task.completed
          : !task.completed);

      const matchesStatus =
        statusFilter === "All statuses" ||
        task.status === statusFilter;

      const matchesSearch =
        !q ||
        `${task.title} ${task.description || ""}`
          .toLowerCase()
          .includes(q);

      return (
        matchesFilter &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [tasks, filter, statusFilter, search]);

  const toggle = async (id) => {
    const task = tasks.find((item) => item._id === id || item.id === id);

    if (!task) return;

    try {
      const updated = await updateTask(
        task._id || task.id,
        {
          ...task,
          completed: !task.completed,
          status: !task.completed
            ? "Completed"
            : "Todo",
        }
      );

      setTasks((items) =>
        items.map((item) =>
          (item._id || item.id) ===
          (task._id || task.id)
            ? updated
            : item
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to update task."
      );
    }
  };

  const save = async (data) => {
    try {
      if (data.id || data._id) {
        const id = data._id || data.id;

        const updated = await updateTask(id, data);

        setTasks((items) =>
          items.map((item) =>
            (item._id || item.id) === id
              ? updated
              : item
          )
        );
      } else {
        const created = await createTask(data);

        setTasks((items) => [created, ...items]);
      }

      setModal(null);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to save task."
      );
    }
  };

const remove = async (id) => {
  try {
    await deleteTask(id);

    setTasks((items) =>
      items.filter(
        (task) => (task._id || task.id) !== id
      )
    );
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to delete task."
    );
  }
};

  if (loading) {
    return (
      <AppLayout>
        <div className="empty-state">
          <h3>Loading tasks...</h3>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="tasks-toolbar">
        <div className="task-tabs">
          {["All", "Active", "Completed"].map(
            (item) => (
              <button
                key={item}
                className={
                  filter === item ? "active" : ""
                }
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div className="toolbar-actions">
          <div className="page-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search tasks..."
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option>All statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <button className="filter-btn">
            <SlidersHorizontal size={17} />
            Filter
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              setModal({ mode: "create" })
            }
          >
            <Plus size={17} />
            New Task
          </button>
        </div>
      </div>

      <div className="tasks-summary">
        <span>
          <strong>{visible.length}</strong>{" "}
          visible tasks
        </span>

        <span>
          {tasks.filter((task) => task.completed).length}{" "}
          completed ·{" "}
          {tasks.filter((task) => !task.completed).length}{" "}
          active
        </span>
      </div>

      <div className="tasks-grid">
        {visible.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onToggle={toggle}
            onEdit={(item) => setModal(item)}
            onDelete={remove}
          />
        ))}
      </div>

      {!visible.length && (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            Try another search or create a new task.
          </p>
        </div>
      )}

      {modal && (
        <TaskModal
          task={
            modal.mode === "create"
              ? null
              : modal
          }
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </AppLayout>
  );
}