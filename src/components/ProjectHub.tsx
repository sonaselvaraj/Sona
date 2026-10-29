import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  Sparkles,
  Layers,
  Presentation,
  ListTodo,
  FileSpreadsheet,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const ProjectHub: React.FC = () => {
  const { addTask, addNotification } = useStudySync();

  const [activeTab, setActiveTab] = useState<"lifecycle" | "ideator" | "ppt">("lifecycle");

  // Project stages
  const stages = [
    { id: "idea", name: "IDEA", done: true },
    { id: "research", name: "RESEARCH", done: true },
    { id: "design", name: "DESIGN", done: true },
    { id: "development", name: "DEVELOPMENT", current: true, done: false },
    { id: "testing", name: "TESTING", done: false },
    { id: "demo", name: "DEMO", done: false },
    { id: "submission", name: "SUBMISSION", done: false },
  ];

  // Current stage checklist
  const [devTasks, setDevTasks] = useState([
    { id: 1, text: "Design PostgreSQL schema & Drizzle ORM models", done: true },
    { id: 2, text: "Implement JWT authentication & refresh token rotation", done: true },
    { id: 3, text: "Build RESTful API endpoints for task CRUD operations", done: false },
    { id: 4, text: "Connect frontend React state to Express backend endpoints", done: false },
    { id: 5, text: "Implement responsive layout for mobile viewport testing", done: false },
  ]);

  // Idea generator states
  const [techDomain, setTechDomain] = useState("AI & Web");
  const [industryDomain, setIndustryDomain] = useState("Education & Student Productivity");
  const [complexity, setComplexity] = useState("Intermediate");
  const [generatedIdea, setGeneratedIdea] = useState<any>(null);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  // PPT review presentation slides
  const reviewSlides = [
    { num: "Slide 1", title: "Project Title, Team Members & Guide", desc: "College affiliation, department, student names & roll numbers." },
    { num: "Slide 2", title: "Problem Statement & Motivation", desc: "Why does this problem exist? Quantify student overload or pain points." },
    { num: "Slide 3", title: "Existing Systems vs Proposed Solution", desc: "Comparative matrix showing why existing solutions fall short." },
    { num: "Slide 4", title: "System Architecture & Data Flow", desc: "Block diagram showing Client, Server API, AI Engine, and Database." },
    { num: "Slide 5", title: "Key Modules & Implementation Highlights", desc: "Code architecture, security considerations, algorithms used." },
    { num: "Slide 6", title: "Live Working Prototype / Screen Demos", desc: "Interactive demo walkthrough or video backup recording." },
    { num: "Slide 7", title: "Testing & Validation Benchmarks", desc: "Unit tests, latency benchmarks, edge cases handled." },
    { num: "Slide 8", title: "Future Scope & Conclusion", desc: "Extensions like mobile app, notifications, cloud scale." },
  ];

  const handleToggleTask = (id: number) => {
    setDevTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleGenerateIdea = () => {
    setIsGeneratingIdea(true);
    setTimeout(() => {
      setGeneratedIdea({
        title: "CampusFlow: Autonomous College Schedule & Lab Queue Manager",
        problem: "Engineering students wait 45+ minutes in crowded hardware labs and struggle to coordinate review schedules with faculty.",
        solution: "A lightweight cloud app leveraging real-time slots, QR lab pass tokens, and predictive waiting time estimation.",
        techStack: ["React", "TypeScript", "Node.js Express", "PostgreSQL", "Socket.io"],
        features: [
          "Live lab machine occupancy tracker",
          "Automated queue alert when student turn is 5 min away",
          "Faculty office hours appointment scheduling",
          "Offline QR code verification",
        ],
      });
      setIsGeneratingIdea(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            Engineering Capstone & Mini-Project Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Project Hub — 7-Stage Lifecycle & Guide Review Prep
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Track from idea to final faculty review viva, generate architectural blueprints, and prepare slide decks.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab("lifecycle")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "lifecycle" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Lifecycle Tracker
          </button>
          <button
            onClick={() => setActiveTab("ideator")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ideator" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Idea Generator ✨
          </button>
          <button
            onClick={() => setActiveTab("ppt")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ppt" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            PPT & Guide Prep
          </button>
        </div>
      </div>

      {activeTab === "lifecycle" && (
        <div className="space-y-6 animate-in fade-in">
          {/* 7-Stage Progress Bar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Capstone Project: StudySync AI & Student OS
              </span>
              <span className="text-xs font-bold text-indigo-400">Stage 4: DEVELOPMENT (58% Total Progress)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {stages.map((st, i) => (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    st.current
                      ? "bg-indigo-600/20 border-indigo-500 text-white font-bold ring-2 ring-indigo-500/30"
                      : st.done
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider mb-1">Step {i + 1}</div>
                  <div className="text-xs font-black truncate">{st.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Stage Milestones Checklist */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Stage 4: Development Sprints Checklist</h3>
                <p className="text-xs text-slate-400">Review deliverables due in 8 days before department guide evaluation.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                {devTasks.filter((t) => t.done).length}/{devTasks.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {devTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    task.done
                      ? "bg-slate-950/40 border-slate-800/60 text-slate-400 line-through"
                      : "bg-slate-800/60 border-slate-700/80 text-white hover:border-indigo-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      task.done ? "bg-emerald-500 text-slate-950" : "border border-slate-600"
                    }`}
                  >
                    {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "ideator" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Engineering Project Idea & Problem Statement Builder</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Technology</label>
                <select
                  value={techDomain}
                  onChange={(e) => setTechDomain(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>AI & Web</option>
                  <option>Mobile App & Cloud</option>
                  <option>IoT & Embedded Systems</option>
                  <option>Cybersecurity & ZK Proofs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Domain</label>
                <select
                  value={industryDomain}
                  onChange={(e) => setIndustryDomain(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Education & Student Productivity</option>
                  <option>Healthcare & Telemedicine</option>
                  <option>Smart Agriculture & IoT</option>
                  <option>Fintech & Payments</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Complexity</label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Beginner Mini-Project</option>
                  <option>Intermediate</option>
                  <option>Advanced Final Year Capstone</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateIdea}
                disabled={isGeneratingIdea}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingIdea ? "Synthesizing Architecture..." : "Generate Project Blueprint"}</span>
              </button>
            </div>
          </div>

          {generatedIdea && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-base font-extrabold text-white">{generatedIdea.title}</h4>
                <button
                  onClick={() => {
                    addTask({
                      title: `Project — ${generatedIdea.title}`,
                      category: "Project",
                      duration: 45,
                      priority: "MEDIUM",
                      dueDays: 7,
                      notes: generatedIdea.problem,
                    });
                    addNotification({
                      title: "Project Added",
                      message: `"${generatedIdea.title}" added to your study schedule.`,
                      type: "success",
                      category: "Project",
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Add to My Active Projects
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p><strong>Problem Statement:</strong> {generatedIdea.problem}</p>
                <p><strong>Proposed Solution:</strong> {generatedIdea.solution}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {generatedIdea.techStack.map((tech: string) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "ppt" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Standard College Project Review Slide Deck Template</h3>
            <p className="text-xs text-slate-400">
              Guaranteed to satisfy internal academic faculty evaluators and external examiners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviewSlides.map((slide, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">{slide.num}</span>
                <h4 className="text-xs font-bold text-white">{slide.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{slide.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
