import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Clock,
  Send,
  HelpCircle,
  X,
} from "lucide-react";

export const OverloadManager: React.FC = () => {
  const {
    student,
    tasks,
    overloadPercentage,
    optimizeWorkload,
    rebalanceScheduleWithAI,
    postponeTask,
    rescheduleTask,
    smartRescheduleTask,
    lastRescheduledTask,
    clearLastRescheduledTask,
    addNotification,
  } = useStudySync();

  const [missedTaskInput, setMissedTaskInput] = useState(
    "I couldn't complete my CAT arrays practice today because of unexpected college lab hours."
  );
  const [simulationResponse, setSimulationResponse] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeTasks = tasks.filter((t) => !t.completed);
  const mustDoTasks = activeTasks.filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH");
  const shouldDoTasks = activeTasks.filter((t) => t.priority === "MEDIUM");
  const canPostponeTasks = activeTasks.filter((t) => t.priority === "LOW" || t.dueDays > 3);

  const plannedHours = (activeTasks.reduce((acc, t) => acc + t.duration, 0) / 60).toFixed(1);

  const handleSimulateMissedTask = () => {
    if (!missedTaskInput.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      // Rebalance automatically using smartRescheduleTask
      const catTask = tasks.find((t) => t.category === "CAT");
      if (catTask) {
        smartRescheduleTask(catTask.id, "Unexpected college lab hours");
      }
      const projTask = tasks.find((t) => t.category === "Project");
      if (projTask) {
        postponeTask(projTask.id, 2);
      }

      setSimulationResponse(
        `“That's completely fine. College days get unpredictable. We moved your CAT Arrays Practice to tomorrow at 08:30 AM with a fresh mind, and shifted your Project Auth work to Saturday morning so your total daily load stays under ${student.dailyStudyHours} hours. Zero guilt, zero missed deadlines.”`
      );
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Autonomous Burnout Prevention
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Overload Manager & Guilt-Free Rebalancer
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Continuously audits academic cognitive load. Never uses guilt; dynamically sheds non-critical tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="overload-ai-auto-schedule-btn"
            onClick={() => rebalanceScheduleWithAI()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Auto-Schedule & Rebalance</span>
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

      {/* Main Overload Gauge & Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Live Overload Meter</span>
              <span className="text-slate-500">•</span>
              <span className={overloadPercentage > 70 ? "text-rose-400" : "text-emerald-400"}>
                {overloadPercentage > 70 ? "High Overload State" : "Sustainable Pacing"}
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-3">
              <span>{overloadPercentage}%</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {overloadPercentage > 75 ? "Active Shield Required" : "Balanced"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="overload-accept-rebalance-btn"
              onClick={() => rebalanceScheduleWithAI()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Accept Rebalance</span>
            </button>

            <button
              id="overload-optimize-btn"
              onClick={() => rebalanceScheduleWithAI()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>AI Auto-Schedule & Rebalance</span>
            </button>
          </div>
        </div>

        {/* Why is my workload high? Explanation */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Why is your workload at {overloadPercentage}%?</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 list-disc list-inside">
            <li>
              <strong>Immediate assessment pressure:</strong> CAT Arrays Lab Assessment is scheduled for tomorrow at 10:00 AM.
            </li>
            <li>
              <strong>MAT internal proximity:</strong> Operating Systems Unit 2 Internal Exam is in 5 days.
            </li>
            <li>
              <strong>Planned task volume:</strong> {plannedHours} hours of planned deep focus vs your target daily limit of {student.dailyStudyHours} hours.
            </li>
            <li>
              <strong>Multi-track congestion:</strong> Capstone sprint review (8d) and Smart India Hackathon (10d) overlap on the same weekend.
            </li>
          </ul>
        </div>

        {/* Automated Categorization Buckets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-2">
              <span>MUST DO TODAY</span>
              <span>{mustDoTasks.length} tasks</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Direct impact on GPA / lab assessment.</p>
            <div className="space-y-2">
              {mustDoTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{t.title}</p>
                    <span className="text-[10px] text-rose-400">{t.duration}m</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Due tomorrow</span>
                    <button
                      onClick={() => smartRescheduleTask(t.id, "I couldn't complete this today")}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1 transition-colors"
                      title="I couldn't complete this"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>I couldn't complete this</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
              <span>SHOULD DO IF ENERGETIC</span>
              <span>{shouldDoTasks.length} tasks</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Maintain steady revision pace.</p>
            <div className="space-y-2">
              {shouldDoTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{t.title}</p>
                    <span className="text-[10px] text-amber-400">{t.duration}m</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Due in {t.dueDays}d</span>
                    <button
                      onClick={() => smartRescheduleTask(t.id, "I couldn't complete this today")}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1 transition-colors"
                      title="I couldn't complete this"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>I couldn't complete this</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300 mb-2">
              <span>CAN POSTPONE SAFELY</span>
              <span>{canPostponeTasks.length} tasks</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Zero faculty penalties if deferred.</p>
            <div className="space-y-2">
              {canPostponeTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{t.title}</p>
                    <span className="text-[10px] text-slate-400">{t.duration}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => smartRescheduleTask(t.id, "I couldn't complete this")}
                      className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>I couldn't complete this</span>
                    </button>
                    <button
                      onClick={() => postponeTask(t.id, 2)}
                      className="text-[10px] px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 font-bold transition-colors"
                    >
                      +2d
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive: Simulate Missed Task Recovery */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Interactive Missed Task Rebalancer</h3>
            <p className="text-xs text-slate-400">
              Test how StudySync AI responds when life happens and you miss a study session.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={missedTaskInput}
            onChange={(e) => setMissedTaskInput(e.target.value)}
            placeholder="e.g. I couldn't complete my CAT practice today..."
            className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSimulateMissedTask}
            disabled={isSimulating}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSimulating ? "Rebalancing..." : "Simulate Missed Task"}</span>
          </button>
        </div>

        {simulationResponse && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-slate-200 animate-in fade-in space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>StudySync AI Encouraging Response</span>
            </div>
            <p className="italic leading-relaxed">{simulationResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
