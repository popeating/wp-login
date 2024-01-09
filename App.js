import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginUrl } from './const/const';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './components/Login';
import Home from './components/Home';
import mainContext, { doSome } from './context/Context';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [loggingIn, setLoggingIn] = useState(false); // Corrected variable name
  const [error, setError] = useState(null);

  const AppStack = createStackNavigator();

  useEffect(() => {
    AsyncStorage.getItem('userProfile').then((value) => {
      if (value) {
        setUserProfile(JSON.parse(value));
        setIsLoading(false);
        setIsLogged(true);
      } else {
        setIsLoading(false);
        setIsLogged(false);
      }
    });
  }, []);

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setLoggingIn(true);
      setUserProfile(null);
      setLoggingIn(false);
      setIsLogged(false);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const doLogin = async (email, password) => {
    console.log('Login initiated:', email, password);
    setLoggingIn(true);
    setError(null);
    let formData = new FormData();
    formData.append('type', 'login');
    formData.append('email', email);
    formData.append('password', password);
    try {
      let response = await fetch(loginUrl, {
        method: 'POST',
        body: formData,
      });
  
      console.log('Server Response Status:', response.status);
      const content = await response.text();
      console.log('Response Content:', content);
  
      // Check if the response contains a valid JSON string
      const jsonStartIndex = content.indexOf('{');
      if (jsonStartIndex !== -1) {
        const jsonString = content.slice(jsonStartIndex);
  
        try {
          let json = JSON.parse(jsonString);
          console.log('Parsed JSON:', json);
  
          if (json.status !== false) {
            setError(null);
            try {
              await AsyncStorage.setItem(
                'userProfile',
                JSON.stringify({
                  isLoggedIn: json.status,
                  authToken: json.token,
                  id: json.data.id,
                  name: json.data.user_login,
                  avatar: json.avatar,
                })
              );
            } catch {
              setError('Error storing data on device');
            }
            setUserProfile({
              isLoggedIn: json.status,
              authToken: json.token,
              id: json.data.id,
              name: json.data.user_login,
              avatar: json.avatar,
            });
            setIsLogged(true);
            setUserProfile(json);
            setUserToken(json.token);
          } else {
            setIsLogged(false);
            setError('Login Failed');
          }
        } catch (jsonError) {
          console.error('JSON Parse Error:', jsonError);
          setError('Invalid JSON in response');
        }
      } else {
        console.error('Response does not contain valid JSON');
        setError('Invalid response from server');
      }
  
      setLoggingIn(false);
    } catch (error) {
      console.error('Login Error:', error);
      setError('Error connecting to server');
      setLoggingIn(false);
    }
  };
  

  const wContext = {
    userProfile: userProfile,
    loggingIn: loggingIn,
    error: error,
    doSome: () => {
      // Assuming doSome is a placeholder function
      console.log('doSome called'); // Debug statement
      doSome();
    },
    doLogin: (email, password) => {
      console.log('doLogin called'); // Debug statement
      doLogin(email, password);
    },
    doLogout: () => {
      console.log('doLogout called'); // Debug statement
      doLogout();
    },
  };

  if (isLoading) {
    // Checking if already logged in
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <mainContext.Provider value={wContext}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppStack.Navigator initialRouteName="Login">
          {isLogged == false ? (
            <>
              <AppStack.Screen name="Login to Wordpress" component={Login} />
            </>
          ) : (
            <>
              <AppStack.Screen name="Home" component={Home} />
            </>
          )}
        </AppStack.Navigator>
      </NavigationContainer>
    </mainContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
