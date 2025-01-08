import { Colors } from "@/constants/Colors";
import { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_TITLE = "Hello! 👋";

type HeaderProps = {
  title?: string;
  headerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Header: FC<HeaderProps> = ({
  title = INITIAL_TITLE,
  headerStyle,
  textStyle,
}) => {
  return (
    <SafeAreaView>
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.title, textStyle]}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },
  title: {
    fontFamily: "ClashGroteskMedium",
    fontSize: 26,
    color: "black",
    padding: 10,
    paddingHorizontal: 20,
  },
});
