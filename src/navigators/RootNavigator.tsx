import { View, Text, ActivityIndicator } from 'react-native'
import { useContext, useEffect, useState } from 'react';
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MainPage from './MainPage';
import AuthStack from './AuthStack';
import LoginContext from '../LoginContext';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {

  const [isLoggedin, setIsLoggedin] = useContext(LoginContext)

  return isLoggedin ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Main' component={MainPage} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Auth' component={AuthStack} />
    </Stack.Navigator>
  );
}

export default RootNavigator