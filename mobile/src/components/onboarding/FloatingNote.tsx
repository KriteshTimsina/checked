import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function FloatingNote({ note, index }: { note: any; index: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 400,
      withRepeat(
        withTiming(-7, {
          duration: 2000 + index * 300,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: note.rotate }],
  }));

  return (
    <Animated.View
      style={[
        styles.noteCard,
        animStyle,
        {
          backgroundColor: note.color,
          top: note.top,
          left: index * 12,
          shadowColor: note.color,
        },
      ]}
    >
      <Text style={styles.noteText}>{note.text}</Text>
      <View style={[styles.noteLine, { backgroundColor: 'rgba(0,0,0,0.12)' }]} />
      <View
        style={[
          styles.noteLine,
          { backgroundColor: 'rgba(0,0,0,0.08)', width: '65%', marginTop: 4 },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    position: 'absolute',
    left: 10,
    width: 250,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    height: 100,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  noteLine: {
    height: 2,
    borderRadius: 2,
    marginTop: 6,
  },
});
