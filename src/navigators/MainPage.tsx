import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HabbitScreen from '../screens/HabitScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();



const MainPage = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ff993f',
          height: 70,
        },
        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: '#FFF',
        tabBarStyle: {
          height: 50,
          paddingBottom: 4,
          backgroundColor: '#ff993f',
        },
        tabBarInactiveBackgroundColor: "#ff993f"
      }}
    >
      <Tab.Screen name='Habbit' component={HabbitScreen} />
      <Tab.Screen name='Progress' component={ProgressScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>

  );
};

export default MainPage;
