import { StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { ThemedText } from './ThemedText';
import LottieView from 'lottie-react-native';
import trophy from '@/assets/lottie/success.json';
import { ThemedView } from './ThemedView';

const Trophy = () => {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();

    return () => animation.current?.pause();
  }, []);
  return <LottieView autoPlay ref={animation} style={styles.trophy} source={trophy} />;
};

export default Trophy;

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  trophy: {
    width: 200,
    height: 200,
  },
});
