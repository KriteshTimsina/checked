import { FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EmptyProject from '@/components/EmptyProject';
import ProjectItem from '@/components/ProjectItem';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import { useProject } from '@/store/projects';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';

import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { Colors } from '@/constants/Colors';
import { globals } from '@/styles/globals';

export default function Home() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const { projects, getAllProjects, createProject } = useProject();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    getAllProjects();
    setLoading(false);
  };

  const onAddProject = async () => {
    if (inputText.trim().length > MAX_INPUT_LENGTH) {
      return toast('Project name is too long.');
    }

    const created = await createProject({
      title: inputText.trim(),
      description: 'Testing',
      createdAt: new Date(),
    });

    if (created) {
      haptics.success();
      closeSheet();
    }
  };

  const openSheet = () => {
    bottomSheetRef.current?.expand();
    inputRef.current?.focus();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
    inputRef.current?.blur();
    setInputText('');
  };
  return (
    <>
      <Pressable onPress={closeSheet} style={globals.flex}>
        <ThemedView style={{ ...globals.flex, ...styles.container }}>
          <ThemedText type="subtitle">Projects</ThemedText>
          <View style={styles.projectContainer}>
            {projects.length > 0 ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    colors={[Colors.primary]}
                    refreshing={loading}
                    onRefresh={fetchProjects}
                  ></RefreshControl>
                }
                data={projects}
                keyExtractor={item => String(item.id)}
                renderItem={({ item, index }) => <ProjectItem item={item} index={index} />}
                contentContainerStyle={styles.contentContainer}
              />
            ) : (
              <EmptyProject />
            )}
          </View>
          <Button onPress={openSheet} />
        </ThemedView>
      </Pressable>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors.primary, marginBottom: 20 }}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.inputContainer}>
          <View style={styles.inputContainer}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Add New Project
            </ThemedText>
            <InputText
              placeholder="Enter your project title..."
              inputRef={inputRef}
              inputText={inputText}
              setInputText={setInputText}
              onClose={closeSheet}
              onSubmit={onAddProject}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  projectContainer: {
    gap: 10,
    marginVertical: 20,
  },
  contentContainer: {
    gap: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    height: 200,
  },
  sheetTitle: {
    textAlign: 'center',
  },
});
