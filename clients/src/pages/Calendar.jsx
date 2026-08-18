import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { getTasks } from "../services/taskStore";

const startOfWeek = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  return result;
};

const keyFor = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function Calendar() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date())
  );

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();

        // Support both:
        // response.data = [...]
        // response.data = { tasks: [...] }
        const taskList = Array.isArray(data)
          ? data
          : Array.isArray(data?.tasks)
            ? data.tasks
            : [];

        setTasks(taskList);
      } catch (error) {
        console.error("Failed to load calendar tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        return date;
      }),
    [weekStart]
  );

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(weekStart);

  const rangeLabel = `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(days[0])} – ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(days[6])}`;

  const todayKey = keyFor(new Date());

  const shiftWeek = (amount) => {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount * 7);
      return next;
    });
  };

  return (
    <AppLayout>
      <div className="calendar-panel panel">
        <div className="calendar-header">
          <div>
            <span className="eyebrow">
              {monthLabel.toUpperCase()}
            </span>

            <h2>{rangeLabel}</h2>
          </div>

          <div className="calendar-controls">
            <button
              className="icon-btn"
              onClick={() => shiftWeek(-1)}
              aria-label="Previous week"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className="today-btn"
              onClick={() =>
                setWeekStart(startOfWeek(new Date()))
              }
            >
              Today
            </button>

            <button
              className="icon-btn"
              onClick={() => shiftWeek(1)}
              aria-label="Next week"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="week-grid">
          {days.map((date) => {
            const key = keyFor(date);

            const dayTasks = tasks.filter((task) => {
              if (!task || !task.due) {
                return false;
              }

              return task.due === key;
            });

            const isToday = key === todayKey;

            return (
              <div
                className={`calendar-day ${
                  isToday ? "today" : ""
                }`}
                key={key}
              >
                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                  }).format(date)}
                </span>

                <strong>{date.getDate()}</strong>

                <div className="calendar-events">
                  {loading ? (
                    <span className="no-events">
                      Loading...
                    </span>
                  ) : dayTasks.length > 0 ? (
                    dayTasks.map((task) => (
                      <div
                        className={`event ${
                          task.priority
                            ? task.priority.toLowerCase()
                            : ""
                        }`}
                        key={task.id}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))
                  ) : (
                    <span className="no-events">
                      No tasks
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="calendar-footer">
          Tasks are shown by their due date. Manage tasks from{" "}
          <strong>My Tasks</strong>.
        </div>
      </div>
    </AppLayout>
  );
}