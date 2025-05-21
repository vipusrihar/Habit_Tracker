import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { HabitTask } from '../types/HabitTask';

const ViewTaskScreen = () => {
  const route = useRoute();
  const { task }: { task: HabitTask } = route.params as any;

  const markedDates = Object.entries(task.completionHistory || {}).reduce(
    (acc: any, [date, value]) => {
      const dateKey = new Date(date).toISOString().split('T')[0];

      if (task.progressType === 'boolean' && value === true) {
        acc[dateKey] = {
          marked: true,
          selected: true,
          selectedColor: '#ff993f',
        };
      } else if (task.progressType === 'count' && typeof value === 'number' && value > 0) {
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.detailBox}>
        <Text><Text style={styles.label}>Type:</Text> {task.type}</Text>
        <Text><Text style={styles.label}>Progress Type:</Text> {task.progressType}</Text>
        <Text><Text style={styles.label}>Target Value:</Text> {task.targetValue || 'N/A'}</Text>
        <Text><Text style={styles.label}>Created Date:</Text> {new Date(task.startDate).toLocaleDateString()}</Text>
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
  sectionTitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#ff993f',
  },
});
