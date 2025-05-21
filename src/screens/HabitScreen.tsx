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
import { deleteTask, getTasks } from '../utils/HabitStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const HabitScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [tasks, setTasks] = useState<HabitTask[]>([]);

  const handleViewInfo = (task: HabitTask) => {
    navigation.navigate('ViewTask', { task });
  };

  const handleEditTask = (task: HabitTask) => {
    navigation.navigate('AddForm', { task }); 
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
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
      ]
    );
  };

  const fetchTasks = async () => {
    try {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks.');
      console.error('Error fetching tasks:', error);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 , padding:0}}>
      <ScrollView style={{padding:0}}>
        <View>
          {
            tasks.length > 0 ? (
              tasks.map((task, index) => (
                <View key={index} style={styles.taskItem}>
                 <View style={{flex:1, justifyContent:"flex-start"}}>
                   <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskType}>{task.progressType}</Text>
                  </View>

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.normalButton} onPress={() => handleViewInfo(task)}>
                      <Image style={styles.icon} source={require('../assests/icons/info.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.normalButton} onPress={() => handleEditTask(task)}>
                      <Image style={styles.icon} source={require('../assests/icons/edit.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(task.id)}>
                       <Image style={styles.icon} source={require('../assests/icons/delete.png')}/>
                    </TouchableOpacity>
                  </View>
                </View>
              ))

            ) : (
              <View style={styles.noTask}>
                <Text>No Tasks Found</Text>
              </View>
            )
          }
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
};

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 36,
    color: '#ffffff',
    lineHeight: 36,
  },
  taskItem: {
    padding: 16,
    backgroundColor: '#fff3e5',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffa856',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a2c10', 
  },
  taskType: {
    fontSize: 12,
    color: '#b36b00',
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    gap: 5,
  },
  normalButton: {
    backgroundColor: '#ffaa5f', 
    padding: 10,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  dayContainer: {
    alignItems: 'center',
    width: 40,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: '#fff', 
  },
  noTask: {
    alignItems:"center"
  }
});
