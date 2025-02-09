import { FlatList, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import GorhomBottomSheet from '@gorhom/bottom-sheet';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EmptyProject from '@/components/EmptyProject';
import BottomSheet from '@/components/BottomSheet';
import ProjectItem from '@/components/ProjectItem';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import { useProject } from '@/store/projects';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';

import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { Colors } from '@/constants/Colors';

export default function Home() {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
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
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Checklists</ThemedText>
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

      <BottomSheet bottomSheetRef={bottomSheetRef} title="Add New Project">
        <InputText
          placeholder="Enter your project title..."
          inputRef={inputRef}
          inputText={inputText}
          setInputText={setInputText}
          onClose={closeSheet}
          onSubmit={onAddProject}
        />
      </BottomSheet>
    </>
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
    gap: 10,
    paddingBottom: 20,
  },
});
