import { Pressable, StyleSheet, Text, View, Button } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Header } from '@/components/Header';
import { data } from '@/constants/data';
import { Colors } from '@/constants/Colors';
import Checkbox, { CheckboxEvent } from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Project = () => {
  const navigation = useNavigation();
  const [allCompleted, setAllCompleted] = useState(false);

  const close = () => setAllCompleted(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          headerStyle={{ height: 100 }}
          textStyle={{ textAlign: 'center' }}
          title={data[0].title}
        />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: Colors.secondary }}>
      {allCompleted && <Success close={close} />}
      <View
        style={{
          flex: 1,
          gap: 20,
        }}
      >
        {data[0].checklist.map(item => {
          return <CheckList key={item.id} item={item} />;
        })}
      </View>

      <Button title="TEST" onPress={() => setAllCompleted(true)} />
    </SafeAreaView>
  );
};

export default Project;

const CheckList = ({ item }: any) => {
  const checkedRef = useRef<CheckboxEvent | null>(null);
  const [checked, setChecked] = useState(item.completed);

  const toggleCheckbox = () => {
    setChecked(!checked);
    checkedRef.current?.value === checked ? true : false;
  };

  return (
    <Pressable
      onPress={toggleCheckbox}
      ref={checkedRef}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
    >
      <Checkbox
        style={{ borderRadius: 100, width: 25, height: 25, padding: 5 }}
        color={Colors.highlight}
        value={checked}
        onValueChange={toggleCheckbox}
      />
      <Text
        style={{
          fontFamily: 'ClashGroteskMedium',
          fontSize: 18,
          textDecorationLine: checked ? 'line-through' : 'none',
        }}
      >
        {item.title}
      </Text>
    </Pressable>
  );
};

const Success = ({ close }: any) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.primary,
        flex: 1,
        zIndex: 10,
        top: -20,
        padding: 20,
        alignItems: 'center',
        paddingTop: 50,
        gap: 20,
        justifyContent: 'center',
      }}
    >
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      <Animated.Image
        entering={FadeInDown.delay(300)}
        source={require('@/assets/images/success.png')}
        style={{ width: 100, height: 100 }}
      />
      <Animated.Text entering={FadeInDown.delay(400)} style={{ fontSize: 16 }}>
        All tasks completed
      </Animated.Text>
      <Button onPress={close} title="Reset all tasks" color={Colors.highlight} />
    </View>
  );
};
