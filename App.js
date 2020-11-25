import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

  const [loggingIn, setloggingIn] = useState(false);
  const [error, setError] = useState(null);

  const AppStack = createStackNavigator();

  useEffect(() => {
    AsyncStorage.getItem('userProfile').then((value) => {
      if (value) {
        setUserProfile(JSON.parse(value)),
          setIsLoading(false),
          setIsLogged(true);
      } else {
        setIsLoading(false), setIsLogged(false);
      }
    });
  }, []);

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setloggingIn(true);
      setUserProfile(null);
      setloggingIn(false);
      setIsLogged(false);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const doLogin = async (email, password) => {
    console.log(email + '...' + password);
    setloggingIn(true);
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
      let json = await response.json();
      console.log(json);
      if (json.status != false) {
        setUserProfile(json);
        setUserToken(json.token);
        setIsLogged(true);
        setError(null);
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
        setUserProfile({
          isLoggedIn: json.status,
          authToken: json.token,
          id: json.data.id,
          name: json.data.user_login,
          avatar: json.avatar,
        });
      } else {
        console.log('else');
        setIsLogged(false);
        setError('Login Failed');
      }
      setloggingIn(false);
    } catch (error) {
      console.error(error);
      setError('Error connecting to server');
      setloggingIn(false);
    }
  };

  const wContext = {
    userProfile: userProfile,
    loggingIn: loggingIn,
    error: error,
    doSome: () => {
      doSome();
    },
    doLogin: (email, password) => {
      doLogin(email, password);
    },
    doLogout: () => {
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
