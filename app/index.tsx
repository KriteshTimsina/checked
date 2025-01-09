import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

import { Link, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useDb } from '@/db/useDb';
import { projects } from '@/db/schema';

export default function Home() {
  const db = useDb();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      // const data = await db.insert(projects).values({ title: 'Test', description: 'text' });
      const data = await db.query.projects.findMany();
      setProjects(data);
    };
    load();
  }, []);
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
          {projects.map((item, index) => {
            return <Project key={index} item={item} />;
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const Project = ({ item }: any) => {
  return (
    <Link
      href={{
        pathname: '/project',
        params: item,
      }}
      style={{
        backgroundColor: Colors.primary,
        minHeight: 60,
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text>{item.title}</Text>
    </Link>
  );
};
