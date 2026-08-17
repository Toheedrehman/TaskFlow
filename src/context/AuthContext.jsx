import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "taskflow_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (email, password) => {
    // Frontend-only mode. Replace with API call when backend is connected.
    const saved = JSON.parse(localStorage.getItem("taskflow_users") || "[]");
    const found = saved.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    );

    if (!found) throw new Error("Invalid email or password.");

    const safeUser = { id: found.id, name: found.name, email: found.email };
    setUser(safeUser);
    return safeUser;
  };

  const register = async (name, email, password) => {
    const saved = JSON.parse(localStorage.getItem("taskflow_users") || "[]");

    if (saved.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password
    };

    localStorage.setItem("taskflow_users", JSON.stringify([...saved, newUser]));

    const safeUser = { id: newUser.id, name, email };
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, register, logout, setUser }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
