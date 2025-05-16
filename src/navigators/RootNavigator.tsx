import { View, Text, ActivityIndicator } from 'react-native'
import { useContext, useEffect, useState } from 'react';
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MainPage from './MainPage';
import AuthStack from './AuthStack';
import LoginContext from '../LoginContext';
import AddHabitForm from '../components/AddHabitForm';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoggedin, setIsLoggedin] = useContext(LoginContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedin(value === 'true');
      } catch (error) {
        console.error('Error reading login status', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff993f" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return isLoggedin ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainPage} />
      <Stack.Screen name="AddForm" component={AddHabitForm} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};


export default RootNavigator