import React, { useState, useRef, useEffect } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Zap,
  Bot,
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  User,
  Clock,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenTaskModal: () => void;
  onOpenOnboarding: () => void;
  onOpenAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  onOpenTaskModal,
  onOpenOnboarding,
  onOpenAssistant,
}) => {
  const {
    student,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveTab,
    overloadPercentage,
    startFocusMode,
    tasks,
  } = useStudySync();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuickFocus = () => {
    const uncompleted = tasks.filter((t) => !t.completed);
    const topTask = uncompleted.find((t) => t.priority === "CRITICAL") || uncompleted[0];
    if (topTask) {
      startFocusMode(topTask);
    } else {
      setActiveTab("what-to-do-now");
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Mobile toggle & Breadcrumb/Title */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-nav-toggle"
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {student.department.split(" ")[0]} • {student.year}
            </span>
            {overloadPercentage > 70 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                Overload Shield Active
              </span>
            )}
          </div>
        </div>

        {/* Center / Actions: Core "WHAT SHOULD I DO NOW?" Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Primary Action Button */}
          <button
            id="header-what-should-i-do-now"
            onClick={() => setActiveTab("what-to-do-now")}
            className="relative group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] transition-all duration-200"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">WHAT SHOULD I DO NOW?</span>
          </button>

          {/* Quick Focus Pomodoro Trigger */}
          <button
            id="header-quick-focus"
            onClick={handleQuickFocus}
            title="Launch active focus timer on highest priority task"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Focus Mode</span>
          </button>

          {/* Add Task Button */}
          <button
            id="header-add-task-btn"
            onClick={onOpenTaskModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* AI Assistant Chat Trigger */}
          <button
            id="header-ai-assistant-toggle"
            onClick={onOpenAssistant}
            title="Ask StudySync AI"
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="header-notif-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] text-[10px] font-bold text-white bg-rose-500 rounded-full text-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Smart Study Notifications</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications right now. Everything is running smoothly!
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                          notif.read ? "bg-slate-900/40 text-slate-400" : "bg-slate-800/50 text-slate-200"
                        } hover:bg-slate-800`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 text-center">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      setActiveTab("overload-manager");
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View Overload Shield Status →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            id="header-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Student Profile Pill */}
          <button
            id="header-profile-pill"
            onClick={onOpenOnboarding}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {student.name.charAt(0)}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-white leading-tight">{student.name.split(" ")[0]}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{student.college.split(" ")[0]}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
