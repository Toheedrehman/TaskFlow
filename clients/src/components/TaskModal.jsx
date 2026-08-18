import { useEffect, useState } from "react";
import { X } from "lucide-react";

const blank = {
  title: "",
  description: "",
  priority: "Medium",
  due: "",
  status: "Todo"
};

export default function TaskModal({ onClose, onSave, task = null }) {
  const [form, setForm] = useState(task ? { ...task } : blank);

  useEffect(() => {
    setForm(task ? { ...task } : blank);
  }, [task]);

  const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      completed: form.status === "Completed"
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="task-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">{task ? "EDIT" : "CREATE"}</span>
            <h2>{task ? "Edit Task" : "New Task"}</h2>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>
            Task title
            <input name="title" value={form.title} onChange={update} placeholder="e.g. Finish dashboard UI" autoFocus />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={update} placeholder="Add a short description..." rows="4" />
          </label>

          <div className="form-grid">
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={update}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label>
              Due date
              <input type="date" name="due" value={form.due || ""} onChange={update} />
            </label>
          </div>

          <label>
            Status
            <select name="status" value={form.status} onChange={update}>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{task ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
