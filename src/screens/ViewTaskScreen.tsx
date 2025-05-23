import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { HabitTask } from '../types/HabitTask';
import { getTasks } from '../utils/HabitStorage'; 

type RouteParams = {
  taskId: string;
};

const ViewTaskScreen = () => {
  const route = useRoute();
  const { taskId } = route.params as RouteParams;
  const [task, setTask] = useState<HabitTask | null>(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError('');
      const tasks = await getTasks();
      const foundTask = tasks.find(t => t.id === taskId);

      if (!foundTask) {
        setError('Task not found');
        return;
      }

      setTask(foundTask);
      updateMarkedDates(foundTask);
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const updateMarkedDates = (taskData: HabitTask) => {
    const newMarkedDates = Object.entries(taskData.completionHistory || {}).reduce(
      (acc: any, [date, value]) => {
        const dateKey = new Date(date).toISOString().split('T')[0];

        if (taskData.progressType === 'boolean' && value === true) {
          acc[dateKey] = {
            marked: true,
            selected: true,
            selectedColor: '#ff993f',
          };
        } else if (taskData.progressType === 'count' && typeof value === 'number' && value > 0) {
          acc[dateKey] = {
            marked: true,
            selected: true,
            dotColor: '#ff993f',
          };
        }
        return acc;
      },
      {}
    );
    setMarkedDates(newMarkedDates);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTask();
    }, [taskId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff993f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Task data not available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      

      <View style={styles.detailBox}>
        <Text>
          <Text style={styles.title}>{task.title}</Text>
        </Text>
        <Text>
          <Text style={styles.label}>Type:</Text> {task.type}
        </Text>
        <Text>
          <Text style={styles.label}>Progress Type:</Text> {task.progressType}
        </Text>
        <Text>
          <Text style={styles.label}>Target Value:</Text> {task.targetValue || 'N/A'}
        </Text>
      </View>

      <Calendar
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#ff993f',
          selectedDayTextColor: '#ffffff',
          dotColor: '#ff993f',
          todayTextColor: '#ff993f',
          arrowColor: '#ff993f',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textSectionTitleColor: '#ff993f',
        }}
      />
    </ScrollView>
  );
};

export default ViewTaskScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ff993f',
  },
  detailBox: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff3e6',
    borderRadius: 8,
    borderColor: '#ff993f',
    borderWidth: 1,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

