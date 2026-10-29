import React from "react";
import { useStudySync } from "../context/StudySyncContext";
import { ActiveTab } from "../types";
import {
  LayoutDashboard,
  Zap,
  CheckSquare,
  Calendar,
  CalendarDays,
  ShieldAlert,
  BookOpen,
  Code2,
  FolderGit2,
  Trophy,
  Briefcase,
  Languages,
  MessageSquareQuote,
  HeartPulse,
  TrendingUp,
  Bot,
  Settings,
  Flame,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "what-to-do-now", label: "What Should I Do Now?", icon: Zap, badge: "CORE", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "tasks", label: "My Tasks", icon: CheckSquare },
  { id: "day-planner", label: "Day Planner", icon: Calendar },
  { id: "monthly-planner", label: "Monthly Planner", icon: CalendarDays },
  { id: "overload-manager", label: "Overload Manager", icon: ShieldAlert, badge: "SHIELD", badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  { id: "mat-hub", label: "MAT Hub (Theory)", icon: BookOpen },
  { id: "cat-hub", label: "CAT Hub (Coding)", icon: Code2, badge: "ASSESS", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "project-hub", label: "Project Hub", icon: FolderGit2 },
  { id: "hackathon-hub", label: "Hackathon Hub", icon: Trophy },
  { id: "internship-hub", label: "Internship Hub", icon: Briefcase },
  { id: "japanese-ai", label: "Japanese AI", icon: Languages },
  { id: "spoken-english", label: "Spoken English", icon: MessageSquareQuote },
  { id: "wellness", label: "Wellness Hub", icon: HeartPulse },
  { id: "progress", label: "My Progress", icon: TrendingUp },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot, badge: "LIVE", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Navigation: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, overloadPercentage, tasks } = useStudySync();

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900/95 dark:bg-slate-950/95 border-r border-slate-800 backdrop-blur-xl text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white font-sans">StudySync</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">Student Overload OS</p>
          </div>
        </div>

        {/* Live Workload Indicator Pill */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Flame className={`w-3.5 h-3.5 ${overloadPercentage > 75 ? "text-rose-400 animate-bounce" : "text-amber-400"}`} />
              Workload Pressure
            </span>
            <span className={`font-semibold ${overloadPercentage > 75 ? "text-rose-400" : overloadPercentage > 50 ? "text-amber-300" : "text-emerald-400"}`}>
              {overloadPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                overloadPercentage > 75
                  ? "bg-gradient-to-r from-amber-500 to-rose-500"
                  : overloadPercentage > 50
                  ? "bg-gradient-to-r from-indigo-500 to-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${overloadPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>{activeTasksCount} pending tasks</span>
            <span>{overloadPercentage > 75 ? "Overload Alert" : "Manageable"}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Decision & Planning
        </div>
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Academics & Career Hubs
        </div>
        {navItems.slice(6, 11).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Skills & Wellbeing
        </div>
        {navItems.slice(11).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Tagline Banner */}
      <div className="p-3.5 m-3 rounded-xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 border border-slate-700/60 text-center">
        <p className="text-[11px] font-medium text-slate-300 italic">“Too much to do? Let AI decide what comes next.”</p>
        <button
          onClick={() => handleNavClick("what-to-do-now")}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors shadow-sm shadow-indigo-500/20"
        >
          <span>What to do now</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
