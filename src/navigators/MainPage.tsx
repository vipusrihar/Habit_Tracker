import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HabbitScreen from '../screens/HabitScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WeeklyViewScreen from '../screens/WeeklyScreenView';

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
        tabBarInactiveBackgroundColor: "#ff993f",
      }}
    >
      <Tab.Screen 
        name='My Habbits' 
        component={HabbitScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../assests/icons/select-all.png')} 
              style={{ width: 20, height: 20, tintColor: focused ? 'black' : 'gray' }} 
            />
          )
        }} 
      />
      <Tab.Screen 
        name='Progress' 
        component={WeeklyViewScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../assests/icons/calendar-mark.png')} 
              style={{ width: 20, height: 20, tintColor: focused ? 'black' : 'gray' }} 
            />
          )
        }} 
      />
      <Tab.Screen 
        name='Profile' 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../assests/icons/person.png')} 
              style={{ width: 20, height: 20, tintColor: focused ? 'black' : 'gray' }} 
            />
          )
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainPage;
