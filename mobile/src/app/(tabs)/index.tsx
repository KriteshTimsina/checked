import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, RefreshControl, StyleSheet, View } from 'react-native';

import EmptyProject from '@/components/EmptyProject';
import { BottomSheet } from '@/components/reuseables';
import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { useProject } from '@/store/projects';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';

import Checklist from '@/components/Checklist';
import InputText from '@/components/InputText';
import FAB from '@/components/reuseables/FAB';
import TitledScreen from '@/components/reuseables/TitledScreen';
import { useTheme } from '@/hooks/useTheme';
import { debounce } from 'lodash';

export default function Home() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const { projects, getAllProjects, createProject } = useProject();

  const { primary } = useTheme();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    getAllProjects();
    setLoading(false);
  };

  const onAddProject = debounce(async (title: string) => {
    if (title.trim().length === 0) return toast('Tasks cannot be empty.');
    if (title.trim().length > MAX_INPUT_LENGTH) return toast('Task title is too long.');

    const created = await createProject({
      title: title.trim(),
      description: 'Testing',
      createdAt: new Date(),
    });
    if (created) {
      haptics.success();
    }
  }, 300);

  const openSheet = () => {
    bottomSheetRef.current?.present();
  };

  const closeSheet = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.dismiss();
  };

  return (
    <>
      <TitledScreen title="✅ Your Tasks">
        <View style={styles.projectContainer}>
          {projects.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl colors={[primary]} refreshing={loading} onRefresh={fetchProjects} />
              }
              data={projects}
              keyExtractor={item => String(item.id)}
              renderItem={({ item, index }) => <Checklist item={item} index={index} />}
              contentContainerStyle={styles.contentContainer}
            />
          ) : (
            <EmptyProject type="todos" />
          )}
        </View>
      </TitledScreen>

      <FAB onPress={openSheet} icon="add" />

      <BottomSheet onClose={closeSheet} title="Add new task" bottomSheetRef={bottomSheetRef}>
        <InputText
          placeholder="Enter your project title..."
          onClose={closeSheet}
          onSubmit={onAddProject}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  projectContainer: {
    gap: 10,
    marginVertical: 20,
    flex: 1,
  },
  contentContainer: {
    gap: 10,
    paddingBottom: 20,
    padding: 10,
  },
  title: {
    paddingHorizontal: 10,
  },
});
