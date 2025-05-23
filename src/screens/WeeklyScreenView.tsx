import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Pressable
} from 'react-native';
import { getTasks, updateTask } from '../utils/HabitStorage';
import { HabitTask } from '../types/HabitTask';
import { getWeekDates } from '../utils/dataHelpers';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const isToday = (date: string) => dayjs().isSame(date, 'day');

const WeeklyViewScreen = () => {
  const [habits, setHabits] = useState<HabitTask[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [baseDate, setBaseDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<HabitTask | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [inputCount, setInputCount] = useState('');
  const [todayPercentage, setTodayPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allTasks = await getTasks();
        setHabits(allTasks);
        const dates = getWeekDates(baseDate);
        setWeekDates(dates);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchData();
  }, [baseDate]);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    let completed = 0;
    let total = 0;

    habits.forEach(habit => {
      const isAllowedDay = habit.type === 'daily' || (habit.type === 'weekly' && habit.weekDays?.includes(dayjs(today).format('ddd')));
      if (!isAllowedDay) return;

      total++;
      const value = habit.completionHistory?.[today];
      if (habit.progressType === 'boolean') {
        if (value === true) completed++;
      } else if (typeof value === 'number' && habit.targetValue !== undefined && value >= habit.targetValue) {
        completed++;
      }
    });

    setTodayPercentage(total === 0 ? 0 : Math.round((completed / total) * 100));
  }, [habits]);

  const saveHabitUpdate = async (updatedHabit: HabitTask) => {
    await updateTask(updatedHabit);
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };

  const isFutureDate = (date: string) => dayjs(date).isAfter(dayjs(), 'day');

  const toggleBooleanCompletion = (habit: HabitTask, date: string) => {
    if (isFutureDate(date)) return;
    const completionHistory = { ...habit.completionHistory };
    completionHistory[date] = !completionHistory[date];
    const updatedHabit = { ...habit, completionHistory };
    saveHabitUpdate(updatedHabit);
  };

  const openCountModal = (habit: HabitTask, date: string) => {
    if (isFutureDate(date)) return;
    setCurrentHabit(habit);
    setCurrentDate(date);
    setInputCount(habit.completionHistory?.[date]?.toString() || '');
    setModalVisible(true);
  };

  const saveCountCompletion = () => {
    if (!currentHabit) return;
    let count = parseInt(inputCount);
    if (isNaN(count) || count < 0) count = 0;
    if (currentHabit.targetValue !== undefined && count > currentHabit.targetValue)
      count = currentHabit.targetValue;

    const completionHistory = { ...currentHabit.completionHistory };
    completionHistory[currentDate] = count;
    const updatedHabit = { ...currentHabit, completionHistory };
    saveHabitUpdate(updatedHabit);
    setModalVisible(false);
    setCurrentHabit(null);
    setInputCount('');
  };

  const dailyHabits = habits.filter(habit => habit.type === 'daily');
  const weeklyHabits = habits.filter(habit => habit.type === 'weekly');


  const renderHabitRow = (habit: HabitTask) => (
    <View key={habit.id} style={styles.habitRow}>
      <Text style={[styles.habitTitle, { backgroundColor: "#e46529" }]}>
        {habit.title}
      </Text>

      {weekDates.map((date) => {
        const entry = habit.completionHistory?.[date];
        const future = isFutureDate(date);
        const dayOfWeek = dayjs(date).format('ddd');
        const isAllowedDay = habit.type === 'daily' || (habit.type === 'weekly' && habit.weekDays?.includes(dayOfWeek));

        if (!isAllowedDay) {
          return <View key={date} style={[styles.dayBox, styles.dayBoxDisabled]} />;
        }

        if (habit.progressType === 'boolean') {
          return (
            <TouchableOpacity
              key={date}
              disabled={future}
              style={[styles.dayBox, isToday(date) && styles.dayBoxToday, entry ? styles.dayBoxCompleted : null, future && styles.dayBoxDisabled]}
              onPress={() => toggleBooleanCompletion(habit, date)}>
              {entry ? <Image source={require('../assests/icons/tick.png')} style={{ width: 20, height: 20 }} /> : <Text></Text>}
            </TouchableOpacity>
          );
        }

        const countText = typeof entry === 'number' ? `${entry}/${habit.targetValue}` : `0/${habit.targetValue || '?'}`;
        return (
          <TouchableOpacity
            key={date}
            disabled={future}
            style={[styles.dayBox, isToday(date) && styles.dayBoxToday, typeof entry === 'number' && entry >= (habit.targetValue || 0) ? styles.dayBoxCompleted : null, future && styles.dayBoxDisabled]}
            onPress={() => openCountModal(habit, date)}>
            <Text style={{ fontSize: 10 }}>{countText}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const weekNumber = dayjs(weekDates[0]).week();

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.weekInfoBar}>
          <TouchableOpacity onPress={() => {
            const prevWeek = new Date(baseDate);
            prevWeek.setDate(baseDate.getDate() - 7);
            setBaseDate(prevWeek);
          }}>
            <Image style={styles.mainImage} source={require('../assests/icons/arrow-left.png')} />
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text>Week - {weekNumber}</Text>
            <Text>{dayjs(weekDates[0]).format("MMM D")} - {dayjs(weekDates[6]).format("MMM D, YYYY")}</Text>
            
          </View>
          

          <TouchableOpacity onPress={() => {
            const nextWeek = new Date(baseDate);
            nextWeek.setDate(baseDate.getDate() + 7);
            setBaseDate(nextWeek);
          }}>
            <Image style={styles.mainImage} source={require('../assests/icons/arrow-right.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.percertageContainer}>
          <Text style={styles.percentageText}>Today: {todayPercentage}%</Text>
        </View>

        <View style={styles.rowHeading}>
          <Text style={styles.habitTitleHeader}>Habit</Text>
          {weekDates.map((date) => (
            <Text key={date} style={styles.dayBoxHeader}>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
          ))}
        </View>

        {dailyHabits.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>DAILY HABITS</Text>
            </View>
            {dailyHabits.map(renderHabitRow)}
          </>
        )}

        {(dailyHabits.length > 0 && weeklyHabits.length > 0) && (
          <View style={styles.divider} />
        )}

        {weeklyHabits.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>WEEKLY HABITS</Text>
            </View>
            {weeklyHabits.map(renderHabitRow)}
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter count for "{currentHabit?.title}" on {currentDate}</Text>
            <Text style={styles.modalSubTitle}>Max: {currentHabit?.targetValue}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputCount}
              onChangeText={setInputCount}
              placeholder="Enter count"
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtonRow}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.saveButton]} onPress={saveCountCompletion}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default WeeklyViewScreen;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fff',
  },
  rowHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitTitle: {
    width: 80,
    padding: 4,
    fontWeight: 'bold',
    color: '#fff',
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: "#ee771d",
  },
  habitTitleHeader: {
    width: 80,
    fontWeight: 'bold',
    marginRight: 6,
    color: "#ee771d",
  },
  dayBox: {
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    borderColor: '#cc55033',
    borderWidth: 1,
    marginRight: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dayBoxCompleted: {
    backgroundColor: '#ffb767',
  },
  dayBoxDisabled: {
    backgroundColor: '#eee',
    opacity: 0.5,
  },
  dayBoxHeader: {
    width: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 4,
    color: "#ee771d",
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000099',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderColor: '#cc55033',
    borderWidth: 1,
  },
  input: {
    borderColor: '#cc55033',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    padding: 8,
    fontSize: 16,
  },
  weekInfoBar: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: "#ee771d",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center"
  },
  mainImage: {
    height: 30,
    width: 30,
    tintColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ee771d',
  },
  modalSubTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#ee771d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dayBoxToday: {
    borderColor: '#ee771d',
    borderWidth: 2,
  },
  percentageText: { 
    fontWeight: 'bold', 
    color: '#000' 
  },
  percertageContainer : {
    alignItems : 'center'
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#ee771d',
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
    marginHorizontal: 5,
  },
});
