import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

import { Link } from 'expo-router';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';

import { useEffect, useRef, useState } from 'react';
import { useDb } from '@/db/useDb';
import { IProject, projects as projectsSchema } from '@/db/schema';

import { count } from 'drizzle-orm';
import Button from '@/components/Button';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ProjectItem from '@/components/ProjectItem';
import { toast } from '@/utils/Toast';
import EmptyProject from '@/components/EmptyProject';

export default function Home() {
  const db = useDb();
  const [projects, setProjects] = useState<IProject[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await db.query.projects.findMany();
      if (data.length === 0) {
        return toast('No projects. Add one to view.');
      }
      setProjects(data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onAddProject = async () => {
    const hasProjects = await db.select({ count: count() }).from(projectsSchema);

    // if (hasProjects[0].count > 1) {
    //   ToastAndroid.showWithGravity(
    //     'Cannot add more than one project in free version',
    //     ToastAndroid.LONG,
    //     ToastAndroid.BOTTOM,
    //   );
    //   return false;
    // }

    const data = await db
      .insert(projectsSchema)
      .values({
        title: inputText,
        description: 'This project has no description.',
      })
      .returning({
        id: projectsSchema.id,
        title: projectsSchema.title,
        description: projectsSchema.description,
      });

    if (data) {
      setProjects(data);
    }
  };

  const openSheet = () => bottomSheetRef.current?.expand();
  const closeSheet = () => bottomSheetRef.current?.close();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Projects</ThemedText>
        <ScrollView
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProjects} />}
        >
          <View style={styles.projectContainer}>
            {projects.length > 0 ? (
              projects.map((item, index) => {
                return <ProjectItem key={index} item={item} />;
              })
            ) : (
              <EmptyProject />
            )}
          </View>
        </ScrollView>
        <Button onPress={openSheet} />
      </ThemedView>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors.primary, marginBottom: 20 }}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Add New Task
            </ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter your task title..."
                placeholderTextColor="white"
                style={styles.input}
              />

              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={() => {
                    setInputText('');
                    bottomSheetRef.current?.close();
                  }}
                  style={styles.iconButton}
                >
                  <Ionicons name="close-outline" size={25} color="white" />
                </Pressable>

                <Pressable
                  onPress={onAddProject}
                  style={[styles.iconButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                >
                  <Ionicons name="paper-plane-outline" size={25} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  projectContainer: {
    gap: 10,
    marginVertical: 20,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    height: 200,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: Colors.shade,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
    textAlignVertical: 'top',
    backgroundColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 10,
  },
  iconButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: Colors.highlight,
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
