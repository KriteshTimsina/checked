import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import { Header } from "@/components/Header";
import { data } from "@/constants/data";
import { Colors } from "@/constants/Colors";
import Checkbox, { CheckboxEvent } from "expo-checkbox";

const project = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          headerStyle={{ height: 100 }}
          textStyle={{ textAlign: "center" }}
          title={data[0].title}
        />
      ),
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
        padding: 20,
        gap: 20,
      }}
    >
      {data[0].checklist.map((item) => {
        return <CheckList key={item.id} item={item} />;
      })}
    </View>
  );
};

export default project;

const CheckList = ({ item }: any) => {
  const checkedRef = useRef<CheckboxEvent>(null);
  const [checked, setChecked] = useState(item.completed);

  const toggleCheckbox = () => {
    setChecked(!checked);
    checkedRef.current?.value === checked ? true : false;
  };

  return (
    <Pressable
      onPress={toggleCheckbox}
      ref={checkedRef}
      style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
    >
      <Checkbox
        style={{ borderRadius: 100, width: 25, height: 25, padding: 5 }}
        color={Colors.highlight}
        value={checked}
        onValueChange={toggleCheckbox}
      />
      <Text
        style={{
          fontFamily: "ClashGroteskMedium",
          fontSize: 18,
          textDecorationLine: checked ? "line-through" : "none",
        }}
      >
        {item.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
