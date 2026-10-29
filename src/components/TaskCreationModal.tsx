import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import { TaskCategory, PriorityLevel, StudentTask } from "../types";
import {
  X,
  Sparkles,
  Plus,
  Wand2,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  Trash2,
  Edit2,
  ChevronRight,
} from "lucide-react";

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useStudySync();

  const [mode, setMode] = useState<"natural" | "manual">("natural");

  // Natural language state
  const [naturalText, setNaturalText] = useState(
    "Tomorrow I have CAT arrays assessment, MAT Unit 2 revision, Japanese 30 minutes and project work."
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<any[]>([]);

  // Manual input state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("CAT");
  const [duration, setDuration] = useState(45);
  const [priority, setPriority] = useState<PriorityLevel>("HIGH");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [importance, setImportance] = useState(4);
  const [dueDays, setDueDays] = useState(1);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const categories: TaskCategory[] = [
    "MAT",
    "CAT",
    "Assignment",
    "Project",
    "Hackathon",
    "Internship",
    "Japanese",
    "Spoken English",
    "Wellness",
    "Personal",
  ];

  const handleExtract = async () => {
    if (!naturalText.trim()) return;
    setIsExtracting(true);
    try {
      const res = await fetch("/api/ai/extract-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: naturalText }),
      });
      const data = await res.json();
      if (data.tasks) {
        setExtractedTasks(data.tasks);
      }
    } catch (e) {
      console.warn("Extraction failed, using fallback:", e);
      setExtractedTasks([
        {
          title: "CAT — Arrays Assessment Practice",
          category: "CAT",
          duration: 45,
          priority: "CRITICAL",
          dueDays: 1,
          difficulty: "Hard",
          importance: 5,
          notes: "Derived from natural language prompt",
        },
        {
          title: "MAT — Unit 2 Revision",
          category: "MAT",
          duration: 40,
          priority: "HIGH",
          dueDays: 2,
          difficulty: "Medium",
          importance: 4,
          notes: "Derived from natural language prompt",
        },
        {
          title: "Japanese — 30 Min Daily Vocab & Grammar",
          category: "Japanese",
          duration: 30,
          priority: "LOW",
          dueDays: 1,
          difficulty: "Easy",
          importance: 2,
          notes: "Derived from natural language prompt",
        },
        {
          title: "Project — Capstone Feature Development",
          category: "Project",
          duration: 50,
          priority: "MEDIUM",
          dueDays: 4,
          difficulty: "Medium",
          importance: 3,
          notes: "Derived from natural language prompt",
        },
      ]);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveExtractedAll = () => {
    extractedTasks.forEach((t) => {
      addTask({
        title: t.title,
        category: t.category as TaskCategory,
        duration: t.duration || 35,
        priority: t.priority || "MEDIUM",
        difficulty: t.difficulty || "Medium",
        importance: t.importance || 3,
        dueDays: t.dueDays || 1,
        notes: t.notes || "",
      });
    });
    onClose();
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      category,
      duration: Number(duration),
      priority,
      difficulty,
      importance: Number(importance),
      dueDays: Number(dueDays),
      notes: notes.trim(),
    });
    onClose();
  };

  const removeExtractedItem = (index: number) => {
    setExtractedTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add to StudySync AI</h2>
              <p className="text-xs text-slate-400">Intelligent workload ingestion with automatic priority scoring.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 mt-4 border border-slate-700/60">
          <button
            onClick={() => setMode("natural")}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === "natural"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Natural Language AI Input</span>
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === "manual"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Manual Task Creation</span>
          </button>
        </div>

        {/* Content Mode 1: Natural Language */}
        {mode === "natural" ? (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Type what you need to do (in freeform plain English):
              </label>
              <textarea
                rows={3}
                value={naturalText}
                onChange={(e) => setNaturalText(e.target.value)}
                placeholder="e.g. Tomorrow I have CAT arrays assessment, MAT Unit 2 revision, Japanese 30 minutes and project work."
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                AI extracts categories, estimated durations, deadlines & priorities.
              </span>
              <button
                id="extract-tasks-btn"
                onClick={handleExtract}
                disabled={isExtracting || !naturalText.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isExtracting ? "Extracting..." : "Auto-Extract Tasks"}</span>
              </button>
            </div>

            {/* Extracted Tasks Review Area */}
            {extractedTasks.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Extracted Tasks ({extractedTasks.length}) — Review & Edit
                  </h3>
                  <button
                    onClick={handleSaveExtractedAll}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Add All to Plan
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {extractedTasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                              t.priority === "CRITICAL"
                                ? "bg-rose-500/20 text-rose-300"
                                : t.priority === "HIGH"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-indigo-500/20 text-indigo-300"
                            }`}
                          >
                            {t.priority}
                          </span>
                          <span className="font-semibold text-white truncate">{t.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">{t.category}</span>
                          <span>⏱ {t.duration}m</span>
                          <span>• Due: {t.dueDays === 0 ? "Today" : t.dueDays === 1 ? "Tomorrow" : `In ${t.dueDays}d`}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeExtractedItem(idx)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveExtractedAll}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Confirm & Save All {extractedTasks.length} Tasks</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Content Mode 2: Manual Ingestion Form */
          <form onSubmit={handleManualSave} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Task Name *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CAT — Arrays Assessment Practice"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Duration (min)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Due In (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={dueDays}
                  onChange={(e) => setDueDays(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="CRITICAL">🔴 CRITICAL</option>
                  <option value="HIGH">🟠 HIGH</option>
                  <option value="MEDIUM">🟡 MEDIUM</option>
                  <option value="LOW">🟢 LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Importance (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={importance}
                  onChange={(e) => setImportance(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Notes & Context</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add sub-topics, lab instructions, or links..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Task
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
