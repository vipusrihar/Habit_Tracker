import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native'
import React from 'react'
import { setLogout } from '../utils/LoginStorage'
import { deleteUser } from '../utils/userStorage'

const ProfileScreen = () => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are You sure You Want To Logout?',
      [
        { text: 'Yes', style: 'destructive', onPress: () => setLogout() },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  const handleInfo = () => {
    Alert.alert('Info', 'This is your progress screen. Track your achievements here.')
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Delete', style: 'destructive', onPress: () => deleteUser() },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Image style={styles.buttonImage} source={require('../assests/icons/logout.png')} />
          <Text style={styles.iconLabel}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleInfo}>
          <Image style={styles.buttonImage} source={require('../assests/icons/info.png')} />
          <Text style={styles.iconLabel}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleDeleteAccount}>
          <Image style={styles.buttonImage} source={require('../assests/icons/delete.png')} />
          <Text style={styles.iconLabel}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    width: 80,
  },
  buttonImage: {
    height: 30,
    width: 30,
    tintColor: '#fff',
    marginBottom: 5,
  },
  iconLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
})
