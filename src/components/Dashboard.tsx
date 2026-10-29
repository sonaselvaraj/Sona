import React from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Zap,
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Code2,
  FolderGit2,
  Trophy,
  Briefcase,
  Languages,
  MessageSquareQuote,
  HeartPulse,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  X,
  RotateCcw,
} from "lucide-react";

export const Dashboard: React.FC<{ onOpenTaskModal: () => void }> = ({ onOpenTaskModal }) => {
  const {
    student,
    tasks,
    toggleTaskCompletion,
    startFocusMode,
    setActiveTab,
    overloadPercentage,
    recommendation,
    optimizeWorkload,
    smartRescheduleTask,
    lastRescheduledTask,
    clearLastRescheduledTask,
  } = useStudySync();

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Top recommended task
  const topTask = tasks.find((t) => t.id === recommendation?.taskId) || activeTasks[0] || tasks[0];

  // Today's load numbers
  const availableMinutes = (student.dailyStudyHours || 3.5) * 60;
  const plannedMinutes = activeTasks.reduce((acc, t) => acc + (t.duration || 30), 0);
  const remainingMinutes = Math.max(0, availableMinutes - completedTasks.reduce((acc, t) => acc + (t.duration || 30), 0));

  const priorityBadges = {
    CRITICAL: { icon: "🔴", text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
    HIGH: { icon: "🟠", text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    MEDIUM: { icon: "🟡", text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    LOW: { icon: "🟢", text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  };

  // Upcoming deadlines data
  const deadlines = [
    { title: "CAT Arrays Lab Assessment", due: "Tomorrow (10:00 AM)", category: "CAT", urgency: "Critical", days: 1 },
    { title: "MAT OS Process Scheduling Internal", due: "5 days away", category: "MAT", urgency: "High", days: 5 },
    { title: "Capstone Project Sprint 2 Review", due: "8 days away", category: "Project", urgency: "Medium", days: 8 },
    { title: "Smart India Hackathon Registration", due: "10 days away", category: "Hackathon", urgency: "Medium", days: 10 },
    { title: "Razorpay SWE Intern Application", due: "14 days away", category: "Internship", urgency: "Low", days: 14 },
  ];

  // Category progress cards
  const progressCards = [
    { title: "CAT Coding", icon: Code2, progress: 68, target: "Arrays & 2-Pointers", color: "from-indigo-500 to-violet-600", tab: "cat-hub" },
    { title: "MAT Theory", icon: BookOpen, progress: 54, target: "Unit 2 Concurrency", color: "from-blue-500 to-cyan-600", tab: "mat-hub" },
    { title: "Projects", icon: FolderGit2, progress: 75, target: "Sprint 2 Architecture", color: "from-emerald-500 to-teal-600", tab: "project-hub" },
    { title: "Hackathons", icon: Trophy, progress: 40, target: "SIH Team Pitch Draft", color: "from-amber-500 to-orange-600", tab: "hackathon-hub" },
    { title: "Internships", icon: Briefcase, progress: 60, target: "LeetCode Top 50 + Resume", color: "from-purple-500 to-pink-600", tab: "internship-hub" },
    { title: "Japanese", icon: Languages, progress: 45, target: "JLPT N5 Day 14 Kanji", color: "from-rose-500 to-red-600", tab: "japanese-ai" },
    { title: "Spoken English", icon: MessageSquareQuote, progress: 80, target: "STAR Interview Pitch", color: "from-teal-500 to-emerald-600", tab: "spoken-english" },
    { title: "Wellness", icon: HeartPulse, progress: 90, target: "Daily Stretches & Hydration", color: "from-green-500 to-emerald-600", tab: "wellness" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {student.name} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">
            “Let's make today manageable.”
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("day-planner")}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Plan Today</span>
          </button>
          <button
            onClick={onOpenTaskModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Task</span>
          </button>
        </div>
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

      {/* 1. Large Prominent Card: WHAT SHOULD I DO NOW? */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 p-6 sm:p-8 shadow-xl shadow-indigo-500/10 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                WHAT SHOULD I DO NOW?
              </span>
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {topTask?.priority || "HIGH"} Priority
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                AI Recommended Task • {topTask?.category || "CAT"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {topTask?.title || "CAT — Arrays Assessment Practice"}
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                ⏱ {topTask?.duration || 45} minutes
              </span>
              <span className="text-slate-400">
                Due: {topTask?.dueDays === 0 ? "Today" : topTask?.dueDays === 1 ? "Tomorrow morning" : `In ${topTask?.dueDays} days`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-xs sm:text-sm text-slate-200">
              <span className="font-bold text-amber-300">Why now? </span>
              <span>
                {recommendation?.reason ||
                  "Your assessment is tomorrow and this task has the highest urgency."}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              id="dashboard-start-task-btn"
              onClick={() => startFocusMode(topTask)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START TASK</span>
            </button>

            <button
              onClick={() => {
                if (topTask) smartRescheduleTask(topTask.id, "I couldn't complete this today");
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>I couldn't complete this</span>
            </button>

            <button
              id="dashboard-view-full-plan-btn"
              onClick={() => setActiveTab("what-to-do-now")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              <span>VIEW FULL PLAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Load & Overload Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Indicator Card */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Load</h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  overloadPercentage > 75
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {overloadPercentage > 75 ? "High Pressure" : "Healthy Rhythm"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-extrabold text-white">Today's Workload:</span>
              <span className={`text-3xl font-black ${overloadPercentage > 75 ? "text-rose-400" : "text-indigo-400"}`}>
                {overloadPercentage}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 mt-4 overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  overloadPercentage > 75
                    ? "bg-gradient-to-r from-amber-500 to-rose-500"
                    : "bg-gradient-to-r from-indigo-500 to-emerald-400"
                }`}
                style={{ width: `${overloadPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Available</span>
                <span className="text-xs font-bold text-white">{Math.round(availableMinutes / 60)}h {availableMinutes % 60}m</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Planned</span>
                <span className="text-xs font-bold text-amber-300">{Math.round(plannedMinutes / 60)}h {plannedMinutes % 60}m</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Remaining</span>
                <span className="text-xs font-bold text-emerald-400">{Math.round(remainingMinutes / 60)}h {remainingMinutes % 60}m</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {overloadPercentage > 75 ? "3 deadlines this week" : "Study load balanced"}
            </span>
            <button
              onClick={optimizeWorkload}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Rebalance
            </button>
          </div>
        </div>

        {/* Today's Priorities List */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Today's Priorities</h3>
              <p className="text-[11px] text-slate-400">Order computed by deadline proximity and assessment weight.</p>
            </div>
            <button
              onClick={() => setActiveTab("tasks")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View all tasks ({tasks.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((task, idx) => {
              const badge = priorityBadges[task.priority] || priorityBadges.MEDIUM;
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? "bg-slate-950/40 border-slate-800/60 opacity-60 line-through"
                      : "bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{badge.icon}</span>
                        <span className="text-xs font-bold text-white truncate">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">{task.category}</span>
                        <span>⏱ {task.duration}m</span>
                        <span>• {task.dueDays === 0 ? "Today" : task.dueDays === 1 ? "Tomorrow" : `In ${task.dueDays}d`}</span>
                      </div>
                    </div>
                  </div>

                  {!task.completed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => smartRescheduleTask(task.id, "I couldn't complete this today")}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        title="I couldn't complete this"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">I couldn't complete this</span>
                      </button>
                      <button
                        onClick={() => startFocusMode(task)}
                        className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors"
                        title="Start focused session"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Upcoming Deadlines Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Upcoming Academic & Career Deadlines</h2>
            <p className="text-xs text-slate-400">Track milestones across CAT assessments, MAT internals, hackathons and internships.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {deadlines.map((d, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{d.category}</span>
                  <span className={d.urgency === "Critical" ? "text-rose-400" : d.urgency === "High" ? "text-amber-400" : "text-slate-400"}>
                    {d.days === 1 ? "🔥 Tomorrow" : `in ${d.days} days`}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{d.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{d.due}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Progress Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Progress Overview</h2>
            <p className="text-xs text-slate-400">Multi-domain balance across your college curriculum and skill tracks.</p>
          </div>
          <button
            onClick={() => setActiveTab("progress")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Detailed Analytics →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {progressCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(card.tab as any)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:scale-[1.01] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold text-white">{card.progress}%</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{card.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{card.target}</p>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                    style={{ width: `${card.progress}%` }}
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
