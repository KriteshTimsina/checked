import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import trophy from '@/assets/lottie/success.json';

const Trophy = () => {
  const animation = useRef<LottieView | null>(null);

  useEffect(() => {
    const currentAnimation = animation.current;
    if (!currentAnimation) return;
    currentAnimation.play();

    return () => {
      currentAnimation.reset();
    };
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
