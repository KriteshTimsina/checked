import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ButtonProps = {
  onPress: () => void;
};

const Button: FC<ButtonProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <AntDesign name="plus" size={35} color="white" />
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.highlight,
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10%',
    right: '10%',
  },
});
