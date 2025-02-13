import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import wave from '@/assets/lottie/audio-wave.json';

const Wave = ({ play }: { play: boolean }) => {
  const animation = useRef<LottieView | null>(null);

  useEffect(() => {
    const currentAnimation = animation.current;
    if (!currentAnimation) return;
    if (play) {
      currentAnimation.play();
    }

    return () => {
      currentAnimation.reset();
    };
  }, [play]);
  return <LottieView loop ref={animation} style={{ width: 50, height: 40 }} source={wave} />;
};

export default Wave;

const styles = StyleSheet.create({
  //   trophy: {
  //     width: 160,
  //     height: 70,
  //   },
});
