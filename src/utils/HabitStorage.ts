import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitTask } from '../types/HabitTask';
import { Alert } from 'react-native';

const HABIT_KEY = '@habit_tasks';

// Utility: Get start and end of this week
const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Saturday
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// Fetch all tasks
export const getTasks = async (): Promise<HabitTask[]> => {
  try {
    const json = await AsyncStorage.getItem(HABIT_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

// Add a new task
export const addTask = async (task: HabitTask): Promise<void> => {
  try {
    const tasks = await getTasks();
    tasks.push(task);
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Delete a task by ID
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const filtered = tasks.filter(task => task.id !== id);
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Update a task by ID
export const updateTask = async (updatedTask: HabitTask): Promise<void> => {
  try {
    const tasks = await getTasks();
    const updatedList = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Clear all tasks (for testing or reset)
export const clearAllTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HABIT_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
};

// Mark a habit as done today
export const markTaskAsDoneToday = async (id: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const today = new Date().toISOString().split('T')[0];

    const updatedTasks = tasks.map(task => {
      if (task.id === id && !task.completionHistory.includes(today)) {
        task.completionHistory.push(today);

        // Optional: Handle streak count for daily habits
        if (task.type === 'daily') {
          task.streakCount += 1;
        }
      }
      return task;
    });

    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error marking task as done:', error);
  }
};

// Get number of times a task was done this week
export const getWeeklyCompletionCount = (task: HabitTask): number => {
  const { start, end } = getWeekRange();

  return task.completionHistory.filter(dateStr => {
    const date = new Date(dateStr);
    return date >= start && date <= end;
  }).length;
};
