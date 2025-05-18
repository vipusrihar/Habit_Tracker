
export type HabitType = "daily" | "weekly" | "monthly" ;


export type ProgressType = "boolean" | "count" | "percentage";


export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

// Main Habit Task Type
export interface HabitTask {
  id: string;
  title: string;
  type: HabitType;
  targetValue?: number; // For count/goal-based habits
  progressType: ProgressType;
  startDate: string; // ISO format date
  endDate?: string; // For goal-based habits
  streakCount: number;
  completionHistory: string[]; // Dates in ISO format
  checklistItems?: ChecklistItem[]; // Only for type === "checklist"
  color?: string; // Optional for UI color grouping
}
