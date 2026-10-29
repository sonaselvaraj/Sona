import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Settings,
  User,
  Clock,
  Code2,
  Bell,
  Shield,
  RotateCcw,
  Save,
  Check,
} from "lucide-react";

export const SettingsView: React.FC<{ onOpenOnboarding: () => void }> = ({ onOpenOnboarding }) => {
  const { student, updateProfile, resetDemoData, addNotification } = useStudySync();

  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [branch, setBranch] = useState(student.branch);
  const [semester, setSemester] = useState(student.semester);
  const [catLanguage, setCatLanguage] = useState(student.catLanguage);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      branch,
      semester,
      catLanguage,
    });
    setSaved(true);
    addNotification({
      title: "Profile Preferences Saved",
      message: "Academic schedule and default coding environment updated.",
      type: "success",
    });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold mb-1.5">
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            System Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account & Academic Settings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Configure your curriculum, lab languages, and autonomous rebalancing thresholds.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Re-run Setup Wizard</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Student Academic Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">University / College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Department / Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            CAT Lab & Exam Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Assessment Language</label>
              <select
                value={catLanguage}
                onChange={(e) => setCatLanguage(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {["Java", "Python", "C++", "C", "Go", "Rust", "JavaScript"].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Daily Study Target</label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                {student.dailyStudyHoursTarget} Hours / day (Safe load ceiling)
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all tasks, progress, and settings to original college CSE student demo state?")) {
                resetDemoData();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            Reset to Sample College Data
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Saved Successfully" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
