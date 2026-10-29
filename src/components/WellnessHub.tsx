import React, { useState, useEffect } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  HeartPulse,
  Droplets,
  Eye,
  Wind,
  Moon,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";

export const WellnessHub: React.FC = () => {
  const { student, addNotification } = useStudySync();

  // Water tracker
  const [glasses, setGlasses] = useState(5);
  const targetGlasses = 8;

  // 4-7-8 Breathing circle state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathTimer, setBreathTimer] = useState(4);

  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === "Inhale") {
              setBreathPhase("Hold");
              return 7;
            } else if (breathPhase === "Hold") {
              setBreathPhase("Exhale");
              return 8;
            } else {
              setBreathPhase("Inhale");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const handleAddWater = () => {
    if (glasses < targetGlasses) {
      const next = glasses + 1;
      setGlasses(next);
      if (next === targetGlasses) {
        addNotification({
          title: "Daily Hydration Goal Met! 💧",
          message: "You reached 2.0L of water today! Peak cognitive function unlocked.",
          type: "wellness",
        });
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            Student Cognitive Health & Ergonomics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Wellness Hub — Burnout Defense & Vitality
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Hydration tracking, 4-7-8 parasympathetic breath cycles, screen rest, and exam sleep hygiene.
          </p>
        </div>
      </div>

      {/* Sleep Schedule Recommendation for Tomorrow's CAT Assessment */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Moon className="w-4 h-4" />
            <span>Optimal Exam Sleep Schedule</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Recommended Bedtime Tonight: 11:30 PM (Wake up 07:30 AM)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            “You have a CAT Arrays Assessment at 10:00 AM tomorrow. Algorithm recall and pointer tracking degrade by 35% under sleep deprivation. We recommend sleeping by 11:30 PM to ensure high-focus performance.”
          </p>
        </div>

        <div className="text-right self-start sm:self-auto shrink-0">
          <span className="text-2xl font-black text-indigo-400">8.0 hrs</span>
          <span className="text-xs text-slate-400 block font-medium">REM Recovery Target</span>
        </div>
      </div>

      {/* Grid: Hydration & Breathing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Tracker */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Daily Hydration Goal</span>
              </div>
              <span className="text-xs font-bold text-cyan-400">
                {glasses * 250}ml / {targetGlasses * 250}ml
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 my-4">
              {Array.from({ length: targetGlasses }).map((_, i) => (
                <div
                  key={i}
                  className={`h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    i < glasses
                      ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-600"
                  }`}
                >
                  <Droplets className={`w-5 h-5 ${i < glasses ? "text-cyan-400 fill-cyan-400" : ""}`} />
                  <span className="text-[10px] font-bold mt-1">250ml</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              Proper hydration speeds mental processing and reduces screen headaches during long coding labs.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setGlasses(0)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Reset
            </button>
            <button
              onClick={handleAddWater}
              disabled={glasses >= targetGlasses}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              + Drink 1 Glass (250ml)
            </button>
          </div>
        </div>

        {/* 4-7-8 Breathing Circle */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between items-center text-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>4-7-8 Parasympathetic Reset</span>
            </div>
            <p className="text-xs text-slate-400">
              Calms pre-exam adrenaline and restores prefrontal cortex clarity in 60 seconds.
            </p>
          </div>

          {/* Animated Circle */}
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                breathingActive
                  ? breathPhase === "Inhale"
                    ? "border-teal-400 scale-110 bg-teal-500/10"
                    : breathPhase === "Hold"
                    ? "border-amber-400 scale-110 bg-amber-500/10"
                    : "border-indigo-400 scale-90 bg-indigo-500/10"
                  : "border-slate-800"
              }`}
            />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {breathingActive ? breathPhase : "Ready"}
              </span>
              <span className="text-4xl font-mono font-black text-white">
                {breathingActive ? `${breathTimer}s` : "4-7-8"}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setBreathingActive(!breathingActive);
              setBreathPhase("Inhale");
              setBreathTimer(4);
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{breathingActive ? "Stop Exercise" : "Start Guided Cycle"}</span>
          </button>
        </div>
      </div>

      {/* Ergonomics & 20-20-20 Rule */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Eye className="w-4 h-4" />
            <span>20-20-20 Screen Rule</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every 20 minutes of coding, look at something 20 feet away for 20 seconds. Relaxes ciliary eye muscles.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <HeartPulse className="w-4 h-4" />
            <span>Shoulder & Wrist Flex</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Roll shoulders backward 5 times. Extend wrist back for 15 seconds to prevent developer carpal tunnel strain.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Sparkles className="w-4 h-4" />
            <span>Guilt-Free Permission</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Taking a 10-minute break is not procrastination. It is the physiological foundation of sustained focus.
          </p>
        </div>
      </div>
    </div>
  );
};
