import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import { StudentProfile } from "../types";
import {
  X,
  User,
  BookOpen,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { student, updateProfile } = useStudySync();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentProfile>(student);

  if (!isOpen) return null;

  const goalOptions = [
    "Improve Coding",
    "Score better in MAT",
    "Complete Projects",
    "Participate in Hackathons",
    "Get Internship",
    "Learn Japanese",
    "Improve Spoken English",
    "Improve Presentation Skills",
    "Maintain Healthy Study Routine",
  ];

  const catLanguages = [
    "Java",
    "C++",
    "Python",
    "C",
    "JavaScript",
    "Go",
    "Rust",
    "Kotlin",
  ];

  const toggleGoal = (g: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(g)
        ? prev.goals.filter((x) => x !== g)
        : [...prev.goals, g],
    }));
  };

  const handleSave = () => {
    updateProfile({ ...formData, onboarded: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Step {step} of 4
              </span>
              <h2 className="text-lg font-bold text-white">Student Academic Profile</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalize StudySync AI to balance your exams, coding labs & lifestyle.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mt-4 mb-6">
          {["Student Info", "Academics", "Goals", "Availability"].map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === i + 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : step > i + 1
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > i + 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === i + 1 ? "text-white" : "text-slate-500"}`}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Student Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Semester</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Current CAT Programming Language
              </label>
              <div className="grid grid-cols-4 gap-2">
                {catLanguages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setFormData({ ...formData, catLanguage: lang })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      formData.catLanguage === lang
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                MAT Theory Subjects (comma separated)
              </label>
              <input
                type="text"
                value={formData.matSubjects.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matSubjects: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g. Operating Systems, Discrete Maths, DBMS"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Upcoming Exams / Lab Assessments
              </label>
              <textarea
                rows={2}
                value={formData.upcomingAssessments.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    upcomingAssessments: e.target.value.split("\n").filter(Boolean),
                  })
                }
                placeholder="One assessment per line..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-3 animate-in fade-in">
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Select all goals you wish to balance this semester:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalOptions.map((g) => {
                const selected = formData.goals.includes(g);
                return (
                  <div
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`p-3 rounded-2xl cursor-pointer border flex items-center justify-between text-xs transition-all ${
                      selected
                        ? "bg-indigo-600/20 border-indigo-500/50 text-white font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{g}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        selected ? "bg-indigo-600 text-white" : "border border-slate-700"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">Daily Available Study Time</label>
                <span className="text-xs font-bold text-indigo-400">{formData.dailyStudyHours} Hours / day</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={formData.dailyStudyHours}
                onChange={(e) => setFormData({ ...formData, dailyStudyHours: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Preferred Study Energy Window</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Morning", "Afternoon", "Evening", "Night"] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredTime: slot })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      formData.preferredTime === slot
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">Weekend Available Capacity</label>
                <span className="text-xs font-bold text-amber-400">{formData.weekendHours} Hours / day</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={formData.weekendHours}
                onChange={(e) => setFormData({ ...formData, weekendHours: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Complete & Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
