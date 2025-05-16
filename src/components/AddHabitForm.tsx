import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addTask } from '../utills/HabitStorage';
import { HabitTask, HabitType, ProgressType } from '../types/HabitTask';

const generateId = () => Date.now().toString();

const AddHabitForm = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('daily');
  const [frequency, setFrequency] = useState('daily');
  const [progressType, setProgressType] = useState<ProgressType>('boolean');
  const [targetValue, setTargetValue] = useState<string>('');

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const newHabit: HabitTask = {
      id: generateId(),
      title,
      type,
      frequency,
      progressType,
      targetValue: progressType !== 'boolean' && targetValue ? parseInt(targetValue) : undefined,
      startDate: new Date().toISOString(),
      streakCount: 0,
      completionHistory: [],
    };

    await addTask(newHabit);

    // Clear form
    setTitle('');
    setFrequency('daily');
    setProgressType('boolean');
    setTargetValue('');
    setType('daily');
    Alert.alert('Success', 'Habit added successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Habit Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Drink Water"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Habit Type</Text>
      <Picker selectedValue={type} onValueChange={value => setType(value as HabitType)}>
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>

      <Text style={styles.label}>Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 3 times/week"
        value={frequency}
        onChangeText={setFrequency}
      />

      <Text style={styles.label}>Progress Type</Text>
      <Picker selectedValue={progressType} onValueChange={value => setProgressType(value as ProgressType)}>
        <Picker.Item label="Yes/No" value="boolean" />
        <Picker.Item label="Count" value="count" />
      </Picker>

      {progressType !== 'boolean' && (
        <>
          <Text style={styles.label}>Target Value</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8"
            keyboardType="numeric"
            value={targetValue}
            onChangeText={setTargetValue}
          />
        </>
      )}

      <Button title="Add Habit" onPress={handleAdd} />
    </ScrollView>
  );
};

export default AddHabitForm;

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 16
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  }
});
