import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">T</div>
          <div>
            <strong>TaskFlow</strong>
            <span>Task Manager</span>
          </div>
          <button className="mobile-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">WORKSPACE</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-user">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div>
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
