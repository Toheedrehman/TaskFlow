import { useEffect, useState } from "react";
import { Bell, Lock, Moon, ShieldCheck, RotateCcw } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { resetTasks } from "../services/taskStore";

const SETTINGS_KEY = "taskflow_settings";
const defaults = { notifications: true, darkMode: true, activity: true, security: true };

function SettingRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="setting-row">
      <div className="setting-icon"><Icon size={18} /></div>
      <div className="setting-copy"><strong>{title}</strong><p>{description}</p></div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span />
      </label>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) }; }
    catch { return defaults; }
  });

  useEffect(() => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)), [settings]);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const restore = () => {
    if (!window.confirm("Reset demo tasks to the original sample data?")) return;
    resetTasks();
    window.location.href = "/dashboard";
  };

  return (
    <AppLayout>
      <section className="panel settings-panel">
        <div className="panel-head"><div><span className="eyebrow">PREFERENCES</span><h2>Workspace settings</h2></div></div>
        <div className="settings-list">
          <SettingRow icon={Bell} title="Task notifications" description="Receive reminders for upcoming and overdue tasks." checked={settings.notifications} onChange={(v) => update("notifications", v)} />
          <SettingRow icon={Moon} title="Dark mode" description="Use the dark interface throughout your workspace." checked={settings.darkMode} onChange={(v) => update("darkMode", v)} />
          <SettingRow icon={ShieldCheck} title="Activity alerts" description="Get notified when important workspace activity happens." checked={settings.activity} onChange={(v) => update("activity", v)} />
          <SettingRow icon={Lock} title="Login security" description="Keep your account protected with secure sessions." checked={settings.security} onChange={(v) => update("security", v)} />
        </div>
      </section>

      <section className="panel danger-panel">
        <div><span className="eyebrow">DEMO DATA</span><h2>Reset sample tasks</h2><p>Restore the original TaskFlow demo tasks. This will remove tasks you created in this browser.</p></div>
        <button className="btn-secondary" onClick={restore}><RotateCcw size={16} /> Reset tasks</button>
      </section>
    </AppLayout>
  );
}
