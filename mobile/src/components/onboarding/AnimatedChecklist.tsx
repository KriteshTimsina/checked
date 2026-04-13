import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { View, Text, StyleSheet } from 'react-native';

export function AnimatedRow({
  item,
  index,
  anim,
  done,
  color,
}: {
  item: string;
  index: number;
  anim: any;
  done: number;
  color: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
  }));

  return (
    <Animated.View style={[style.checkRow, animatedStyle]}>
      <View
        style={[
          style.checkbox,
          {
            borderColor: color,
            backgroundColor: index < done ? color : 'transparent',
          },
        ]}
      >
        {index < done && <Text style={style.checkmark}>✓</Text>}
      </View>

      <Text
        style={[
          style.checkText,
          {
            color: index < done ? '#CCC' : '#333',
            textDecorationLine: index < done ? 'line-through' : 'none',
          },
        ]}
      >
        {item}
      </Text>
    </Animated.View>
  );
}

const style = StyleSheet.create({
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
  checkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
