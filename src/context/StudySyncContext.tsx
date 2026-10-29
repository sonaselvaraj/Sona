import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  StudentProfile,
  StudentTask,
  HackathonItem,
  InternshipItem,
  NotificationItem,
  ActiveTab,
  PriorityLevel,
  TaskCategory,
  ScheduleBlock,
} from "../types";
import {
  initialStudentProfile,
  initialTasks,
  initialHackathons,
  initialInternships,
  initialNotifications,
  initialScheduleBlocks,
} from "../data/initialData";

interface RecommendationResult {
  taskId?: string | null;
  taskName: string;
  category: TaskCategory;
  duration: number;
  priority: PriorityLevel;
  reason: string;
  aiDecision: string;
  nextSuggestedTask?: string;
  source?: "gemini" | "heuristic";
}

interface StudySyncContextType {
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  tasks: StudentTask[];
  addTask: (task: Omit<StudentTask, "id" | "completed">) => void;
  updateTask: (id: string, updates: Partial<StudentTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  rescheduleTask: (id: string, newTimeSlot: string, reason?: string) => void;
  postponeTask: (id: string, daysAhead?: number) => void;
  optimizeWorkload: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  activeFocusTask: StudentTask | null;
  startFocusMode: (task: StudentTask) => void;
  exitFocusMode: () => void;
  overloadPercentage: number;
  recommendation: RecommendationResult | null;
  isAnalyzingRecommendation: boolean;
  refreshRecommendation: () => Promise<void>;
  hackathons: HackathonItem[];
  toggleHackathonRegistration: (id: string) => void;
  internships: InternshipItem[];
  toggleInternshipApplication: (id: string) => void;
  scheduleBlocks: ScheduleBlock[];
  setScheduleBlocks: React.Dispatch<React.SetStateAction<ScheduleBlock[]>>;
  toggleScheduleBlockStatus: (id: string) => void;
  optimizeDaySchedule: () => void;
  rebalanceScheduleWithAI: () => Promise<void> | void;
  smartRescheduleTask: (taskId: string, reason?: string) => void;
  lastRescheduledTask: StudentTask | null;
  clearLastRescheduledTask: () => void;
  resetDemoData: () => void;
}

const StudySyncContext = createContext<StudySyncContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: "studysync_profile_v1",
  TASKS: "studysync_tasks_v1",
  THEME: "studysync_theme_v1",
  NOTIFS: "studysync_notifs_v1",
  SCHEDULE: "studysync_schedule_v1",
};

