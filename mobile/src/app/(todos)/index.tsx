import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet } from 'react-native';
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
      <ThemedView style={styles.container}>
        {entries.length === 0 ? (
          <EmptyProject type="todoItem" />
        ) : (
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={entries}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
        <Button onPress={openSheet} />
      </ThemedView>

      <BottomSheet
        onClose={closeSheet}
        title={editingEntry ? 'Edit Entry' : 'Add new Entry'}
        onDelete={editingEntry ? handleDelete : undefined}
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
  },
  scrollContainer: {
    gap: 15,
    marginVertical: 15,
    paddingBottom: 20,
  },
});
