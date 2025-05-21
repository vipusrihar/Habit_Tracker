export type HabitType = "daily"

export type ProgressType = "boolean" | "count";

export type CompletionHistory =
  | string[] // for boolean habits (array of completed dates)
  | { [date: string]: number }; // for count habits (map of date -> value)

export interface HabitTask {
  id: string;
  title: string;
  type: 'daily' 
  progressType: 'boolean' | 'count';
  targetValue?: number;
  startDate: string; 
  streakCount: number;
  color: string;
  completionHistory: {
    [date: string]: boolean | number; // '2025-05-20': true | 3
  };
}
