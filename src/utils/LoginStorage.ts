import AsyncStorage from "@react-native-async-storage/async-storage";


const LOGIN_KEY = '@loginstate';

export const setLogin = async () => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(true));
  } catch (error) {
    console.error("Error setting login state:", error);
  }
};

export const setLogout = async () => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(false));
  } catch (error) {
    console.error("Error setting logout state:", error);
  }
};

export const checkLoginStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(LOGIN_KEY);
    return value === 'true'; // AsyncStorage stores everything as strings
  } catch (error) {
    console.error("Error checking login state:", error);
    return false;
  }
};
