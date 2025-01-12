import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { ThemedText } from './ThemedText';
import LottieView from 'lottie-react-native';
import emptyProject from '@/assets/lottie/empty-state.json';

const EmptyProject = () => {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();

    return () => animation.current?.pause();
  }, []);
  return (
    <View style={styles.container}>
      <LottieView autoPlay ref={animation} style={styles.empty} source={emptyProject} />
      <ThemedText style={{ textAlign: 'center' }}>No Projects. Add one to view.</ThemedText>
    </View>
  );
};

export default EmptyProject;

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  empty: {
    width: 200,
    height: 200,
  },
});
