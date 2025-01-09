import { Pressable, StyleSheet, View, Button, TextInput } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Header } from '@/components/Header';
import { data } from '@/constants/data';
import { Colors } from '@/constants/Colors';
import Checkbox, { CheckboxEvent } from 'expo-checkbox';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AntDesign, Ionicons } from '@expo/vector-icons';

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
    <ThemedView style={{ flex: 1, padding: 20 }}>
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
        <View
          style={{
            borderColor: Colors.light.icon,
            height: 100,
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <TextInput
            value=""
            placeholder="Enter"
            placeholderTextColor={'white'}
            style={{ height: 40, borderBottomColor: Colors.light.icon, borderBottomWidth: 1 }}
          />

          <View>
            <Pressable>
              <Ionicons name="close-outline" size={25} color="white" />
            </Pressable>
            <Pressable>
              <Ionicons name="paper-plane-outline" size={25} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.highlight,
          height: 50,
          width: 50,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-end',
        }}
      >
        <AntDesign name="plus" size={35} color="white" />
      </View>

      <Button title="TEST" onPress={() => setAllCompleted(true)} />
    </ThemedView>
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
      <ThemedText
        style={{
          textDecorationLine: checked ? 'line-through' : 'none',
        }}
      >
        {item.title}
      </ThemedText>
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
