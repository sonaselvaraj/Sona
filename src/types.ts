export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type TaskCategory =
  | "MAT"
  | "CAT"
  | "Assignment"
  | "Project"
  | "Hackathon"
  | "Internship"
  | "Japanese"
  | "Spoken English"
  | "Wellness"
  | "Personal";

export interface StudentTask {
  id: string;
  title: string;
  category: TaskCategory;
  duration: number; // in minutes
  priority: PriorityLevel;
  dueDays: number; // 0 = today, 1 = tomorrow, etc.
  deadlineDate?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  importance: number; // 1 - 5
  notes?: string;
  completed: boolean;
  scheduledTime?: string;
  postponed?: boolean;
  whyExplanation?: string;
}

export interface StudentProfile {
  name: string;
  department: string;
  year: string;
  semester: string;
  college: string;
  matSubjects: string[];
  catSubjects: string[];
  catLanguage: string;
  upcomingAssessments: string[];
  goals: string[];
  dailyStudyHours: number;
  preferredTime: "Morning" | "Afternoon" | "Evening" | "Night";
  weekendHours: number;
  onboarded: boolean;
}

export interface ScheduleBlock {
  id: string;
  timeSlot: string;
  time?: string;
  taskTitle: string;
  title?: string;
  category: TaskCategory | "Break" | "Recovery" | "College" | "Personal" | string;
  status: "pending" | "completed" | "in_progress" | string;
  isFixed: boolean;
  type: "task" | "break" | "wellness" | "college" | string;
  duration: number; // minutes
  priority?: PriorityLevel;
  completed: boolean;
  notes?: string;
  urgent?: boolean;
}

export type DayScheduleBlock = ScheduleBlock;

export interface HackathonItem {
  id: string;
  name: string;
  organizer: string;
  theme: string;
  date: string;
  deadline: string;
  mode: "Online" | "Offline" | "Hybrid";
  location: string;
  eligibility: string;
  description: string;
  url: string;
  tags: string[];
  isRegistered?: boolean;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  stipend: string;
  deadline: string;
  requiredSkills: string[];
  description: string;
  url: string;
  applied?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "alert" | "wellness" | "deadline" | "success";
  timestamp: string;
  read: boolean;
  category?: TaskCategory;
}

export type ActiveTab =
  | "dashboard"
  | "what-to-do-now"
  | "tasks"
  | "day-planner"
  | "monthly-planner"
  | "overload-manager"
  | "mat-hub"
  | "cat-hub"
  | "project-hub"
  | "hackathon-hub"
  | "internship-hub"
  | "japanese-ai"
  | "spoken-english"
  | "wellness"
  | "progress"
  | "ai-assistant"
  | "settings";
