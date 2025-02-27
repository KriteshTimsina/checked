import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FlatList, StyleSheet, TextInput } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { toast } from '@/utils/toast';
import Button from '@/components/Button';
import { haptics } from '@/utils/haptics';
import { useEntries } from '@/store/entries';
import InputText from '@/components/InputText';
import Checklist from '@/components/Checklist';
import BottomSheet from '@/components/BottomSheet';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { ThemedView } from '@/components/ThemedView';
import EmptyProject from '@/components/EmptyProject';
import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { IEntry } from '@/db/schema';

export default function Entry() {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const inputRef = useRef<TextInput>(null);
  const { entries, createEntry, getEntries, isAllCompleted, updateEntry } = useEntries();
  const [editingEntry, setEditingEntry] = useState<IEntry | null>(null);

  useEffect(() => {
    if (isAllCompleted) {
      router.replace({
        pathname: '/(checklist)/success',
        params: { projectId },
      });
    }
  }, [isAllCompleted, projectId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadEntries = async () => {
        if (projectId && isActive) {
          await getEntries(projectId);
        }
      };

      loadEntries();

      return () => {
        isActive = false;
      };
    }, [getEntries, projectId]),
  );

  const handleAddEntry = async () => {
    if (inputText.trim().length > MAX_INPUT_LENGTH * 2) {
      return toast('Task name is too long.');
    }

    // if(editingEntry){

    // }

    try {
      const saveOperation = editingEntry?.id
        ? () => updateEntry(editingEntry, inputText.trim())
        : () =>
            createEntry({
              project_id: Number(projectId),
              title: inputText.trim(),
            });

      const saved = await saveOperation();
      if (saved) {
        haptics.success();
        closeSheet();
        toast('Saved');
        setEditingEntry(null);
      }
    } catch (error) {
      haptics.error();
      console.error(error, 'Error saving note');
      toast('Error saving entry');
    }

    // const entry = await createEntry({
    //   project_id: Number(projectId),
    //   title: inputText.trim(),
    // });

    // if (entry) {
    //   haptics.success();
    //   closeSheet();
    // }
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

  const onEditDialog = (item: IEntry) => {
    bottomSheetRef.current?.expand();
    setEditingEntry(item);
    setInputText(item.title);
  };

  return (
    <>
      <ThemedView style={styles.container}>
        {entries.length === 0 ? (
          <EmptyProject type="checklist" />
        ) : (
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={entries}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <Checklist openEditDialog={onEditDialog} item={item} />}
          />
        )}
        <Button onPress={openSheet} />
      </ThemedView>
      <BottomSheet
        onClose={closeSheet}
        title={editingEntry ? 'Edit Entry' : 'Add new Entry'}
        bottomSheetRef={bottomSheetRef}
      >
        <InputText
          placeholder="Enter your task title..."
          inputRef={inputRef}
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={handleAddEntry}
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
  contentContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    height: 200,
  },
  scrollContainer: {
    gap: 15,
    marginVertical: 15,
    paddingBottom: 20,
  },
});
