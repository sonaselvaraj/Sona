import React, { useState, useEffect } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";

export const FocusModeOverlay: React.FC = () => {
  const { activeFocusTask, exitFocusMode, toggleTaskCompletion, overloadPercentage } = useStudySync();

  if (!activeFocusTask) return null;

  const initialSeconds = (activeFocusTask.duration || 45) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [ambientSound, setAmbientSound] = useState(false);
  const [microSteps, setMicroSteps] = useState([
    { text: "Read assessment prompt & constraints carefully", done: true },
    { text: "Draft approach & complexity bounds on scratchpad", done: false },
    { text: "Implement core algorithm with zero compile errors", done: false },
    { text: "Test corner cases (empty, single element, duplicates)", done: false },
  ]);

  // Audio synthesizer for gentle ambient pink noise
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let noiseNode: AudioNode | null = null;

    if (ambientSound) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          const bufferSize = audioCtx.sampleRate * 2;
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + 0.02 * white) / 1.02; // soft pink filter
            lastOut = data[i];
            data[i] *= 0.04; // low volume
          }
          const whiteNoise = audioCtx.createBufferSource();
          whiteNoise.buffer = buffer;
          whiteNoise.loop = true;
          whiteNoise.connect(audioCtx.destination);
          whiteNoise.start();
          noiseNode = whiteNoise;
        }
      } catch (e) {
        console.warn("Audio context not allowed yet:", e);
      }
    }

    return () => {
      if (noiseNode) {
        try {
          (noiseNode as any).stop?.();
        } catch {}
      }
      if (audioCtx) {
        try {
          audioCtx.close?.();
        } catch {}
      }
    };
  }, [ambientSound]);

  // Countdown timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleStep = (index: number) => {
    setMicroSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, done: !step.done } : step))
    );
  };

  const handleFinishTask = () => {
    toggleTaskCompletion(activeFocusTask.id);
    exitFocusMode();
  };

  const progressPercent = Math.round(((initialSeconds - secondsRemaining) / initialSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200 text-slate-100">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        {/* Top bar controls */}
        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
              Active Focus Mode • Distraction-Free
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAmbientSound(!ambientSound)}
              title="Toggle calming pink noise"
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                ambientSound
                  ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Sound: {ambientSound ? "ON" : "OFF"}</span>
            </button>
            <button
              onClick={exitFocusMode}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Giant Countdown Display */}
        <div className="relative z-10 my-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
            <span>{activeFocusTask.category}</span>
            <span>•</span>
            <span className="text-amber-300">{activeFocusTask.priority} Priority</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {activeFocusTask.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {activeFocusTask.notes || activeFocusTask.whyExplanation || "Focus purely on this session without switching contexts."}
          </p>

          {/* Big Timer Digits */}
          <div className="py-4">
            <div className="text-6xl sm:text-8xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-indigo-300 tracking-tight">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-2">
              {progressPercent}% completed ({Math.round(secondsRemaining / 60)} min left)
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
            >
              {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? "Pause Timer" : "Resume"}</span>
            </button>

            <button
              onClick={() => setSecondsRemaining((prev) => prev + 300)}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              +5 Minutes
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsRemaining(initialSeconds);
              }}
              title="Reset Timer"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Micro-steps Checklist */}
        <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Session Milestones & Micro-Goals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {microSteps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => handleToggleStep(idx)}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center gap-2.5 transition-all text-xs ${
                  step.done
                    ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    step.done ? "bg-emerald-500 text-slate-950" : "border border-slate-600"
                  }`}
                >
                  {step.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={step.done ? "line-through opacity-80" : ""}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Complete Action */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Completing will reduce today's workload to {Math.max(20, overloadPercentage - 15)}%</span>
          </div>

          <button
            id="focus-complete-task-btn"
            onClick={handleFinishTask}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Task & Rebalance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
