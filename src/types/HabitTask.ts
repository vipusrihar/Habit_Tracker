export type HabitType = "daily" | "weekly";
export type ProgressType = "boolean" | "count";

type BaseHabit = {
  id: string;
  title: string;
  startDate: string;
  streakCount: number;
  color: string;
};

type DailyBooleanHabit = BaseHabit & {
  type: "daily";
  progressType: "boolean";
  targetValue?: never;
  weekDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  completionHistory: { [date: string]: boolean };
};

type DailyCountHabit = BaseHabit & {
  type: "daily";
  progressType: "count";
  targetValue: number;
  weekDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  completionHistory: { [date: string]: number };
};

type WeeklyBooleanHabit = BaseHabit & {
  type: "weekly";
  progressType: "boolean";
  targetValue?: never;
  weekDays: string[];
  completionHistory: { [date: string]: boolean };
};

type WeeklyCountHabit = BaseHabit & {
  type: "weekly";
  progressType: "count";
  targetValue: number;
  weekDays: string[];
  completionHistory: { [date: string]: number };
};

export type HabitTask = 
  | DailyBooleanHabit
  | DailyCountHabit
  | WeeklyBooleanHabit
  | WeeklyCountHabit;
