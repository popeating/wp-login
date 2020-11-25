import React, { useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Avatar } from 'react-native-paper';
import mainContext from '../context/Context';

const Home = () => {
  const { userProfile, loggingIn, doLogout, error } = useContext(mainContext);

  return (
    <View style={styles.container}>
      <View style={styles.avcontainer}>
        <Avatar.Image
          size={56}
          source={{
            uri: userProfile && userProfile.avatar,
          }}
        />
      </View>
      <View style={styles.logo}>
        <Image
          source={require('../assets/rw.png')}
          style={{ width: 70, height: 30 }}
        />
      </View>
      <Text>Welcome back {userProfile && userProfile.name}</Text>
      <Button
        title="Login to Wordpress"
        onPress={() => doLogout()}
        disabled={loggingIn}
      >
        Logout From Wordpress
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avcontainer: {
    marginBottom: 20,
  },
  logo: {
    position: 'absolute',
    top: 90,
  },
});

export default Home;
