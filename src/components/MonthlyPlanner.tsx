import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  CalendarDays,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  ShieldAlert,
  Layers,
  ChevronRight,
} from "lucide-react";

export const MonthlyPlanner: React.FC = () => {
  const { student } = useStudySync();

  const [selectedDuration, setSelectedDuration] = useState<"7d" | "15d" | "30d" | "45d" | "60d">("30d");
  const [targetGoal, setTargetGoal] = useState("Prepare for CAT 2 Assessments + MAT Internal 1 + Capstone MVP");

  const durationOptions = [
    { id: "7d", label: "7 Days Sprint" },
    { id: "15d", label: "15 Days" },
    { id: "30d", label: "30 Days (Month)" },
    { id: "45d", label: "45 Days" },
    { id: "60d", label: "60 Days (Semester)" },
  ];

  // Roadmap Milestones
  const roadmapWeeks = [
    {
      week: "Week 1: Core Coding & Unit 2 Theory",
      focus: "Arrays, Two-Pointers, OS Process Scheduling & Semaphores",
      status: "In Progress",
      milestones: [
        { title: "CAT Arrays Lab Assessment", type: "assessment", day: "Day 2", done: false },
        { title: "MAT Unit 2 Process Concurrency Notes & 8-mark answers", type: "theory", day: "Day 5", done: false },
        { title: "Weekly Buffer Day (Zero new tasks)", type: "buffer", day: "Day 7", done: true },
      ],
    },
    {
      week: "Week 2: MAT Internal 1 & Capstone Sprint",
      focus: "Deadlock Detection, Memory Management, Project Auth & Backend",
      status: "Upcoming",
      milestones: [
        { title: "MAT Internal 1 Examination (OS & Discrete Maths)", type: "exam", day: "Day 10", done: false },
        { title: "Capstone Sprint 2 Architecture Review", type: "project", day: "Day 13", done: false },
        { title: "Smart India Hackathon PPT Submission", type: "hackathon", day: "Day 15", done: false },
      ],
    },
    {
      week: "Week 3: Advanced Data Structures & Mock Assessments",
      focus: "LinkedLists, Stacks, Queues, DBMS Normalization",
      status: "Upcoming",
      milestones: [
        { title: "Full Mock CAT Assessment (Timed 60 min)", type: "mock", day: "Day 19", done: false },
        { title: "DBMS SQL Subqueries & Relational Algebra Revision", type: "theory", day: "Day 22", done: false },
        { title: "Mid-Term Overload Buffer Checkpoint", type: "buffer", day: "Day 24", done: false },
      ],
    },
    {
      week: "Week 4: Comprehensive Review & Internship Push",
      focus: "Trees, Graphs preview, Resume Submissions, JLPT N5 Mock",
      status: "Upcoming",
      milestones: [
        { title: "Apply to Razorpay & CRED Software Internships", type: "internship", day: "Day 27", done: false },
        { title: "CAT Viva Readiness Simulation", type: "viva", day: "Day 29", done: false },
        { title: "Monthly Retrospective & Velocity Scorecard", type: "review", day: "Day 30", done: false },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Monthly / Custom Roadmap Planner
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Macro-level student roadmap spanning 7 to 60 days with built-in overload buffer zones.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Regenerate Roadmap</span>
        </button>
      </div>

      {/* Target Goal & Duration Selectors */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Current Target Milestone
          </label>
          <input
            type="text"
            value={targetGoal}
            onChange={(e) => setTargetGoal(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Horizon Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedDuration(opt.id as any)}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  selectedDuration === opt.id
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overload Shield Protection Callout */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs text-slate-200">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            <strong>Built-in Buffer Days:</strong> Every week includes a designated rest/buffer window where zero new syllabus is assigned to absorb unexpected assignment spikes.
          </span>
        </div>
        <span className="font-bold text-emerald-400 whitespace-nowrap hidden sm:inline">2 Buffer Days Scheduled</span>
      </div>

      {/* Weekly Milestones List */}
      <div className="space-y-4">
        {roadmapWeeks.map((week, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {week.week.split(":")[0]}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {week.week.split(":")[1]}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{week.focus}</p>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                  week.status === "In Progress"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {week.status}
              </span>
            </div>

            {/* Sub-milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {week.milestones.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-2 ${
                    m.type === "buffer"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : m.type === "exam" || m.type === "assessment"
                      ? "bg-rose-950/20 border-rose-500/30 text-rose-300"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                      {m.day} • {m.type}
                    </span>
                    {m.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="font-semibold text-white leading-snug">{m.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