export const StudySyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : initialStudentProfile;
    } catch {
      return initialStudentProfile;
    }
  });

  // 2. Tasks State
  const [tasks, setTasks] = useState<StudentTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  // 3. Theme State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return (saved === "light" || saved === "dark") ? saved : "dark";
    } catch {
      return "dark";
    }
  });

  // 4. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  // 5. Schedule Blocks State
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : initialScheduleBlocks;
    } catch {
      return initialScheduleBlocks;
    }
  });

  const [lastRescheduledTask, setLastRescheduledTask] = useState<StudentTask | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [activeFocusTask, setActiveFocusTask] = useState<StudentTask | null>(null);
  const [hackathons, setHackathons] = useState<HackathonItem[]>(initialHackathons);
  const [internships, setInternships] = useState<InternshipItem[]>(initialInternships);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isAnalyzingRecommendation, setIsAnalyzingRecommendation] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleBlocks));
  }, [scheduleBlocks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Dynamic Workload Calculation
  // Daily available minutes = student.dailyStudyHours * 60
  // Planned minutes = sum of active (uncompleted) tasks due within 1 day
  const availableMinutes = (student.dailyStudyHours || 3.5) * 60;
  const activeTodayTasks = tasks.filter((t) => !t.completed && (t.dueDays <= 1));
  const plannedMinutes = activeTodayTasks.reduce((acc, t) => acc + (t.duration || 40), 0);
  const rawRatio = Math.round((plannedMinutes / Math.max(availableMinutes, 60)) * 100);
  // Clamp visually between 20% and 98%
  const overloadPercentage = Math.min(Math.max(rawRatio, 24), 96);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...updates }));
  };

  const addTask = (taskData: Omit<StudentTask, "id" | "completed">) => {
    const newTask: StudentTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    addNotification({
      title: "Task Added",
      message: `"${newTask.title}" scheduled (${newTask.duration}m, ${newTask.priority} priority).`,
      type: "success",
      category: newTask.category,
    });
  };

  const updateTask = (id: string, updates: Partial<StudentTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            addNotification({
              title: "Task Finished! 🎉",
              message: `Great focus on "${t.title}". Load reduced by ${t.duration} minutes!`,
              type: "success",
              category: t.category,
            });
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const rescheduleTask = (id: string, newTimeSlot: string, reason?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              scheduledTime: newTimeSlot,
              whyExplanation: reason || `Rescheduled to ${newTimeSlot} to maintain manageable pace.`,
            }
          : t
      )
    );
    addNotification({
      title: "Schedule Rebalanced",
      message: `Task rescheduled to ${newTimeSlot}. Workload optimized.`,
      type: "wellness",
    });
  };

  const postponeTask = (id: string, daysAhead = 2) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              dueDays: (t.dueDays || 1) + daysAhead,
              postponed: true,
              whyExplanation: `Postponed by ${daysAhead} days. AI moved this to make room for urgent assessments.`,
            }
          : t
      )
    );
    addNotification({
      title: "Task Postponed Safely",
      message: "Moved lower priority task forward. Your study energy is preserved for today.",
      type: "wellness",
    });
  };

  const optimizeWorkload = () => {
    // Guilt-free rebalance: move lowest priority uncompleted tasks with >2 days deadline
    setTasks((prev) => {
      let count = 0;
      return prev.map((t) => {
        if (!t.completed && (t.priority === "LOW" || t.priority === "MEDIUM") && t.dueDays <= 1 && t.category !== "CAT") {
          count++;
          return {
            ...t,
            dueDays: t.dueDays + 2,
            postponed: true,
            whyExplanation: "StudySync AI moved this task forward by 2 days to protect your assessment focus.",
          };
        }
        return t;
      });
    });

    addNotification({
      title: "Workload Optimized 🛡️",
      message: "Non-critical tasks safely rebalanced to later dates. Zero guilt, 100% focus.",
      type: "success",
    });
  };

  const toggleScheduleBlockStatus = (id: string) => {
    setScheduleBlocks((prev) =>
      prev.map((block) => {
        if (block.id === id) {
          const nextStatus = block.status === "completed" ? "pending" : "completed";
          return {
            ...block,
            status: nextStatus,
            completed: nextStatus === "completed",
          };
        }
        return block;
      })
    );
  };

  const optimizeDaySchedule = () => {
    optimizeWorkload();
    setScheduleBlocks((prev) =>
      prev.map((block) => {
        if (
          !block.isFixed &&
          block.status === "pending" &&
          (block.category === "Project" || block.category === "Japanese" || block.category === "Personal")
        ) {
          return {
            ...block,
            timeSlot: "Evening Buffer (19:30 - 20:00)",
            time: "Evening Buffer (19:30 - 20:00)",
            status: "pending",
          };
        }
        return block;
      })
    );
    addNotification({
      title: "Schedule Rebalanced with AI 🛡️",
      message: "Dynamic time-blocking adjusted to prevent overload. Assessment prep prioritized.",
      type: "success",
    });
  };

  const rebalanceScheduleWithAI = async () => {
    optimizeDaySchedule();
  };

  const smartRescheduleTask = (taskId: string, reason?: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const defaultExplanation = `StudySync AI shifted this task to protect your daily study limit and sleep window. CAT Arrays practice has higher immediate assessment priority for tomorrow, so this task was safely rescheduled by 1 day with zero guilt.`;
    const explanation = reason ? `${reason} — ${defaultExplanation}` : defaultExplanation;

    const updatedTask: StudentTask = {
      ...targetTask,
      dueDays: (targetTask.dueDays || 0) + 1,
      postponed: true,
      scheduledTime: "Tomorrow Evening",
      whyExplanation: explanation,
      rescheduledReason: reason || "I couldn't complete this",
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    setLastRescheduledTask(updatedTask);

    addNotification({
      title: "Task Safely Rescheduled 🛡️",
      message: `"${targetTask.title}" moved to tomorrow's recovery slot. Zero guilt, 100% focus.`,
      type: "wellness",
      category: targetTask.category,
    });
  };

  const clearLastRescheduledTask = () => {
    setLastRescheduledTask(null);
  };

  const addNotification = (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 15)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const startFocusMode = (task: StudentTask) => {
    setActiveFocusTask(task);
  };

  const exitFocusMode = () => {
    setActiveFocusTask(null);
  };

  const toggleHackathonRegistration = (id: string) => {
    setHackathons((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isRegistered: !h.isRegistered } : h))
    );
  };

  const toggleInternshipApplication = (id: string) => {
    setInternships((prev) =>
      prev.map((item) => (item.id === id ? { ...item, applied: !item.applied } : item))
    );
  };

  const refreshRecommendation = async () => {
    setIsAnalyzingRecommendation(true);
    try {
      const res = await fetch("/api/ai/what-to-do-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student,
          tasks,
          availableMinutes,
        }),
      });
      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (e) {
      console.warn("Error fetching recommendation:", e);
      // Fallback
      const active = tasks.filter((t) => !t.completed);
      const best = active[0] || tasks[0];
      setRecommendation({
        taskId: best?.id,
        taskName: best?.title || "CAT Arrays Assessment Practice",
        category: best?.category || "CAT",
        duration: best?.duration || 45,
        priority: best?.priority || "CRITICAL",
        reason: "Your CAT assessment is tomorrow and current progress is 60%. Highest urgency.",
        aiDecision: "Assessment tomorrow. This has higher priority than projects due in 8 days.",
        nextSuggestedTask: "MAT Unit 2 Process Concurrency",
        source: "heuristic",
      });
    } finally {
      setIsAnalyzingRecommendation(false);
    }
  };

  // Initial recommendation on mount
  useEffect(() => {
    refreshRecommendation();
  }, []);

  const resetDemoData = () => {
    setStudent(initialStudentProfile);
    setTasks(initialTasks);
    setScheduleBlocks(initialScheduleBlocks);
    setLastRescheduledTask(null);
    setHackathons(initialHackathons);
    setInternships(initialInternships);
    setNotifications(initialNotifications);
    addNotification({
      title: "Demo Data Restored",
      message: "Loaded 2nd-year CSE student profile with upcoming CAT & MAT assessments.",
      type: "success",
    });
  };

  return (
    <StudySyncContext.Provider
      value={{
        student,
        setStudent,
        updateProfile,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        rescheduleTask,
        postponeTask,
        optimizeWorkload,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        activeFocusTask,
        startFocusMode,
        exitFocusMode,
        overloadPercentage,
        recommendation,
        isAnalyzingRecommendation,
        refreshRecommendation,
        hackathons,
        toggleHackathonRegistration,
        internships,
        toggleInternshipApplication,
        scheduleBlocks,
        setScheduleBlocks,
        toggleScheduleBlockStatus,
        optimizeDaySchedule,
        rebalanceScheduleWithAI,
        smartRescheduleTask,
        lastRescheduledTask,
        clearLastRescheduledTask,
        resetDemoData,
      }}
    >
      {children}
    </StudySyncContext.Provider>
  );
};

export const useStudySync = () => {
  const context = useContext(StudySyncContext);
  if (!context) {
    throw new Error("useStudySync must be used within a StudySyncProvider");
  }
  return context;
};

// Aliases for compatibility
export const useAppContext = useStudySync;
export const AppContext = StudySyncContext;
export const AppProvider = StudySyncProvider;
