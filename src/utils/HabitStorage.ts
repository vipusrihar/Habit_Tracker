import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitTask } from '../types/HabitTask';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';


const HABIT_KEY = '@habit_tasks';

const getTodayDate = () => new Date().toISOString().split('T')[0];

//add a new task
export const addTask = async (task: HabitTask): Promise<void> => {
  try {
    const id = uuid.v4()
    task.id = id;
    const tasks = await getTasks();
    console.log(tasks)
    tasks.push(task);
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

//delete a task by ID
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const filtered = tasks.filter(task => task.id !== id);
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

//fetch all tasks
export const getTasks = async (): Promise<HabitTask[]> => {
  try {
    const json = await AsyncStorage.getItem(HABIT_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
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

//clear all tasks
export const clearAllTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HABIT_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
};

export const isCompletedToday = (task: HabitTask): boolean => {
  const today = getTodayDate();
  const record = task.completionHistory?.[today];
  if (task.progressType === 'boolean') return record === true;
  if (task.progressType === 'count' && typeof record === 'number') {
    return task.targetValue !== undefined && record >= task.targetValue;
  }
  return false;
};
