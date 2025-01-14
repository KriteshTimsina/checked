import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const UserIcon = () => {
  return (
    <Link href="/settings">
      <View style={styles.link}>
        <Feather name="user" size={28} color={Colors.secondary} />
      </View>
    </Link>
  );
};

export default UserIcon;

const styles = StyleSheet.create({
  link: {
    width: 45,
    height: 45,
    backgroundColor: Colors.light.icon,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
