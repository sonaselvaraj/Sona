import React, { useState } from "react";
import { StudySyncProvider, useStudySync } from "./context/StudySyncContext";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { WhatShouldIDoNow } from "./components/WhatShouldIDoNow";
import { TaskListView } from "./components/TaskListView";
import { DayPlanner } from "./components/DayPlanner";
import { MonthlyPlanner } from "./components/MonthlyPlanner";
import { OverloadManager } from "./components/OverloadManager";
import { MatHub } from "./components/MatHub";
import { CatHub } from "./components/CatHub";
import { ProjectHub } from "./components/ProjectHub";
import { HackathonHub } from "./components/HackathonHub";
import { InternshipHub } from "./components/InternshipHub";
import { LanguageHub } from "./components/LanguageHub";
import { WellnessHub } from "./components/WellnessHub";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SettingsView } from "./components/SettingsView";
import { FocusModeOverlay } from "./components/FocusModeOverlay";
import { TaskCreationModal } from "./components/TaskCreationModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { AiAssistantModal } from "./components/AiAssistantModal";
import { Zap, Bot, Plus } from "lucide-react";

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, student } = useStudySync();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!student.onboarded);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onOpenTaskModal={() => setIsTaskModalOpen(true)} />;
      case "what-to-do-now":
        return <WhatShouldIDoNow />;
      case "tasks":
        return <TaskListView onOpenTaskModal={() => setIsTaskModalOpen(true)} />;
      case "day-planner":
        return <DayPlanner />;
      case "monthly-planner":
        return <MonthlyPlanner />;
      case "overload-manager":
        return <OverloadManager />;
      case "mat-hub":
        return <MatHub />;
      case "cat-hub":
        return <CatHub />;
      case "project-hub":
        return <ProjectHub />;
      case "hackathon-hub":
        return <HackathonHub />;
      case "internship-hub":
        return <InternshipHub />;
      case "japanese-ai":
        return <LanguageHub initialMode="japanese" />;
      case "spoken-english":
        return <LanguageHub initialMode="english" />;
      case "wellness":
        return <WellnessHub />;
      case "progress":
        return <ProgressDashboard />;
      case "ai-assistant":
        return <WhatShouldIDoNow />;
      case "settings":
        return <SettingsView onOpenOnboarding={() => setIsOnboardingOpen(true)} />;
      default:
        return <Dashboard onOpenTaskModal={() => setIsTaskModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen z-30">
        <Navigation isOpenMobile={false} onCloseMobile={() => {}} />
      </aside>

      {/* Mobile Drawer */}
      <Navigation
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenTaskModal={() => setIsTaskModalOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
          {renderActiveView()}
        </main>
      </div>

      {/* Persistent Quick Action Bar (Bottom Floating) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Quick What Should I Do Now button */}
        {activeTab !== "what-to-do-now" && (
          <button
            id="floating-what-to-do"
            onClick={() => setActiveTab("what-to-do-now")}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <Zap className="w-4 h-4 fill-current text-slate-950" />
            <span>WHAT SHOULD I DO NOW?</span>
          </button>
        )}

        {/* AI Assistant Chat Trigger */}
        <button
          id="floating-assistant-btn"
          onClick={() => setIsAssistantOpen(true)}
          className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
          title="Open StudySync AI Assistant"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>

      {/* Modals & Overlays */}
      <FocusModeOverlay />

      <TaskCreationModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StudySyncProvider>
      <MainLayout />
    </StudySyncProvider>
  );
}
