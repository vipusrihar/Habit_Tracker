import { View, Text, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MainPage from './MainPage';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const isLoggedin = true;
  return (
    <Stack.Navigator screenOptions={{headerShown : false}}>
        {
        isLoggedin ? (
            <Stack.Screen name='main' component={MainPage}/>
        ) : (
            <Stack.Screen name='Auth' component={AuthStack}/>
        )
        }
    </Stack.Navigator>
  )
}

export default RootNavigator