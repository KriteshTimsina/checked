import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

import { Link, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, ScrollView, Text, ToastAndroid, View } from 'react-native';

import { useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useDb } from '@/db/useDb';
import { projects as projectsSchema } from '@/db/schema';

import AntDesign from '@expo/vector-icons/AntDesign';
import { count } from 'drizzle-orm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const db = useDb();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await db.query.projects.findMany();
      setProjects(data);
    };
    load();
  }, []);

  const onAddProject = async () => {
    const hasProjects = await db.select({ count: count() }).from(projectsSchema);

    if (hasProjects[0].count > 1) {
      ToastAndroid.showWithGravity(
        'Cannot add more than one project in free version',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return false;
    }

    const data = await db
      .insert(projectsSchema)
      .values({
        title: 'Project',
        description: 'Hello',
      })
      .returning({
        id: projectsSchema.id,
        title: projectsSchema.title,
      });

    if (data) {
      setProjects(data);
    }
  };
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
          {projects.length > 0 ? (
            projects.map((item, index) => {
              return <Project key={index} item={item} />;
            })
          ) : (
            <ThemedText>No Projects</ThemedText>
          )}
        </View>
      </ScrollView>
      <Pressable
        onPress={onAddProject}
        style={{
          backgroundColor: Colors.highlight,
          height: 50,
          width: 50,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: '5%',
          right: '5%',
        }}
      >
        <AntDesign name="plus" size={35} color="white" />
      </Pressable>
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
