import { ArrowUpRight, CheckCircle2, Clock3, ListTodo, Timer } from "lucide-react";

const icons = {
  total: ListTodo,
  completed: CheckCircle2,
  progress: Timer,
  overdue: Clock3
};

export default function StatCard({ type, label, value, change, positive = true }) {
  const Icon = icons[type] || ListTodo;

  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>
        <Icon size={21} />
      </div>
      <div className="stat-main">
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={positive ? "positive" : "negative"}>
          <ArrowUpRight size={13} />
          {change}
        </small>
      </div>
    </div>
  );
}
