import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addTask } from '../utils/HabitStorage';
import { HabitTask, HabitType, ProgressType } from '../types/HabitTask';
import { useNavigation } from '@react-navigation/native';
// import ColorPicker, {
//   HueSlider,
//   OpacitySlider,
//   Panel1,
//   Preview,
//   Swatches
// } from 'reanimated-color-picker';

const generateId = () => Date.now().toString();

const AddHabitForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('daily');
  const [progressType, setProgressType] = useState<ProgressType>('boolean');
  const [targetValue, setTargetValue] = useState<string>('');
  const [color, setColor] = useState('#00bcd4');

  const onSelectColor = ({ hex }: any) => {
    setColor(hex);
  };

  const navigation = useNavigation();

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const newHabit: HabitTask = {
      id: generateId(),
      title,
      type,
      progressType,
      targetValue:
        progressType !== 'boolean' && targetValue
          ? parseInt(targetValue)
          : undefined,
      startDate: new Date().toISOString(),
      streakCount: 0,
      completionHistory: [],
      color
    };

    try {
      await addTask(newHabit);
      Alert.alert("Success", "Habit Added Successfully", [
        {
          text: "OK",
          onPress: () => {
            setTitle('');
            setProgressType('boolean');
            setTargetValue('');
            setType('daily');
            navigation.navigate('Main');
          }
        }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add habit");
    }




    // Reset form

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
      <Picker
        selectedValue={type}
        onValueChange={(value) => setType(value as HabitType)}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>

      <Text style={styles.label}>Progress Type</Text>
      <Picker
        selectedValue={progressType}
        onValueChange={(value) => setProgressType(value as ProgressType)}
      >
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

      {/* <Text style={styles.label}>Color</Text>
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: color,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 10
          }}
        />
        <Button title="Pick Color" onPress={() => setShowModal(true)} />
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContent}>
          <ColorPicker
            style={{ width: '100%', height: 300 }}
            value={color}
            onComplete={onSelectColor}
          >
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>

          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}

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
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#00bcd4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
});
