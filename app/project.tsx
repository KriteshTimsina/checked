import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { Header } from "@/components/Header";
import { data } from "@/constants/data";

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
    <View>
      <Text>project</Text>
    </View>
  );
};

export default project;

const styles = StyleSheet.create({});
