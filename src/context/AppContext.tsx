// Re-export StudySyncContext as AppContext for modular and test suite compatibility
export * from "./StudySyncContext";
export {
  useAppContext,
  AppContext,
  AppProvider,
  useStudySync,
  StudySyncProvider,
} from "./StudySyncContext";
