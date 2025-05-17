import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { User } from "../types/User";

const USER_STORE_KEY = "@userData";



export const registerUser = async (user: User) => {
  try {
    await AsyncStorage.setItem(USER_STORE_KEY, JSON.stringify(user));
    Alert.alert("Success", "User registered successfully");
  } catch (error) {
    console.error("Error during saving user:", error);
    Alert.alert("Error", "Something went wrong while registering");
  }
};

// Get stored user
export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORE_KEY);
    return userData ? JSON.parse(userData) as User : null;
  } catch (error) {
    console.error("Error during fetching user data:", error);
    Alert.alert("Error", "Something went wrong while fetching user data");
    return null;
  }
};

export const deleteUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORE_KEY);
  } catch (error) {
    console.error("Error  during deleting user:", error);
  }
};
