import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const HabitScreen = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView>
        <Text>HabitScreen</Text>
      </ScrollView>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddForm')} >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HabitScreen

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FFEB3B',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addText: {
    fontSize: 36,
    color: 'white',
    lineHeight: 36,
  },
})