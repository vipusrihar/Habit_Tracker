import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../LoginContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const LoginScreen = () => {
  const [username, onChangeUsername] = useState('');
  const [password, onChangePassword] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [isLoggedIn, setIsLoggedin] = useContext(LoginContext);


  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem('@userData');
      if (userData) {
        const originalData = JSON.parse(userData);
        if (originalData.username === username && originalData.password === password) {
          setIsLoggedin(true);
          Alert.alert("Login Successful");
        } else {
          Alert.alert("Invalid Email or Password");
        }
      } else {
        Alert.alert("No User Found")
      }
    } catch (error) {
      Alert.alert("Error ");
    }
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder='username'
          inputMode='text'
          value={username}
          onChangeText={onChangeUsername}
          style={styles.inputfield}
        />
        <TextInput
          placeholder='password'
          inputMode='text'
          value={password}
          secureTextEntry
          onChangeText={onChangePassword}
          style={styles.inputfield}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLinkText}>Not Registered...</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffa910',
  },
  inputfield: {
    color: '#333333',
    borderColor: '#cc6600',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff5e0',
  },
  button: {
    backgroundColor: '#cc3300',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#003366',
    textDecorationLine: 'underline',
  },
});