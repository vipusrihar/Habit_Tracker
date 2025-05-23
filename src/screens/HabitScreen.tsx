import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HabitTask } from '../types/HabitTask';
import { deleteTask, getTasks, isCompletedToday } from '../utils/HabitStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const HabitScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [tasks, setTasks] = useState<HabitTask[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const loadedTasks = await getTasks();
      console.log(loadedTasks);
      setTasks(loadedTasks);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks.');
      console.error('Error fetching tasks:', error);
    }
  };

  const handleViewInfo = (task: HabitTask) => {
    navigation.navigate('ViewTask', { task });
  };

  const handleEditTask = (task: HabitTask) => {
    navigation.navigate('AddForm', { task });
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTasks = tasks.filter((t) => t.id !== taskId);
          setTasks(updatedTasks);
          await deleteTask(taskId);
        },
      },
    ]);
  };


  const filteredTasks = tasks.filter((task) => {
    const today = getTodayDate();

    switch (filter) {
      case 'all':
        return true;

      case 'today':
        if (task.startDate > today) return false;

        if (task.type === 'daily') {
          return true;
        } else if (task.type === 'weekly') {
          const dayOfWeek = new Date(today).toLocaleDateString('en-US', { weekday: 'short' });
          return task.weekDays?.includes(dayOfWeek);
        }
        return false;

      default:
        return true;
    }
  });


  return (
    <SafeAreaView style={{ flex: 1 , padding:0, margin:0}}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilter]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('today')}>
          <Text style={[styles.filterText, filter === 'today' && styles.activeFilter]}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => {
              const completed = isCompletedToday(task);
              const taskStyle = [
                styles.taskItem,
                filter === 'today' && completed && styles.completedTaskItem,
              ];

              return (
                <View key={index} style={taskStyle}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleViewInfo(task)}>
                      <Image style={styles.icon} source={require('../assests/icons/info.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleEditTask(task)}>
                      <Image style={styles.icon} source={require('../assests/icons/edit.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTask(task.id)}
                    >
                      <Image style={styles.icon} source={require('../assests/icons/delete.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.noTask}>
              <Text>No Tasks Found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddForm')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HabitScreen;

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#ff993f',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 36,
    color: '#ffffff',
    lineHeight: 36,
  },
  taskItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff3e5',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffa856',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a2c10',
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  button: {
    backgroundColor: '#ffaa5f',
    padding: 10,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 6,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  noTask: {
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#ffe4c4',
    paddingVertical: 10,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  activeFilter: {
    color: '#ff993f',
    textDecorationLine: 'underline',
  },
  completedTaskItem: {
    backgroundColor: '#d4f4d2', 
    borderColor: '#a5d6a7',     
  },
});
