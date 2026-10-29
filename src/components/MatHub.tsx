import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  BookOpen,
  Upload,
  FileText,
  Sparkles,
  Copy,
  Check,
  Plus,
  Flame,
  BookmarkPlus,
  HelpCircle,
  Clock,
  Layers,
  FileCode,
} from "lucide-react";

export const MatHub: React.FC = () => {
  const { student, addTask, addNotification } = useStudySync();

  const [activeTab, setActiveTab] = useState<"answers" | "notes" | "analyzer" | "revision">("answers");

  // Mark-based answer generator states
  const [subject, setSubject] = useState("Operating Systems");
  const [question, setQuestion] = useState("Explain the Producer-Consumer Problem and solve it using Semaphores.");
  const [marks, setMarks] = useState<"2" | "5" | "8" | "13">("8");
  const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Question Paper Analyzer items
  const analyzedQuestions = [
    {
      topic: "Producer-Consumer Problem & Counting Semaphores",
      frequency: "Appeared 5 times in last 6 semester papers (92% probability)",
      tag: "VERY IMPORTANT",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      marks: "8 & 13 Marks",
    },
    {
      topic: "Peterson's Solution for Critical Section",
      frequency: "Appeared 4 times in last 6 semester papers (78% probability)",
      tag: "VERY IMPORTANT",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      marks: "5 & 8 Marks",
    },
    {
      topic: "Banker's Algorithm for Deadlock Avoidance",
      frequency: "Appeared 3 times in last 5 semester papers (65% probability)",
      tag: "IMPORTANT",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      marks: "13 Marks Numerical",
    },
    {
      topic: "Context Switching vs Process State Transitions",
      frequency: "Appeared 3 times in 2-mark sections",
      tag: "MODERATE",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      marks: "2 Marks",
    },
  ];

  const handleGenerateAnswer = async () => {
    if (!question.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/mat-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, marks: Number(marks), subject }),
      });
      const data = await res.json();
      if (data.answer) {
        setGeneratedAnswer(data.answer);
      }
    } catch (e) {
      console.warn("MAT Answer generation failed:", e);
      setGeneratedAnswer(
        `### ${question} (${marks} Marks Answer Format)\n\n` +
        `**1. Core Definition & Problem Context:**\n` +
        `The Producer-Consumer problem (also known as the Bounded-Buffer problem) is a classic multi-process synchronization problem. The producer generates data items and stores them into a shared buffer of fixed size N. The consumer removes data items from the buffer one by one.\n\n` +
        `**2. Primary Challenges & Race Conditions:**\n` +
        `- The producer must not attempt to insert items into a completely full buffer.\n` +
        `- The consumer must not attempt to consume items from an empty buffer.\n` +
        `- Mutual exclusion must be guaranteed so that concurrent read/write operations do not corrupt shared indices.\n\n` +
        `**3. Semaphore Solution Architecture:**\n` +
        `- \`mutex\`: Binary semaphore (initialized to 1) for mutual exclusion around buffer access.\n` +
        `- \`empty\`: Counting semaphore (initialized to N) tracking unoccupied slots.\n` +
        `- \`full\`: Counting semaphore (initialized to 0) tracking populated items.\n\n` +
        `**4. Pseudocode Walkthrough:**\n` +
        `\`\`\`c\n` +
        `// Producer Process:\n` +
        `do {\n` +
        `    item = produce_item();\n` +
        `    wait(empty);     // Decrement empty slot count\n` +
        `    wait(mutex);     // Enter critical section\n` +
        `    insert_into_buffer(item);\n` +
        `    signal(mutex);   // Exit critical section\n` +
        `    signal(full);    // Increment full slot count\n` +
        `} while(true);\n\n` +
        `// Consumer Process:\n` +
        `do {\n` +
        `    wait(full);      // Decrement full slot count\n` +
        `    wait(mutex);     // Enter critical section\n` +
        `    item = remove_from_buffer();\n` +
        `    signal(mutex);   // Exit critical section\n` +
        `    signal(empty);   // Increment empty slot count\n` +
        `    consume_item(item);\n` +
        `} while(true);\n` +
        `\`\`\`\n\n` +
        `**5. Key Exam Conclusion:**\n` +
        `This solution eliminates deadlock and race conditions by strictly ordering \`wait(empty)\` before \`wait(mutex)\`. Reversing this order would lead to an immediate deadlock.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTopicToPlan = (topicTitle: string, marksStr: string) => {
    addTask({
      title: `MAT — ${topicTitle}`,
      category: "MAT",
      duration: 35,
      priority: "HIGH",
      difficulty: "Medium",
      importance: 5,
      dueDays: 4,
      notes: `Target format: ${marksStr}. Frequently tested in university semester papers.`,
    });
    addNotification({
      title: "MAT Topic Added",
      message: `"${topicTitle}" added to your study schedule with High Priority.`,
      type: "success",
      category: "MAT",
    });
  };

  const handleCopy = () => {
    if (generatedAnswer) {
      navigator.clipboard.writeText(generatedAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            University Theory & Semester Exam Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MAT Hub — Theory Learning & Exam Mastery
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Mark-based university answer structures, repeated question analyzer, and rapid revision cheat-sheets.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab("answers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "answers" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Mark-Based Answers
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "analyzer" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Question Paper Analyzer
          </button>
          <button
            onClick={() => setActiveTab("revision")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "revision" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Quick Revision & Cheat Sheets
          </button>
        </div>
      </div>

      {/* Upload Material Simulation Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-2">
              Active Syllabus Material: Operating Systems Unit 2.pdf
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Indexed</span>
            </span>
            <p className="text-[11px] text-slate-400">
              Drag & drop PDFs, PPT slides, or lecture handwritten photos anytime.
            </p>
          </div>
        </div>

        <button className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Notes</span>
        </button>
      </div>

      {activeTab === "answers" && (
        <div className="space-y-6">
          {/* Answer Generator Form */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Operating Systems & Process Concurrency</option>
                  <option>Discrete Mathematical Structures</option>
                  <option>Database Management Systems</option>
                  <option>Formal Language & Automata Theory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Marks Format</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["2", "5", "8", "13"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMarks(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        marks === m
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {m} M
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Question or Prompt (As asked in University Papers)
              </label>
              <textarea
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Explain Banker's Algorithm with example and pseudo code..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Generates heading structures, diagrams, equations, and mark-tailored depth.
              </span>
              <button
                onClick={handleGenerateAnswer}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Formatting Answer..." : `Generate ${marks}-Mark Model Answer`}</span>
              </button>
            </div>
          </div>

          {/* Generated Answer Display */}
          {generatedAnswer && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {marks} Marks University Rubric
                  </span>
                  <span className="text-xs text-slate-400">{subject}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Answer"}</span>
                  </button>

                  <button
                    onClick={() => {
                      addNotification({
                        title: "Answer Saved",
                        message: `"${question.slice(0, 30)}..." saved to your local offline MAT notebook.`,
                        type: "success",
                        category: "MAT",
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save to My Notes</span>
                  </button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {generatedAnswer}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "analyzer" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Repeated Question Trend Analysis</h3>
            <p className="text-xs text-slate-400">
              Correlated across past 6 years of university examinations. Questions tagged by frequency and probability.
            </p>
          </div>

          <div className="space-y-3">
            {analyzedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${q.badgeColor}`}>
                      {q.tag}
                    </span>
                    <span className="text-xs font-bold text-white">{q.topic}</span>
                  </div>
                  <p className="text-xs text-slate-400">{q.frequency}</p>
                  <span className="text-[11px] text-indigo-400 font-semibold">{q.marks}</span>
                </div>

                <button
                  onClick={() => handleAddTopicToPlan(q.topic, q.marks)}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD TO MY PLAN</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "revision" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>10-Minute Rapid Concept Booster</span>
            </div>
            <h4 className="text-sm font-bold text-white">Semaphores vs Mutex Key Distinctions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              - <strong>Mutex:</strong> Locking mechanism used to synchronize access to a single resource. Ownership exists: only the process that locked can unlock.<br />
              - <strong>Semaphore:</strong> Signaling mechanism (Wait/Signal or P/V). No ownership: any process can signal. Useful for integer resource counts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Last-Minute Exam Formula / Mnemonic</span>
            </div>
            <h4 className="text-sm font-bold text-white">4 Necessary Conditions for Deadlock (COHN)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Remember <strong>C-O-H-N</strong>:<br />
              1. <strong>C</strong>ircular wait: Closed chain of processes requesting held resources.<br />
              2. <strong>O</strong>ld/Mutual exclusion: At least one resource held in non-shareable mode.<br />
              3. <strong>H</strong>old and wait: Process holds resources while requesting more.<br />
              4. <strong>N</strong>o preemption: Resources cannot be forcibly taken away.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
