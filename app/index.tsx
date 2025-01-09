import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

import { Link } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ScrollView, Text, View } from 'react-native';

import { useEffect } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useDb } from '@/db/useDb';
import { projects } from '@/db/schema';

export default function Home() {
  const db = useDb();

  // useEffect(() => {
  //   const load = async () => {
  //     // const data = await db.insert(projects).values({ title: 'Test', description: 'text' });
  //     const data = await db.query.projects.findMany();
  //     console.log(data);
  //     console.log('LOAD');
  //   };
  //   load();
  // }, []);
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
