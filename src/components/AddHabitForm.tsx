import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addTask, updateTask } from '../utils/HabitStorage';
import { HabitTask, HabitType, ProgressType } from '../types/HabitTask';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute, RouteProp } from '@react-navigation/native';

const AddHabitForm = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('daily');
  const [progressType, setProgressType] = useState<ProgressType>('boolean');
  const [targetValue, setTargetValue] = useState('');
  const [color, setColor] = useState('#ff9800');
  const [weekDays, setWeekDays] = useState<string[]>([]);


  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<{ params: { task?: HabitTask } }, 'params'>>();
  const taskToEdit = route.params?.task;

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setType(taskToEdit.type);
      setProgressType(taskToEdit.progressType);
      setTargetValue(taskToEdit.targetValue?.toString() || '');
    }
  }, [taskToEdit]);

  const toggleWeekDay = (day: string) => {
  if (weekDays.includes(day)) {
    setWeekDays(weekDays.filter((d) => d !== day));
  } else {
    setWeekDays([...weekDays, day]);
  }
};

const allWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const newHabit: HabitTask = {
      id: taskToEdit?.id || '' ,
      title,
      type,
      progressType,
      targetValue: progressType !== 'boolean' && targetValue ? parseInt(targetValue) : undefined,
      startDate: taskToEdit?.startDate || new Date().toISOString().split("T")[0],
      streakCount: taskToEdit?.streakCount || 0,
      color,
      weekDays:weekDays,
      completionHistory: taskToEdit?.completionHistory || {},
    };

    try {
      if (taskToEdit) {
        await updateTask(newHabit);
        Alert.alert("Success", "Habit Updated Successfully");
      } else {
        await addTask(newHabit);
        Alert.alert("Success", "Habit Added Successfully");
      }
      navigation.navigate('Main');
    } catch (error) {
      console.error('Habit save error:', error);
      Alert.alert("Error", "Failed to save habit");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Habit Title</Text>
      <TextInput
        style={styles.input}
        placeholder="example -> Drink Water"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#fda72d"
      />

      <Text style={styles.label}>Habit Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={(value) => setType(value as HabitType)}
        style={styles.picker}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
      </Picker>


      {type !== 'daily' && (
        <>
          <Text style={styles.label}>Select Week Days</Text>
          <View style={styles.weekdayContainer}>
            {allWeekDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.weekdayButton,
                  weekDays.includes(day) && styles.selectedDay,
                ]}
                onPress={() => toggleWeekDay(day)}
              >
                <Text style={styles.weekdayText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Progress Type</Text>
      <Picker
        selectedValue={progressType}
        onValueChange={(value) => setProgressType(value as ProgressType)}
        style={styles.picker}
      >
        <Picker.Item label="Yes/No" value="boolean" />
        <Picker.Item label="Count" value="count" />
      </Picker>

      {progressType !== 'boolean' && (
        <>
          <Text style={styles.label}>Target Value</Text>
          <TextInput
            style={styles.input}
            placeholder="example -> if 8 glasses input 8"
            keyboardType="numeric"
            value={targetValue}
            onChangeText={setTargetValue}
            placeholderTextColor="#fda72d"
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>{taskToEdit ? 'Update Habit' : 'Add Habit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddHabitForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff8f0',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#e65100',
  },
  input: {
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff3e0',
  },
  picker: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginBottom: 8,
    color: '#e65100',
  },
  button: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekdayContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
},
weekdayButton: {
  backgroundColor: '#ffe0b2',
  padding: 8,
  borderRadius: 8,
  margin: 4,
  minWidth: 50,
  alignItems: 'center',
},
selectedDay: {
  backgroundColor: '#ff9800',
},
weekdayText: {
  color: '#e65100',
  fontWeight: 'bold',
},

});
