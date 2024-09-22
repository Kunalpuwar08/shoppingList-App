import {InteractionManager, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {Colors} from '../contant';
import * as Animatable from 'react-native-animatable';

const WelcomeScreen = ({navigation}: any) => {
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate('home');
    });
  });

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInLeft" style={styles.heading}>
        Welcome To{' '}
      </Animatable.Text>
      <Animatable.Text animation="fadeInRight" style={styles.name}>
        Shopping List By Kp
      </Animatable.Text>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  name: {
    fontSize: 30,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
