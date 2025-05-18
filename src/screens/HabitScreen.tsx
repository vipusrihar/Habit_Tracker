import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  getTasks,
  markTaskAsDoneToday,
  deleteTask,
  getWeeklyCompletionCount,
} from '../utils/HabitStorage';
import { HabitTask } from '../types/HabitTask';

const HabitScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<HabitTask[]>([]);

  const fetchTasks = async () => {
    const loadedTasks = await getTasks();
    setTasks(loadedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleMarkDone = async (task: HabitTask) => {
    await markTaskAsDoneToday(task.id);
    fetchTasks();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(id);
            fetchTasks();
          },
        },
      ]
    );
  };

  const renderProgress = (task: HabitTask) => {
    if (task.type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const isDoneToday = task.completionHistory.includes(today);
      return (
        <Text style={styles.progressText}>
          {isDoneToday ? '✅ Done Today' : '⬜ Not Done'}
        </Text>
      );
    } else if (task.type.includes('week')) {
      const required = task.targetValue;
      const done = getWeeklyCompletionCount(task);
      return (
        <Text style={styles.progressText}>
          Weekly: {done} / {required}
        </Text>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Text style={styles.header}>My Habits</Text>
        <View>
          {tasks.map((task, index) => (
            <View key={index} style={styles.taskItem}>
              <Text style={styles.taskText}>{task.title}</Text>
              <Text>Type: {task.type}</Text>
              <Text>Streak: 🔥 {task.streakCount}</Text>
              {renderProgress(task)}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => handleMarkDone(task)}
                  style={styles.doneBtn}
                >
                  <Text style={styles.doneText}>Mark</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(task.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddForm')}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HabitScreen;

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FFEB3B',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addText: {
    fontSize: 36,
    color: 'white',
    lineHeight: 36,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  taskItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  doneBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  doneText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
