import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { getTasks, saveTasks } from "../services/taskStore";

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState(getTasks);
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [modal, setModal] = useState(searchParams.get("new") === "1" ? { mode: "create" } : null);

  useEffect(() => saveTasks(tasks), [tasks]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setModal({ mode: "create" });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tasks.filter((task) => {
      const matchesFilter = filter === "All" || (filter === "Completed" ? task.completed : !task.completed);
      const matchesStatus = statusFilter === "All statuses" || task.status === statusFilter;
      const matchesSearch = !q || `${task.title} ${task.description}`.toLowerCase().includes(q);
      return matchesFilter && matchesStatus && matchesSearch;
    });
  }, [tasks, filter, statusFilter, search]);

  const toggle = (id) => {
    setTasks((items) => items.map((task) => task.id === id
      ? { ...task, completed: !task.completed, status: !task.completed ? "Completed" : "Todo" }
      : task));
  };

  const save = (data) => {
    setTasks((items) => {
      if (data.id) return items.map((item) => item.id === data.id ? { ...item, ...data } : item);
      return [{ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...items];
    });
    setModal(null);
  };

  const remove = (id) => {
    if (window.confirm("Delete this task?")) setTasks((items) => items.filter((task) => task.id !== id));
  };

  return (
    <AppLayout>
      <div className="tasks-toolbar">
        <div className="task-tabs">
          {["All", "Active", "Completed"].map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>

        <div className="toolbar-actions">
          <div className="page-search">
            <Search size={17} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option>All statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="filter-btn"><SlidersHorizontal size={17} /> Filter</button>
          <button className="btn-primary" onClick={() => setModal({ mode: "create" })}><Plus size={17} /> New Task</button>
        </div>
      </div>

      <div className="tasks-summary">
        <span><strong>{visible.length}</strong> visible tasks</span>
        <span>{tasks.filter((task) => task.completed).length} completed · {tasks.filter((task) => !task.completed).length} active</span>
      </div>

      <div className="tasks-grid">
        {visible.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={toggle} onEdit={(item) => setModal(item)} onDelete={remove} />
        ))}
      </div>

      {!visible.length && <div className="empty-state"><h3>No tasks found</h3><p>Try another search or create a new task.</p></div>}

      {modal && (
        <TaskModal
          task={modal.mode === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </AppLayout>
  );
}
