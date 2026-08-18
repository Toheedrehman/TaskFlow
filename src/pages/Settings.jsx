import { useEffect, useState } from "react";
import { Bell, Lock, Moon, ShieldCheck } from "lucide-react";
import AppLayout from "../components/AppLayout";

const SETTINGS_KEY = "taskflow_settings";

const defaults = {
  notifications: true,
  darkMode: true,
  activity: true,
  security: true,
};

function SettingRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="setting-row">
      <div className="setting-icon">
        <Icon size={18} />
      </div>

      <div className="setting-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span />
      </label>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);

      return {
        ...defaults,
        ...(saved ? JSON.parse(saved) : {}),
      };
    } catch {
      return defaults;
    }
  });

  // Apply dark/light mode when settings change
  useEffect(() => {
    const root = document.documentElement;

    if (settings.darkMode) {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    } else {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    }

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  const update = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <AppLayout>
      <section className="panel settings-panel">
        <div className="panel-head">
          <div>
            <span className="eyebrow">PREFERENCES</span>
            <h2>Workspace settings</h2>
          </div>
        </div>

        <div className="settings-list">

          <SettingRow
            icon={Bell}
            title="Task notifications"
            description="Receive reminders for upcoming and overdue tasks."
            checked={settings.notifications}
            onChange={(value) =>
              update("notifications", value)
            }
          />

          <SettingRow
            icon={Moon}
            title="Dark mode"
            description={
              settings.darkMode
                ? "Dark interface is currently enabled."
                : "Light interface is currently enabled."
            }
            checked={settings.darkMode}
            onChange={(value) =>
              update("darkMode", value)
            }
          />

          <SettingRow
            icon={ShieldCheck}
            title="Activity alerts"
            description="Get notified when important workspace activity happens."
            checked={settings.activity}
            onChange={(value) =>
              update("activity", value)
            }
          />

          <SettingRow
            icon={Lock}
            title="Login security"
            description="Keep your account protected with secure sessions."
            checked={settings.security}
            onChange={(value) =>
              update("security", value)
            }
          />

        </div>
      </section>

      <section className="panel danger-panel">
        <div>
          <span className="eyebrow">TASK DATA</span>
          <h2>Task management</h2>
          <p>
            Your tasks are securely stored in the MongoDB
            database. You can manage them from the My Tasks
            page.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}