
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitTask } from '../types/HabitTask';

const HABIT_KEY = '@habit_tasks';

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