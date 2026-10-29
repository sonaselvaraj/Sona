import React, { useState } from "react";
import { useStudySync } from "../context/StudySyncContext";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Zap,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { student, tasks, overloadPercentage } = useStudySync();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello ${student.name.split(" ")[0]}! I'm your StudySync AI Co-Pilot. You have ${tasks.filter((t) => !t.completed).length} pending tasks today with an overload score of ${overloadPercentage}%. How can I help you navigate your schedule?`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "I have 45 minutes right now. What should I do?",
    "What are the top 3 things I must finish today?",
    "I'm feeling overwhelmed. Help me breathe and prioritize.",
    "Give me a 5-minute quiz on today's topics.",
  ];

  const handleSend = async (userText: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: {
            studentName: student.name,
            pendingTasksCount: tasks.filter((t) => !t.completed).length,
            overloadScore: overloadPercentage,
          },
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (e) {
      console.warn("AI Assistant fetch failed:", e);
      let fallback = "I am tracking your priorities. Focus on your upcoming CAT assessment today; non-urgent items can be comfortably postponed to maintain your recovery window.";
      if (textToSend.includes("45 minutes")) {
        fallback = "With 45 minutes, tackle **CAT — Kadane's Algorithm Practice** (30 min) followed by a 15-minute quick review of **MAT Peterson's Solution**. This maximizes your exam readiness without burnout.";
      } else if (textToSend.includes("overwhelmed")) {
        fallback = "Take a slow, deep breath. You do not have to conquer everything simultaneously. I have deprioritized your side tasks today; focus purely on the single next milestone.";
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                StudySync AI Assistant
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              </h3>
              <p className="text-[11px] text-slate-400">Context-aware personal academic advisor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.sender === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing optimal schedule decision...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 whitespace-nowrap transition-colors shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask AI what to do, how to reschedule, or for exam hints..."
            className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
