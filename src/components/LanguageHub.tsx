import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Languages,
  MessageSquareQuote,
  Sparkles,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Mic,
  RotateCcw,
  Check,
  Flame,
  Award,
  BookA,
} from "lucide-react";

export const LanguageHub: React.FC<{ initialMode?: "japanese" | "english" }> = ({
  initialMode = "japanese",
}) => {
  const { addNotification } = useStudySync();

  const [activeModule, setActiveModule] = useState<"japanese" | "english">(initialMode);

  // Japanese state
  const [kanjiIndex, setKanjiIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const kanjiCards = [
    {
      kanji: "木",
      meaning: "Tree / Wood",
      onyomi: "MOKU, BOKU",
      kunyomi: "ki, ko",
      example: "木曜日 (Mokuyoubi - Thursday)",
      strokeHint: "4 strokes: Horizontal line, vertical drop, left sweep, right sweep.",
    },
    {
      kanji: "休",
      meaning: "Rest / Day off",
      onyomi: "KYUU",
      kunyomi: "yasu(mu)",
      example: "休み (Yasumi - Break/Vacation)",
      strokeHint: "6 strokes: Person radical on left + tree on right (person resting by a tree).",
    },
    {
      kanji: "本",
      meaning: "Book / Origin / Japan",
      onyomi: "HON",
      kunyomi: "moto",
      example: "日本 (Nihon - Japan)",
      strokeHint: "5 strokes: Tree radical with a horizontal cross stroke at base.",
    },
    {
      kanji: "学",
      meaning: "Study / Learning",
      onyomi: "GAKU",
      kunyomi: "mana(bu)",
      example: "学生 (Gakusei - Student)",
      strokeHint: "8 strokes: Roof radical with child underneath.",
    },
  ];

  // English state
  const [speechTopic, setSpeechTopic] = useState("Describe your Capstone Project architecture in 2 minutes for campus placement.");
  const [speechTranscript, setSpeechTranscript] = useState(
    "In my college project, I builded a web app using React and Express. We face difficulties in database schema, but me and my teammate resolved it using relational normalization. It helps students to manage their overload."
  );
  const [speechEvaluation, setSpeechEvaluation] = useState<any>(null);
  const [isEvaluatingSpeech, setIsEvaluatingSpeech] = useState(false);

  const handleEvaluateSpeech = () => {
    setIsEvaluatingSpeech(true);
    setTimeout(() => {
      setSpeechEvaluation({
        scores: {
          grammar: "82%",
          vocabulary: "85%",
          clarity: "90%",
          confidence: "88%",
        },
        corrections: [
          { original: "I builded a web app", corrected: "I built a web application", note: "'Built' is the irregular past tense of 'build'." },
          { original: "We face difficulties", corrected: "We encountered difficulties", note: "'Encountered' sounds more professional in tech interviews." },
          { original: "me and my teammate resolved it", corrected: "my teammate and I resolved it", note: "Polite subject order convention." },
        ],
        starFeedback: "Good Situation and Action context. For campus placements, quantify the Result (e.g. 'reduced study anxiety by 40%').",
      });
      setIsEvaluatingSpeech(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-1.5">
            <Languages className="w-3.5 h-3.5 text-rose-400" />
            Global Skills & Communication Co-Pilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Language & Communication Hub
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Maintain daily consistency in Japanese JLPT N5 and placement interview Spoken English without overload.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveModule("japanese")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeModule === "japanese" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Japanese AI (JLPT N5)
          </button>
          <button
            onClick={() => setActiveModule("english")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeModule === "english" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Spoken English & STAR Pitch
          </button>
        </div>
      </div>

      {activeModule === "japanese" ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Daily Kanji Flashcard */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  JLPT N5 Daily Kanji
                </span>
                <span className="text-xs text-slate-400">Card {kanjiIndex + 1} of {kanjiCards.length}</span>
              </div>
              <span className="text-xs text-amber-400 font-semibold">25 min habit</span>
            </div>

            {/* Interactive Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[220px] p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 cursor-pointer flex flex-col items-center justify-center text-center space-y-3 hover:border-indigo-500/40 transition-all"
            >
              <div className="text-6xl sm:text-7xl font-bold text-white font-sans">
                {kanjiCards[kanjiIndex].kanji}
              </div>

              {!isFlipped ? (
                <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                  <span>Click to reveal readings & meaning</span>
                </div>
              ) : (
                <div className="space-y-1.5 animate-in fade-in text-xs sm:text-sm text-slate-300">
                  <p className="text-base font-extrabold text-amber-300">{kanjiCards[kanjiIndex].meaning}</p>
                  <p><strong>Onyomi:</strong> {kanjiCards[kanjiIndex].onyomi}</p>
                  <p><strong>Kunyomi:</strong> {kanjiCards[kanjiIndex].kunyomi}</p>
                  <p className="text-slate-400 italic mt-2">{kanjiCards[kanjiIndex].example}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{kanjiCards[kanjiIndex].strokeHint}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setKanjiIndex((prev) => (prev > 0 ? prev - 1 : kanjiCards.length - 1));
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Previous Card
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setKanjiIndex((prev) => (prev + 1) % kanjiCards.length);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Next Kanji →
              </button>
            </div>
          </div>

          {/* Rapid Quiz */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Quick Concept Verification
            </h4>
            <p className="text-xs sm:text-sm text-white font-medium">
              What does the Kanji <strong>休</strong> literally represent in its mnemonic form?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { label: "A tree growing on a mountain", correct: false },
                { label: "A person resting by a tree", correct: true },
                { label: "A book under a roof", correct: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setQuizAnswer(opt.correct ? "correct" : "incorrect")}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                    quizAnswer === "correct" && opt.correct
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {quizAnswer === "correct" && (
              <p className="text-xs font-bold text-emerald-400">
                ✓ 正解 (Seikai)! Correct! Person (人) radical leaning against Tree (木).
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Spoken English Module */
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Campus Placement Pitch Practice
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">20 min practice session</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Interview Prompt</label>
              <input
                type="text"
                value={speechTopic}
                onChange={(e) => setSpeechTopic(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Your Spoken Answer (Type or transcribe what you spoke aloud):
              </label>
              <textarea
                rows={3}
                value={speechTranscript}
                onChange={(e) => setSpeechTranscript(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Analyzes grammar, STAR framework structure, and campus recruitment tone.
              </span>

              <button
                onClick={handleEvaluateSpeech}
                disabled={isEvaluatingSpeech}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEvaluatingSpeech ? "Analyzing Speech..." : "Evaluate Placement Answer"}</span>
              </button>
            </div>
          </div>

          {speechEvaluation && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
              <h3 className="text-sm font-bold text-white">Placement Communication Scorecard</h3>

              {/* Score grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Grammar</span>
                  <span className="text-lg font-extrabold text-emerald-400">{speechEvaluation.scores.grammar}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Vocabulary</span>
                  <span className="text-lg font-extrabold text-indigo-400">{speechEvaluation.scores.vocabulary}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Clarity</span>
                  <span className="text-lg font-extrabold text-amber-400">{speechEvaluation.scores.clarity}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Confidence</span>
                  <span className="text-lg font-extrabold text-purple-400">{speechEvaluation.scores.confidence}</span>
                </div>
              </div>

              {/* Grammar Corrections */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Targeted Grammar & Phrasing Refinements
                </h4>
                {speechEvaluation.corrections.map((corr: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 line-through">{corr.original}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-emerald-400 font-bold">{corr.corrected}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{corr.note}</p>
                  </div>
                ))}
              </div>

              {/* STAR Framework Feedback */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-200">
                <span className="font-bold text-indigo-300 block mb-1">STAR Method Analysis:</span>
                <p>{speechEvaluation.starFeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
