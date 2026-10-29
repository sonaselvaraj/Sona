import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Briefcase,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  Building2,
  MapPin,
  Banknote,
  Calendar,
} from "lucide-react";

export const InternshipHub: React.FC = () => {
  const { internships, toggleInternshipApplication, addTask, addNotification } = useStudySync();

  const [activeTab, setActiveTab] = useState<"openings" | "skill-gap">("openings");
  const [targetRole, setTargetRole] = useState("Frontend Developer");

  const skillAnalysisMap: Record<string, { have: string[]; need: string[]; plan: { week: string; topic: string }[] }> = {
    "Frontend Developer": {
      have: ["React 18", "TypeScript", "Tailwind CSS", "REST API Integration", "Git & GitHub"],
      need: ["State Machines (Zustand)", "Performance Profiling", "Web Vitals Optimization", "Testing (Jest / Playwright)"],
      plan: [
        { week: "Week 1", topic: "React Performance & Re-render optimization profiling" },
        { week: "Week 2", topic: "Next.js SSR & Server Components mental model" },
        { week: "Week 3", topic: "End-to-End browser testing with Playwright" },
        { week: "Week 4", topic: "Mock Frontend Interview & LeetCode medium strings" },
      ],
    },
    "Backend Developer": {
      have: ["Java Basics", "Node.js Express", "REST APIs", "SQL Fundamentals"],
      need: ["PostgreSQL indexing & query plans", "Redis Caching", "Kafka message queues", "Docker containerization"],
      plan: [
        { week: "Week 1", topic: "Database indexing strategies (B-Trees vs Hash)" },
        { week: "Week 2", topic: "Redis cache-aside pattern & cache invalidation" },
        { week: "Week 3", topic: "Kafka consumer groups & idempotency" },
        { week: "Week 4", topic: "System Design for high-throughput rate limiter" },
      ],
    },
    "AI / ML Engineer": {
      have: ["Python", "NumPy", "Gemini API Integration", "Data Preprocessing"],
      need: ["PyTorch Model Fine-Tuning", "Vector Databases (Chroma / Pinecone)", "RAG Pipeline Evaluation", "LangGraph agents"],
      plan: [
        { week: "Week 1", topic: "Embedding models & semantic vector search indexing" },
        { week: "Week 2", topic: "Retrieval-Augmented Generation (RAG) with rerankers" },
        { week: "Week 3", topic: "PyTorch tensor operations & attention mechanisms" },
        { week: "Week 4", topic: "Deploying low-latency GenAI services with FastAPI" },
      ],
    },
  };

  const currentAnalysis = skillAnalysisMap[targetRole] || skillAnalysisMap["Frontend Developer"];

  const handleAddSkillPlan = () => {
    currentAnalysis.plan.forEach((item, index) => {
      addTask({
        title: `Skill: ${item.topic}`,
        category: "Internship",
        duration: 35,
        priority: "MEDIUM",
        dueDays: (index + 1) * 7,
        notes: `Target role: ${targetRole}. Milestone for ${item.week}.`,
      });
    });

    addNotification({
      title: "Skill Plan Integrated! 🎓",
      message: `Added 4 weekly skill milestones for "${targetRole}" into your schedule.`,
      type: "success",
      category: "Internship",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            Tier-1 Tech Internship Radar & Career Launchpad
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Internship Hub & Skill Gap Analyzer
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Live opening tracks, direct requirements breakdown, and role-based learning path injection.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab("openings")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "openings" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Verified Openings
          </button>
          <button
            onClick={() => setActiveTab("skill-gap")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "skill-gap" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Skill Gap Analyzer ✨
          </button>
        </div>
      </div>

      {activeTab === "openings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          {internships.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {job.type}
                  </span>
                  <span className="text-xs font-bold text-amber-400">Deadline: {job.deadline}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{job.role}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-slate-300">{job.company}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                  <Banknote className="w-4 h-4" />
                  <span>{job.stipend}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Required Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    toggleInternshipApplication(job.id);
                    addNotification({
                      title: job.applied ? "Application Untracked" : "Internship Applied! 💼",
                      message: `Updated tracker for ${job.company} ${job.role}.`,
                      type: "success",
                      category: "Internship",
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    job.applied
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {job.applied ? "✓ Applied" : "Mark as Applied"}
                </button>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open Official Job Board"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "skill-gap" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Role selector */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Target Career Role</h3>
              <p className="text-xs text-slate-400">Benchmarks your current coursework against real college hiring bars.</p>
            </div>

            <div className="flex items-center gap-2">
              {["Frontend Developer", "Backend Developer", "AI / ML Engineer"].map((role) => (
                <button
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    targetRole === role
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Have vs Need Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Skills You Already Have</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.have.map((sk) => (
                  <span key={sk} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/40 text-emerald-200 border border-emerald-500/30">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Skills to Acquire / Improve</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.need.map((sk) => (
                  <span key={sk} className="text-xs px-2.5 py-1 rounded-lg bg-amber-900/40 text-amber-200 border border-amber-500/30">
                    ▲ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Roadmap */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">4-Week Accelerated Skill Acquisition Plan</h3>
                <p className="text-xs text-slate-400">Micro-learning blocks calibrated for 35 min/day without exam overload.</p>
              </div>

              <button
                onClick={handleAddSkillPlan}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>ADD SKILL PLAN TO SCHEDULE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentAnalysis.plan.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">{p.week}</span>
                  <h4 className="text-xs font-bold text-white">{p.topic}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
