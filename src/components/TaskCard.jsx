import { CalendarDays, MoreHorizontal, Flag, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDueDate, isOverdue } from "../services/taskStore";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = isOverdue(task);

  return (
    <article className={`task-card ${task.completed ? "task-completed" : ""}`}>
      <button
        className={`check-circle ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle?.(task.id)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && "✓"}
      </button>

      <div className="task-card-body">
        <div className="task-card-top">
          <span className={`priority ${task.priority.toLowerCase()}`}>
            <Flag size={12} />
            {task.priority}
          </span>
          <div className="task-menu-wrap">
            <button className="more-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="More options">
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="task-menu">
                <button onClick={() => { setMenuOpen(false); onEdit?.(task); }}><Pencil size={14} /> Edit</button>
                <button className="danger" onClick={() => { setMenuOpen(false); onDelete?.(task.id); }}><Trash2 size={14} /> Delete</button>
              </div>
            )}
          </div>
        </div>

        <h3>{task.title}</h3>
        <p>{task.description || "No description added."}</p>

        <div className="task-meta">
          <span className={overdue ? "overdue-text" : ""}><CalendarDays size={14} /> {overdue ? "Overdue" : formatDueDate(task.due)}</span>
          <span className={`status ${task.status.toLowerCase().replaceAll(" ", "-")}`}>
            {task.status}
          </span>
        </div>
      </div>
    </article>
  );
}
