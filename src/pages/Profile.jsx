import { useEffect, useState } from "react";
import { Camera, Mail, UserRound, Check } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => setName(user?.name || ""), [user?.name]);

  const save = (e) => {
    e.preventDefault();
    const next = { ...user, name: name.trim() || "User" };
    setUser(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <AppLayout>
      <div className="profile-grid">
        <section className="panel profile-card">
          <div className="profile-cover" />
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{name?.charAt(0)?.toUpperCase() || "U"}</div>
            <button className="camera-btn" type="button" aria-label="Profile photo"><Camera size={16} /></button>
          </div>
          <h2>{name || "Your Name"}</h2>
          <p>{user?.email}</p>
          <span className="profile-badge">TaskFlow Member</span>
        </section>

        <section className="panel profile-form-panel">
          <div className="panel-head"><div><span className="eyebrow">ACCOUNT</span><h2>Personal information</h2></div></div>
          <form className="settings-form" onSubmit={save}>
            <label><span><UserRound size={15} /> Full name</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label><span><Mail size={15} /> Email</span><input value={user?.email || ""} disabled /></label>
            <button className="btn-primary" type="submit">{saved ? <><Check size={16} /> Saved</> : "Save changes"}</button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
