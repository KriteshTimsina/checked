import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function Home() {
  return (
    <ThemedView
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <ThemedText type="subtitle">Projects</ThemedText>

      <ScrollView>
        <View style={{ gap: 10, marginVertical: 20 }}>
          {Array.from({ length: 3 })
            .fill('')
            .map((item, index) => {
              return <Project key={index} />;
            })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const Project = () => {
  return (
    <Link
      href={'/project'}
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
