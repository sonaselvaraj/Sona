import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun,
  Coffee,
  Play,
  RotateCcw,
  BookOpen,
  HelpCircle,
  X,
} from "lucide-react";

export const DayPlanner: React.FC = () => {
  const {
    student,
    tasks,
    scheduleBlocks,
    toggleScheduleBlockStatus,
    rebalanceScheduleWithAI,
    optimizeWorkload,
    postponeTask,
    rescheduleTask,
    smartRescheduleTask,
    lastRescheduledTask,
    clearLastRescheduledTask,
    startFocusMode,
  } = useStudySync();

  const [activeSubTab, setActiveSubTab] = useState<"today" | "tomorrow">("today");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [availableHours, setAvailableHours] = useState(student.dailyStudyHours || 3.5);

  const activeTasks = tasks.filter((t) => !t.completed);
  const totalPlannedMinutes = activeTasks.reduce((acc, t) => acc + (t.duration || 40), 0);
  const totalAvailableMinutes = availableHours * 60;
  const isOverloaded = totalPlannedMinutes > totalAvailableMinutes;

  // Study-time calculation based on schedule blocks using status, isFixed, and category
  const isStudyBlock = (b: { category: string; type?: string }) =>
    b.type === "task" || (b.category !== "Break" && b.category !== "Wellness" && b.category !== "Recovery");

  const studyBlocks = scheduleBlocks.filter(isStudyBlock);
  const totalStudyMinutes = studyBlocks.reduce((acc, b) => acc + (b.duration || 0), 0);
  const completedStudyMinutes = studyBlocks
    .filter((b) => b.status === "completed")
    .reduce((acc, b) => acc + (b.duration || 0), 0);
  const remainingStudyMinutes = Math.max(0, totalStudyMinutes - completedStudyMinutes);
  const fixedStudyMinutes = studyBlocks
    .filter((b) => b.isFixed)
    .reduce((acc, b) => acc + (b.duration || 0), 0);
  const flexibleStudyMinutes = studyBlocks
    .filter((b) => !b.isFixed)
    .reduce((acc, b) => acc + (b.duration || 0), 0);

  // Segment tasks into Must Do, Should Do, Can Do Later
  const mustDoTasks = activeTasks.filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH");
  const shouldDoTasks = activeTasks.filter((t) => t.priority === "MEDIUM");
  const canDoLaterTasks = activeTasks.filter((t) => t.priority === "LOW" || t.dueDays > 4);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Smart Day Planner</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Automatic time-blocking with zero guilt and intelligent overload protection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Auto-Schedule & Rebalance button */}
          <button
            id="ai-auto-schedule-btn"
            onClick={() => rebalanceScheduleWithAI()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Auto-Schedule & Rebalance</span>
          </button>

          {/* Sub-tab pills */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setActiveSubTab("today")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "today"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setActiveSubTab("tomorrow")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "tomorrow"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Plan Tomorrow in Advance ✨
            </button>
          </div>
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

      {activeSubTab === "today" ? (
        <>
          {/* Controls Bar: Available Hours & Date */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Planning For
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full md:w-80">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Available Study Hours Today</span>
                <span className="text-indigo-400">{availableHours} hrs ({Math.round(totalAvailableMinutes)} min)</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="text-right w-full md:w-auto flex items-center justify-between md:flex-col md:items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Planned Tasks</span>
              <span className={`text-sm font-black ${isOverloaded ? "text-rose-400" : "text-emerald-400"}`}>
                {totalPlannedMinutes} min / {Math.round(totalAvailableMinutes)} min
              </span>
            </div>
          </div>

          {/* Study Time Calculation Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Study Time
              </span>
              <span className="text-base sm:text-lg font-black text-white">
                {Math.round(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{studyBlocks.length} scheduled blocks</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Completed Study Time
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-300">
                {Math.round(completedStudyMinutes / 60)}h {completedStudyMinutes % 60}m
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {studyBlocks.filter((b) => b.status === "completed").length} blocks done
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Remaining Study Time
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {Math.round(remainingStudyMinutes / 60)}h {remainingStudyMinutes % 60}m
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {studyBlocks.filter((b) => b.status !== "completed").length} blocks left
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                Fixed vs Flexible
              </span>
              <span className="text-base sm:text-lg font-black text-indigo-300">
                {Math.round(fixedStudyMinutes / 60)}h / {Math.round(flexibleStudyMinutes / 60)}h
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Fixed college / Self-study</span>
            </div>
          </div>

          {/* Overload Alert Warning with Accept Rebalance */}
          {isOverloaded && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-indigo-950/40 border border-rose-500/40 text-slate-200 animate-in fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>You have more work than available time ({totalPlannedMinutes - totalAvailableMinutes}m over capacity)</span>
                </div>
                <p className="text-xs text-slate-300">
                  College students cannot sprint 7 hours without crashing. Let StudySync AI protect your CAT assessment focus by rescheduling non-critical work.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                  <span className="text-rose-300">MUST DO: {mustDoTasks.length} tasks</span>
                  <span className="text-amber-300">SHOULD DO: {shouldDoTasks.length} tasks</span>
                  <span className="text-slate-400">CAN DO LATER: {canDoLaterTasks.length} tasks</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="accept-rebalance-btn"
                  onClick={() => rebalanceScheduleWithAI()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 whitespace-nowrap transition-all"
                >
                  Accept Rebalance
                </button>
              </div>
            </div>
          )}

          {/* Time-Blocked Schedule Table from scheduleBlocks */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Generated Time-Blocked Schedule</h3>
                <p className="text-xs text-slate-400">Includes interspersed cognitive breaks and status toggle tracking.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rebalanceScheduleWithAI()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-colors"
                >
                  AI Auto-Schedule & Rebalance
                </button>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Window: {student.preferredTime}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {scheduleBlocks.map((slot) => {
                const isBreak = slot.type === "break";
                const isDone = slot.status === "completed" || slot.completed;

                return (
                  <div
                    key={slot.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isDone
                        ? "bg-slate-950/60 border-slate-800 opacity-75"
                        : isBreak
                        ? "bg-slate-950/40 border-slate-800/80 text-slate-400 italic"
                        : slot.urgent || slot.priority === "CRITICAL"
                        ? "bg-indigo-950/20 border-indigo-500/40 hover:border-indigo-500"
                        : "bg-slate-800/50 border-slate-700/70"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Status toggle button */}
                      <button
                        onClick={() => toggleScheduleBlockStatus(slot.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isDone
                            ? "bg-emerald-500 text-slate-950 shadow-sm"
                            : "border-2 border-slate-600 hover:border-indigo-400 bg-slate-950"
                        }`}
                        title={isDone ? "Mark as Pending" : "Mark as Completed"}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4 fill-current text-slate-950" />}
                      </button>

                      <div className="w-24 shrink-0 font-mono text-xs font-bold text-slate-300">
                        {slot.timeSlot || slot.time}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-bold truncate ${isDone ? "line-through text-slate-400" : isBreak ? "text-slate-400" : "text-white"}`}>
                            {slot.taskTitle || slot.title}
                          </span>
                          {slot.urgent && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                              PRIORITY
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              slot.isFixed
                                ? "bg-slate-800 text-slate-400 border border-slate-700"
                                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            }`}
                          >
                            {slot.isFixed ? "Fixed" : "Flexible"}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isDone
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {slot.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{slot.category}</span>
                          <span>•</span>
                          <span>⏱ {slot.duration}m</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {!isBreak && !isDone && !slot.isFixed && (
                        <button
                          onClick={() => {
                            const taskObj = tasks.find((t) => t.category === slot.category) || tasks[0];
                            if (taskObj) smartRescheduleTask(taskObj.id, "Couldn't finish today");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="I couldn't complete this"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>I couldn't complete this</span>
                        </button>
                      )}

                      {!isBreak && !isDone && (
                        <button
                          onClick={() => {
                            const taskObj = tasks.find((t) => t.category === slot.category) || tasks[0];
                            if (taskObj) startFocusMode(taskObj);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span className="hidden sm:inline">Start</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buckets Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                <span>🔴 MUST DO TODAY</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Critical items with immediate deadlines.</p>
              <div className="space-y-2">
                {mustDoTasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-800/60 text-xs text-slate-200">
                    <p className="font-semibold text-white">{t.title}</p>
                    <span className="text-[10px] text-slate-400">{t.duration}m • Assessment tomorrow</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <span>🟠 SHOULD DO IF TIME PERMITS</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Moderate deadlines within the week.</p>
              <div className="space-y-2">
                {shouldDoTasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-800/60 text-xs text-slate-200">
                    <p className="font-semibold text-white">{t.title}</p>
                    <span className="text-[10px] text-slate-400">{t.duration}m • In {t.dueDays} days</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                <span>🟢 CAN POSTPONE SAFELY</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Safe to defer without penalty.</p>
              <div className="space-y-2">
                {canDoLaterTasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-800/60 text-xs text-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t.title}</p>
                      <span className="text-[10px] text-slate-400">{t.duration}m</span>
                    </div>
                    <button
                      onClick={() => postponeTask(t.id, 2)}
                      className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-300 hover:text-white"
                    >
                      +2d
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Dedicated Tomorrow Planning Workflow */
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>7-Step Autonomous Tomorrow Planning</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Tomorrow's Pre-Flight Plan</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Plan in advance so you wake up with complete mental clarity. Zero morning decision fatigue.
            </p>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Step 1 & 2: Assessment Urgency Check</span>
                  <span className="text-rose-400">CAT Arrays Tomorrow 10:00 AM</span>
                </div>
                <p className="text-xs text-slate-400">
                  Since your CAT assessment is tomorrow, the morning schedule prioritizes a 45-minute active recall drill on Arrays and Two-Pointers before entering the lab.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Step 3 & 4: Multi-Track Balance</span>
                  <span className="text-indigo-400">CAT + MAT + Japanese</span>
                </div>
                <p className="text-xs text-slate-400">
                  After the CAT lab, afternoon energy is dedicated to MAT Unit 2 process concurrency (40 min) followed by a 20-min gentle Japanese Kanji session.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Moon className="w-4 h-4" />
                  <span>Calm Preparation Advice for Tonight</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  “Sleep on time tonight. No late-night panic cramming. Your brain consolidates algorithm logic during REM sleep. Tomorrow morning's first focus is CAT arrays.”
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={() => {
                  rebalanceScheduleWithAI();
                  setActiveSubTab("today");
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
              >
                Apply Tomorrow's Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
