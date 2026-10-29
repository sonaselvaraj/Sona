import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import { TaskCategory, PriorityLevel, StudentTask } from "../types";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Check,
  RotateCcw,
  Clock,
  Trash2,
  Play,
  Calendar,
  AlertCircle,
  MoreVertical,
  HelpCircle,
  X,
} from "lucide-react";

export const TaskListView: React.FC<{ onOpenTaskModal: () => void }> = ({ onOpenTaskModal }) => {
  const {
    tasks,
    toggleTaskCompletion,
    deleteTask,
    postponeTask,
    smartRescheduleTask,
    lastRescheduledTask,
    clearLastRescheduledTask,
    startFocusMode,
    addNotification,
  } = useStudySync();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

  const categories = [
    "All",
    "CAT",
    "MAT",
    "Assignment",
    "Project",
    "Hackathon",
    "Internship",
    "Japanese",
    "Spoken English",
    "Wellness",
  ];

  const filteredTasks = tasks.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCat) return false;
    }

    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (selectedPriority !== "All" && t.priority !== selectedPriority) return false;

    if (filterStatus === "pending" && t.completed) return false;
    if (filterStatus === "completed" && !t.completed) return false;

    return true;
  });

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "MEDIUM":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "LOW":
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            Task Management Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Study Tasks ({tasks.length})
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Organized by exam urgency, algorithmic complexity, and cognitive load.
          </p>
        </div>

        <button
          onClick={onOpenTaskModal}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* "Why did I move this?" explanation card */}
      {lastRescheduledTask && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border border-amber-500/40 text-slate-200 shadow-xl animate-in fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Why did I move this?
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {lastRescheduledTask.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lastRescheduledTask.whyExplanation ||
                  "Moved forward by 1 day to protect your cognitive bandwidth and prevent late-night cramming. CAT assessment has immediate priority."}
              </p>
            </div>
          </div>

          <button
            onClick={clearLastRescheduledTask}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 self-start sm:self-auto"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across tasks, subjects, code topics, or notes..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
            {(["all", "pending", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  filterStatus === status
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <CheckSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No tasks match your filters</h3>
            <p className="text-xs text-slate-400">Try clearing filters or add a new academic task.</p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                t.completed
                  ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Completion Checkbox */}
                <button
                  onClick={() => toggleTaskCompletion(t.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    t.completed
                      ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                      : "border-2 border-slate-600 hover:border-indigo-400 bg-slate-950"
                  }`}
                >
                  {t.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {t.category}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getPriorityStyle(t.priority)}`}>
                      {t.priority}
                    </span>
                    {t.difficulty && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {t.difficulty}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold text-white ${
                      t.completed ? "line-through text-slate-500" : ""
                    }`}
                  >
                    {t.title}
                  </h3>

                  {t.notes && (
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{t.notes}</p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {t.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Due in {t.dueDays} {t.dueDays === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!t.completed && (
                  <button
                    onClick={() => startFocusMode(t)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Focus</span>
                  </button>
                )}

                {!t.completed && (
                  <button
                    onClick={() => smartRescheduleTask(t.id, "I couldn't complete this")}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="I couldn't complete this"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">I couldn't complete this</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    postponeTask(t.id, 1);
                    addNotification({
                      title: "Task Postponed",
                      message: `"${t.title}" moved 1 day ahead to protect your sleep schedule.`,
                      type: "rescheduled",
                    });
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                  title="Postpone by 1 day"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
