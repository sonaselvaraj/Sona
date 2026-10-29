import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from "lucide-react";

export const HackathonHub: React.FC = () => {
  const { hackathons, toggleHackathonRegistration, addNotification } = useStudySync();

  const [activeTab, setActiveTab] = useState<"radar" | "my-hackathons" | "checklist">("radar");
  const [filterTag, setFilterTag] = useState<string>("All");

  const filterOptions = ["All", "India", "Online", "Offline", "AI", "Web Development", "Web3"];

  const filteredHackathons = hackathons.filter((h) => {
    if (filterTag === "All") return true;
    if (filterTag === "India") return h.location.includes("India") || h.tags.includes("India");
    if (filterTag === "Online") return h.mode === "Online" || h.tags.includes("Online");
    if (filterTag === "Offline") return h.mode === "Offline" || h.tags.includes("Offline");
    return h.tags.includes(filterTag);
  });

  // Checklists
  const beforeChecklist = [
    { text: "Assemble cross-functional team (Frontend, Backend, AI/ML, Pitch lead)", done: true },
    { text: "Analyze shortlisted problem statements & draft 1-page solution doc", done: true },
    { text: "Initialize GitHub repository with license, branch rules & CI workflow", done: false },
    { text: "Prepare starter boilerplate (React + Express + Tailwind + DB schema)", done: false },
  ];

  const duringChecklist = [
    { text: "Prioritize strict MVP core flow before implementing bonus polish", done: false },
    { text: "Record a 60-second backup demo video in case WiFi fails during evaluation", done: false },
    { text: "Build slide deck answering: Problem, Tech Stack, Business impact, Live Demo", done: false },
    { text: "Rehearse 3-minute pitch timing and Q&A responses", done: false },
  ];

  const afterChecklist = [
    { text: "Polish GitHub README with architecture diagrams and live demo link", done: false },
    { text: "Write LinkedIn project showcase tagging hackathon organizers and mentors", done: false },
    { text: "Update resume with quantifiable achievements and technologies used", done: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            National & Global Hackathon Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hackathon Hub & Preparation Playbook
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Curated student hackathons, deadline countdowns, and end-to-end hackathon winning checklists.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "radar" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Hackathon Radar
          </button>
          <button
            onClick={() => setActiveTab("my-hackathons")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "my-hackathons" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            My Registrations ({hackathons.filter((h) => h.isRegistered).length})
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "checklist" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Preparation Playbook
          </button>
        </div>
      </div>

      {activeTab === "radar" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filters Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilterTag(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterTag === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHackathons.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {h.mode}
                    </span>
                    <span className="text-xs font-bold text-rose-400">{h.deadline}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{h.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">By {h.organizer}</p>

                  <p className="text-xs text-slate-300 leading-relaxed">{h.description}</p>

                  <div className="space-y-1 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{h.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{h.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {h.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      toggleHackathonRegistration(h.id);
                      addNotification({
                        title: h.isRegistered ? "Registration Removed" : "Registered for Hackathon! 🚀",
                        message: `Updated status for ${h.name}. Added milestones to study calendar.`,
                        type: "success",
                        category: "Hackathon",
                      });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      h.isRegistered
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  >
                    {h.isRegistered ? "✓ Registered" : "Mark as Registered"}
                  </button>

                  <a
                    href={h.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Visit Official Hackathon Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "my-hackathons" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">My Active Registered Hackathons</h3>
            <p className="text-xs text-slate-400">Automated buffer protection ensures college exams do not clash with demo sprints.</p>
          </div>

          <div className="space-y-3">
            {hackathons.filter((h) => h.isRegistered).map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Active Sprint
                    </span>
                    <h4 className="text-sm font-bold text-white">{h.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{h.theme} • {h.location}</p>
                </div>

                <div className="text-right flex items-center justify-between sm:flex-col sm:items-end">
                  <span className="text-xs font-bold text-rose-400">{h.deadline}</span>
                  <span className="text-[11px] text-slate-400">{h.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "checklist" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Before Hackathon</h3>
            <div className="space-y-2">
              {beforeChecklist.map((item, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${item.done ? "text-emerald-400" : "text-slate-600"}`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">During Hackathon</h3>
            <div className="space-y-2">
              {duringChecklist.map((item, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">After Hackathon</h3>
            <div className="space-y-2">
              {afterChecklist.map((item, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
