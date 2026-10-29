import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Zap,
  Clock,
  Flame,
  ArrowRight,
  RefreshCw,
  Calendar,
  Sparkles,
  ChevronRight,
  Layers,
  AlertCircle,
  Play,
  SlidersHorizontal,
  Compass,
  RotateCcw,
  HelpCircle,
  X,
} from "lucide-react";
import { StudentTask } from "../types";

export const WhatShouldIDoNow: React.FC = () => {
  const {
    tasks,
    recommendation,
    isAnalyzingRecommendation,
    refreshRecommendation,
    startFocusMode,
    setActiveTab,
    overloadPercentage,
    postponeTask,
    smartRescheduleTask,
    lastRescheduledTask,
    clearLastRescheduledTask,
    student,
  } = useStudySync();

  const [showAlternativeSelector, setShowAlternativeSelector] = useState(false);

  // Find the current recommended task object
  const activeTasks = tasks.filter((t) => !t.completed);
  const currentTask = tasks.find((t) => t.id === recommendation?.taskId) || activeTasks[0] || tasks[0];

  const handleStartTask = () => {
    if (currentTask) {
      startFocusMode(currentTask);
    }
  };

  const priorityColors = {
    CRITICAL: {
      badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      border: "from-rose-500/30 via-violet-500/20 to-indigo-500/30",
      glow: "shadow-rose-500/10",
      dot: "bg-rose-500",
    },
    HIGH: {
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      border: "from-amber-500/30 via-indigo-500/20 to-violet-500/30",
      glow: "shadow-amber-500/10",
      dot: "bg-amber-500",
    },
    MEDIUM: {
      badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      border: "from-indigo-500/30 via-slate-700/20 to-violet-500/30",
      glow: "shadow-indigo-500/10",
      dot: "bg-indigo-500",
    },
    LOW: {
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      border: "from-emerald-500/30 via-slate-700/20 to-teal-500/30",
      glow: "shadow-emerald-500/10",
      dot: "bg-emerald-500",
    },
  };

  const priorityStyle = priorityColors[currentTask?.priority || "HIGH"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Sub-header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Dynamic Prioritization Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WHAT SHOULD I DO NOW?
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Real-time multi-factor decision considering CAT exams, MAT units, projects & personal capacity.
          </p>
        </div>

        <button
          id="reanalyze-workload-btn"
          onClick={refreshRecommendation}
          disabled={isAnalyzingRecommendation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isAnalyzingRecommendation ? "animate-spin" : ""}`} />
          <span>{isAnalyzingRecommendation ? "Analyzing factors..." : "Re-calculate Priority"}</span>
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

      {/* Main Hero Card: WHAT SHOULD I DO NOW? */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden group">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: AI Status & Duration */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${priorityStyle.dot}`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${priorityStyle.dot}`} />
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                AI Recommended Task
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {currentTask?.category || "Academic"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priorityStyle.badge} flex items-center gap-1.5`}>
                <Flame className="w-3.5 h-3.5" />
                {currentTask?.priority || "HIGH"} Priority
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                ⏱ {currentTask?.duration || 45} minutes
              </span>
            </div>
          </div>

          {/* Task Title & High-impact headline */}
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {currentTask?.title || "CAT — Arrays Assessment Practice"}
            </h2>
            {currentTask?.notes && (
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                {currentTask.notes}
              </p>
            )}
          </div>

          {/* "Why now?" Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Why now?</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
              {recommendation?.reason ||
                `Your assessment is tomorrow and current progress is 60%. This has higher urgency than your project task, which is due in 8 days.`}
            </p>
          </div>

          {/* "AI Decision Reasoning" */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs sm:text-sm text-slate-300 flex items-start gap-3">
            <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">AI Decision Logic: </span>
              <span>
                {recommendation?.aiDecision ||
                  `I selected this because your CAT assessment is tomorrow, while your other tasks have later deadlines.`}
              </span>
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              id="what-to-do-now-start-task"
              onClick={handleStartTask}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-violet-600 to-indigo-600 hover:from-amber-400 hover:via-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.01]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START TASK NOW</span>
            </button>

            {currentTask && (
              <button
                onClick={() => smartRescheduleTask(currentTask.id, "I couldn't complete this today")}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-colors"
                title="I couldn't complete this"
              >
                <RotateCcw className="w-4 h-4" />
                <span>I couldn't complete this</span>
              </button>
            )}

            <button
              id="what-to-do-now-change-task"
              onClick={() => setShowAlternativeSelector(!showAlternativeSelector)}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>{showAlternativeSelector ? "Hide Alternatives" : "CHANGE TASK"}</span>
            </button>

            <button
              id="what-to-do-now-view-plan"
              onClick={() => setActiveTab("day-planner")}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>VIEW FULL PLAN</span>
            </button>
          </div>

          {/* Alternative Task Selector Drawer */}
          {showAlternativeSelector && (
            <div className="pt-4 mt-4 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Other Candidate Tasks Ranked by AI
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTasks
                  .filter((t) => t.id !== currentTask?.id)
                  .slice(0, 4)
                  .map((alt) => (
                    <div
                      key={alt.id}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/50 transition-colors flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {alt.category}
                          </span>
                          <h4 className="text-xs font-semibold text-white mt-1">{alt.title}</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">⏱ {alt.duration}m</span>
                      </div>
                      <div className="text-[11px] text-slate-400 italic">
                        {alt.whyExplanation || `Ranked lower: Due in ${alt.dueDays} days with ${alt.priority} priority.`}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
                        <button
                          onClick={() => startFocusMode(alt)}
                          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          Focus on this instead <ChevronRight className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => smartRescheduleTask(alt.id, "I couldn't complete this")}
                            className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 flex items-center gap-1 transition-colors"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>I couldn't complete this</span>
                          </button>
                          <button
                            onClick={() => postponeTask(alt.id, 2)}
                            className="text-[11px] text-slate-400 hover:text-amber-400"
                          >
                            +2d
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decision Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Factor 1: Proximity */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Assessment & Exam Proximity</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            CAT Arrays Assessment is scheduled for tomorrow morning. In college engineering, coding assessments require active memory retrieval rather than passive reading.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-rose-400">
            Impact Weight: 45% (Highest)
          </div>
        </div>

        {/* Factor 2: Available Capacity */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Today's Available Energy Window</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Target study time: {student.dailyStudyHours} hours. Recommended 45-minute block fits neatly into your {student.preferredTime.toLowerCase()} study block without triggering fatigue.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-amber-400">
            Impact Weight: 30%
          </div>
        </div>

        {/* Factor 3: Overload Protection */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Guilt-Free Buffer Protection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Secondary tasks (Project documentation, Japanese practice) can be postponed by 48 hours without faculty penalties, keeping your workload manageable.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-indigo-400">
            Impact Weight: 25%
          </div>
        </div>
      </div>
    </div>
  );
};
