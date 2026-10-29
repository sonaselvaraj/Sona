import React from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  TrendingUp,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Code2,
  BookOpen,
  FolderGit2,
  Trophy,
  Briefcase,
  Languages,
  MessageSquareQuote,
  HeartPulse,
  RotateCcw,
} from "lucide-react";

export const ProgressDashboard: React.FC = () => {
  const { tasks, overloadPercentage, setActiveTab, optimizeWorkload } = useStudySync();

  const completedTasks = tasks.filter((t) => t.completed);
  const remainingTasks = tasks.filter((t) => !t.completed);
  const totalTasks = tasks.length;
  const completionRate = Math.round((completedTasks.length / Math.max(1, totalTasks)) * 100);

  const categoriesData = [
    { name: "CAT Coding", icon: Code2, completed: 3, total: 4, hours: "3.5h", color: "from-indigo-500 to-violet-600" },
    { name: "MAT Theory", icon: BookOpen, completed: 2, total: 4, hours: "2.8h", color: "from-blue-500 to-cyan-600" },
    { name: "Projects", icon: FolderGit2, completed: 2, total: 3, hours: "4.0h", color: "from-emerald-500 to-teal-600" },
    { name: "Hackathons", icon: Trophy, completed: 1, total: 2, hours: "1.5h", color: "from-amber-500 to-orange-600" },
    { name: "Internships", icon: Briefcase, completed: 1, total: 2, hours: "1.2h", color: "from-purple-500 to-pink-600" },
    { name: "Japanese", icon: Languages, completed: 4, total: 5, hours: "1.8h", color: "from-rose-500 to-red-600" },
    { name: "Spoken English", icon: MessageSquareQuote, completed: 3, total: 3, hours: "1.0h", color: "from-teal-500 to-emerald-600" },
    { name: "Wellness", icon: HeartPulse, completed: 5, total: 5, hours: "1.2h", color: "from-green-500 to-emerald-600" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Performance & Habit Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Progress & Today's Review
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Holistic growth metrics across academics, coding lab benchmarks, and personal consistency.
          </p>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          <div>
            <span className="text-sm font-black block">4-Day Active Streak</span>
            <span className="text-[10px] text-slate-400">Consistent study momentum</span>
          </div>
        </div>
      </div>

      {/* Today's Evening Review Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Autonomous Daily Review
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              Today's Retrospective & Realignment
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
            Plan Achievement: {completionRate}%
          </span>
        </div>

        {/* AI Empathetic Feedback */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Encouragement & Balance Insight</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            “You did great on CAT Arrays and English pitch practice today. We moved the remaining non-urgent items to tomorrow morning so you can rest and sleep on time. Tomorrow's first focus is your 10:00 AM CAT assessment.”
          </p>
        </div>

        {/* Tasks status breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Completed Today ({completedTasks.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {completedTasks.map((t) => (
                <div key={t.id} className="text-xs text-slate-300 truncate">
                  ✓ {t.title}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Remaining / Rebalanced ({remainingTasks.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {remainingTasks.map((t) => (
                <div key={t.id} className="text-xs text-slate-400 truncate">
                  • {t.title} ({t.duration}m)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={optimizeWorkload}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESCHEDULE REMAINING</span>
          </button>

          <button
            onClick={() => setActiveTab("day-planner")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>VIEW TOMORROW'S PLAN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Progress Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Multi-Category Academic & Skill Benchmarks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesData.map((cat, idx) => {
            const Icon = cat.icon;
            const pct = Math.round((cat.completed / cat.total) * 100);
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{cat.hours} logged</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{cat.completed} of {cat.total} tasks</span>
                    <span className="font-semibold text-white">{pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
