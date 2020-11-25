import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, TextInput, Button, Text } from 'react-native-paper';
import { abs } from 'react-native-reanimated';
import mainContext from '../context/Context';

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { userProfile, loggingIn, doLogin, error } = useContext(mainContext);
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require('../assets/rw.png')}
          style={{ width: 70, height: 30 }}
        />
      </View>
      {error && (
        <View style={styles.error}>
          <Text style={styles.errortext}>{error}</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email address"
          onChangeText={(email) => setEmail(email)}
          value={email}
          label="Email"
          keyboardType={'email-address'}
          mode="outlined"
          disabled={loggingIn}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          value={password}
          secureTextEntry={true}
          label="Password"
          mode="outlined"
          disabled={loggingIn}
        />
      </View>
      <Button
        title="Login to Site"
        onPress={() => doLogin(email, password)}
        disabled={loggingIn}
      >
        Login to Wordpress
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  error: {
    backgroundColor: '#f8d7da',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    borderColor: '#f5c6cb',
    marginBottom: 20,
  },
  errortext: {
    color: '#721c24',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    top: 20,
  },
});

export default Login;
