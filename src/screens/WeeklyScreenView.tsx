import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Pressable } from 'react-native';
import { getTasks, updateTask } from '../utils/HabitStorage';
import { HabitTask } from '../types/HabitTask';
import { getWeekDates } from '../utils/dataHelpers';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const WeeklyViewScreen = () => {
  const [habits, setHabits] = useState<HabitTask[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [baseDate, setBaseDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<HabitTask | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [inputCount, setInputCount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const allTasks = await getTasks();
      setHabits(allTasks);
      const dates = getWeekDates(baseDate);
      setWeekDates(dates);
    };
    fetchData();
  }, [baseDate]);

  const saveHabitUpdate = async (updatedHabit: HabitTask) => {
    await updateTask(updatedHabit);
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };

  const isFutureDate = (date: string) => {
    return dayjs(date).isAfter(dayjs(), 'day');
  };

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

  const renderHabitRow = (habit: HabitTask) => (
    <View key={habit.id} style={styles.habitRow}>
      <Text style={[styles.habitTitle, { backgroundColor: "#e46529" }]}>
        {habit.title}
      </Text>

      {weekDates.map((date) => {
        const entry = habit.completionHistory?.[date];
        const future = isFutureDate(date);

        if (habit.progressType === 'boolean') {
          return (
            <TouchableOpacity
              key={date}
              disabled={future}
              style={[
                styles.dayBox,
                entry ? styles.dayBoxCompleted : null,
                future && styles.dayBoxDisabled,
              ]}
              onPress={() => toggleBooleanCompletion(habit, date)}
            >
              {entry ? (
                <Image
                  source={require('../assests/icons/tick.png')}
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <Text></Text>
              )}
            </TouchableOpacity>
          );
        }

        const countText = typeof entry === 'number' ? `${entry}/${habit.targetValue}` : `0/${habit.targetValue || '?'}`;

        return (
          <TouchableOpacity
            key={date}
            disabled={future}
            style={[
              styles.dayBox,
              typeof entry === 'number' && entry >= (habit.targetValue || 0) ? styles.dayBoxCompleted : null,
              future && styles.dayBoxDisabled,
            ]}
            onPress={() => openCountModal(habit, date)}
          >
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
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {`Week ${weekNumber}`}
            </Text>
            <Text>
              {weekDates[0]} - {weekDates[6]}
            </Text>
          </View>

          <TouchableOpacity onPress={() => {
            const nextWeek = new Date(baseDate);
            nextWeek.setDate(baseDate.getDate() + 7);
            setBaseDate(nextWeek);
          }}>
            <Image style={styles.mainImage} source={require('../assests/icons/arrow-right.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.rowHeading}>
          <Text style={styles.habitTitleHeader}>Habit</Text>
          {weekDates.map((date) => (
            <Text key={date} style={styles.dayBoxHeader}>
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
          ))}
        </View>

        {habits.map(renderHabitRow)}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Enter count for "{currentHabit?.title}" on {currentDate}
            </Text>
            <Text style={styles.modalSubTitle}>
              Max: {currentHabit?.targetValue}
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputCount}
              onChangeText={setInputCount}
              placeholder="Enter count"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveCountCompletion}
              >
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
});
