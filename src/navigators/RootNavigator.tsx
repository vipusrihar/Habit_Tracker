import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './MainPage';
import AddHabitForm from '../components/AddHabitForm';
import AuthStack from './AuthStack';
import { LoginContext } from '../LoginContex';
import ViewTaskScreen from '../screens/ViewTaskScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return isLoggedIn ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainPage} />

      <Stack.Screen
        name="AddForm"
        component={AddHabitForm}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#ff993f' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <Stack.Screen
        name="ViewTask"
        component={ViewTaskScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#ff993f' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>


  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
