import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { getTasks } from '../utils/HabitStorage'
import { HabitTask } from '../types/HabitTask'

const HabitScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<HabitTask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    };
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          {
            tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Text style={styles.taskText}>{task.title}</Text>
              </View>
            ))
          }
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddForm')}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HabitScreen

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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 18,
  }
})
