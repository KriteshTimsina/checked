import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

import { toast } from '@/utils/toast';
import Button from '@/components/Button';
import { haptics } from '@/utils/haptics';
import { useEntries } from '@/store/entries';
import InputText from '@/components/InputText';
import ChecklistItem from '@/components/ChecklistItem';
import BottomSheet from '@/components/reuseables/BottomSheet';
import { ThemedView } from '@/components/ThemedView';
import EmptyProject from '@/components/EmptyProject';
import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { IEntry } from '@/db/schema';
import { globals } from '@/styles/globals';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Entry() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { entries, createEntry, getEntries, isAllCompleted, updateEntry, deleteEntry } =
    useEntries();
  const [editingEntry, setEditingEntry] = useState<IEntry | null>(null);

  useEffect(() => {
    if (isAllCompleted) {
      router.replace({ pathname: '/(todos)/success', params: { projectId } });
    }
  }, [isAllCompleted, projectId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadEntries = async () => {
        if (projectId && isActive) await getEntries(projectId);
      };
      loadEntries();
      return () => {
        isActive = false;
      };
    }, [getEntries, projectId]),
  );

  const openSheet = useCallback(() => {
    setEditingEntry(null);
    bottomSheetRef.current?.present();
  }, []);

  const closeSheet = useCallback(() => {
    Keyboard.dismiss();
    setEditingEntry(null);
    bottomSheetRef.current?.dismiss();
  }, []);

  const onEdit = useCallback((item: IEntry) => {
    setEditingEntry(item);
    bottomSheetRef.current?.present();
  }, []);

  const handleSave = async (title: string) => {
    if (title.trim().length > MAX_INPUT_LENGTH * 2) return toast('Task name is too long.');
    try {
      const saved = await (editingEntry?.id
        ? updateEntry(editingEntry, title.trim())
        : createEntry({ project_id: Number(projectId), title: title.trim() }));
      if (saved) {
        haptics.success();
        toast('Saved', 'top');
      }
    } catch {
      haptics.error();
      toast('Error saving entry');
    }
  };

  const handleDelete = async () => {
    if (!editingEntry?.id) return;
    try {
      const deleted = await deleteEntry(editingEntry.id);
      if (deleted) {
        haptics.success();
        closeSheet();
        toast('Deleted', 'top');
      }
    } catch {
      haptics.error();
      toast('Error deleting entry');
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: IEntry }) => <ChecklistItem item={item} onEdit={onEdit} />,
    [onEdit],
  );

  return (
    <>
      <ThemedView style={globals.container}>
        <View style={styles.projectContainer}>
          {entries.length > 0 ? (
            <FlatList
              contentContainerStyle={styles.contentContainer}
              data={entries}
              keyExtractor={item => String(item.id)}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyProject type="todos" />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={openSheet} />
        </View>
      </ThemedView>

      <BottomSheet
        onClose={closeSheet}
        title={editingEntry ? 'Edit Entry' : 'Add new Entry'}
        headerRight={
          editingEntry
            ? () => (
                <Pressable onPress={editingEntry ? handleDelete : null}>
                  <MaterialCommunityIcons color="red" name="delete-outline" size={24} />
                </Pressable>
              )
            : null
        }
        bottomSheetRef={bottomSheetRef}
      >
        <InputText
          key={editingEntry?.id ?? 'new'}
          initialValue={editingEntry?.title ?? ''}
          placeholder={editingEntry ? 'Edit task...' : 'Enter new todo...'}
          onSubmit={handleSave}
          onClose={closeSheet}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  contentContainer: {
    gap: 10,
    paddingBottom: 20,
  },
  projectContainer: {
    gap: 10,
    marginVertical: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
