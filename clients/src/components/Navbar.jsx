import { useEffect, useState } from "react";
import { Menu, Bell, Search, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const titles = {
  "/dashboard": ["Dashboard", "Overview of your work"],
  "/tasks": ["My Tasks", "Plan, organize and complete your work"],
  "/calendar": ["Calendar", "Keep track of upcoming deadlines"],
  "/profile": ["Profile", "Manage your personal information"],
  "/settings": ["Settings", "Customize your TaskFlow experience"]
};

export default function Navbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, subtitle] = titles[location.pathname] || ["TaskFlow", ""];
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector(".search-box input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const value = query.trim();
    navigate(value ? `/tasks?search=${encodeURIComponent(value)}` : "/tasks");
  };

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={23} /></button>
      <div className="page-heading"><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="topbar-actions">
        <form className="search-box" onSubmit={submitSearch}>
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." aria-label="Search tasks" />
          <kbd>⌘ K</kbd>
        </form>
        <button className="icon-btn notification-btn" aria-label="Notifications"><Bell size={19} /><span /></button>
        <button className="quick-add" onClick={() => navigate("/tasks?new=1")}><Plus size={18} /><span>New Task</span></button>
        <button className="top-avatar" onClick={() => navigate("/profile")} aria-label="Open profile">{user?.name?.charAt(0)?.toUpperCase() || "U"}</button>
      </div>
    </header>
  );
}
