import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { setLogout } from '../utils/LoginStorage';
import { deleteUser, getUser } from '../utils/userStorage';
import { LoginContext } from '../LoginContex';
import { User } from '../types/User';
import { clearAllTasks } from '../utils/HabitStorage';

const ProfileScreen = () => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await getUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        console.log("No user found");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Yes', style: 'destructive', onPress: () => { setLogout(); setIsLoggedIn(false); } },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };


  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Delete', style: 'destructive', onPress: () => {deleteUser(); clearAllTasks(); setLogout(); setIsLoggedIn(false);} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.username}</Text>
      <Text style={styles.title}>{user.email}</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Image style={styles.buttonImage} source={require('../assests/icons/logout.png')} />
          <Text style={styles.iconName}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleDeleteAccount}>
          <Image style={styles.buttonImage} source={require('../assests/icons/delete.png')} />
          <Text style={styles.iconName}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffaf2', 
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff993f',
    marginBottom: 10,
  },
  iconContainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop:30,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#ff993f', 
    padding: 12,
    borderRadius: 12,
    width: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonImage: {
    height: 30,
    width: 30,
    tintColor: '#fff',
    marginBottom: 5,
  },
  iconName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

