import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
        padding: 20,
      }}
    >
      <Text style={{ fontFamily: "ClashGroteskMedium", fontSize: 22 }}>
        Projects
      </Text>

      <ScrollView>
        <View style={{ gap: 10, marginVertical: 20 }}>
          {Array.from({ length: 3 })
            .fill("")
            .map((item, index) => {
              return <Project key={index} />;
            })}
        </View>
      </ScrollView>
    </View>
  );
}

const Project = () => {
  return (
    <Link
      href={"/project"}
      style={{
        backgroundColor: Colors.primary,
        minHeight: 60,
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text>1</Text>
    </Link>
  );
};
