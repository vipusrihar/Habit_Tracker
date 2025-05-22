import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUser } from '../utils/userStorage';
import { User } from '../types/User';
import { setLogin } from '../utils/LoginStorage';
import { LoginContext } from "../LoginContex";


const LoginScreen = () => {
  const [username, onChangeUsername] = useState('');
  const [password, onChangePassword] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { setIsLoggedIn } = useContext(LoginContext);


  const handleLogin = async () => {
    try {
      const userData: User | null = await getUser();
      if (userData) {
        if (userData.username === username && userData.password === password) {
          Alert.alert("Login Successful");
          await setLogin();
          setIsLoggedIn(true);
          // navigation.navigate('MainPage')
        }
        else {
          Alert.alert("Invalid Username or Password");
        }
      } else {
        Alert.alert("No User Found");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong during login");
    }
  };

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
          <Text style={styles.loginText}>Login</Text>
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
  loginText: {
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