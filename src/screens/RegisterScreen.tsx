import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../LoginContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



const RegisterScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [username, onChangeUsername] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [repassword, onChangeRePassword] = useState('');


  const [isLoggedIn, setIsLoggedin] = useContext(LoginContext);



  const validateEmail = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Please Fill All Fields");
      return
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (password !== repassword) {
      Alert.alert("Passwords Does Not Match");
      return
    }
    if (password.length < 8) {
      Alert.alert("Password Should Be Atleast 8 Characters");
      return;
    }
    try {
      const user = { username, email, password };
      await AsyncStorage.setItem('@userData', JSON.stringify(user));
      Alert.alert("User Registered Sucessfully");
      setIsLoggedin(true);

    } catch (error) {
      Alert.alert("Error When Saving Data. Try Again ");
      console.log('Error saving Data : ', error)
    }
  }

  return (

    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Username"
          inputMode="text"
          style={styles.inputfield}
          value={username}
          onChangeText={onChangeUsername}
          placeholderTextColor="#666666"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          inputMode="email"
          style={styles.inputfield}
          value={email}
          onChangeText={onChangeEmail}
          placeholderTextColor="#666666"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          inputMode="text"
          maxLength={8}
          secureTextEntry
          style={styles.inputfield}
          value={password}
          onChangeText={onChangePassword}
          placeholderTextColor="#666666"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Type Password Again"
          inputMode="text"
          maxLength={8}
          secureTextEntry
          style={styles.inputfield}
          value={repassword}
          onChangeText={onChangeRePassword}
          placeholderTextColor="#666666"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLinkText}>Already have an Account ? </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>

  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9910',
  },
  inputfield: {
    color: '#442200',
    borderColor: '#cc7a00',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#003366',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
