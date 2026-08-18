import "./TaskCard.css";
import {
  CalendarDays,
  MoreHorizontal,
  Flag,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import {
  formatDueDate,
  isOverdue,
} from "../services/taskStore";

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const overdue = isOverdue(task);

  // MongoDB uses _id, older data may use id
  const taskId = task._id || task.id;

  return (
    <>
      <article
        className={`task-card ${
          task.completed ? "task-completed" : ""
        }`}
      >
        {/* Complete / Incomplete */}
        <button
          className={`check-circle ${
            task.completed ? "checked" : ""
          }`}
          onClick={() => onToggle?.(taskId)}
          aria-label={
            task.completed
              ? "Mark incomplete"
              : "Mark complete"
          }
        >
          {task.completed && "✓"}
        </button>

        <div className="task-card-body">
          {/* Top section */}
          <div className="task-card-top">
            <span
              className={`priority ${
                task.priority?.toLowerCase() || "medium"
              }`}
            >
              <Flag size={12} />
              {task.priority || "Medium"}
            </span>

            {/* Menu */}
            <div className="task-menu-wrap">
              <button
                className="more-btn"
                onClick={() =>
                  setMenuOpen((value) => !value)
                }
                aria-label="More options"
              >
                <MoreHorizontal size={18} />
              </button>

              {menuOpen && (
                <div className="task-menu">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit?.(task);
                    }}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    className="danger"
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteConfirm(true);
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task information */}
          <h3>{task.title}</h3>

          <p>
            {task.description ||
              "No description added."}
          </p>

          {/* Task metadata */}
          <div className="task-meta">
            <span
              className={
                overdue ? "overdue-text" : ""
              }
            >
              <CalendarDays size={14} />

              {overdue
                ? "Overdue"
                : formatDueDate(task.due)}
            </span>

            <span
              className={`status ${
                task.status
                  ?.toLowerCase()
                  .replaceAll(" ", "-") || "todo"
              }`}
            >
              {task.status || "Todo"}
            </span>
          </div>
        </div>
      </article>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          className="confirm-overlay"
          onClick={() =>
            setDeleteConfirm(false)
          }
        >
          <div
            className="confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="confirm-icon">
              <AlertTriangle size={24} />
            </div>

            <h3>Delete task?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{task.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="confirm-actions">
              {/* Cancel */}
              <button
                className="confirm-btn confirm-cancel"
                onClick={() =>
                  setDeleteConfirm(false)
                }
              >
                Cancel
              </button>

              {/* Confirm delete */}
              <button
                className="confirm-btn confirm-delete"
                onClick={() => {
                  setDeleteConfirm(false);
                  onDelete?.(taskId);
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}