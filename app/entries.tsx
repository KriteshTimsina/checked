import { Pressable, StyleSheet, View, TextInput, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import EmptyProject from '@/components/EmptyProject';
import InputText from '@/components/InputText';
import Checklist from '@/components/Checklist';
import Button from '@/components/Button';
import { useEntries } from '@/store/entries';
import { haptics } from '@/utils/haptics';

import { Colors } from '@/constants/Colors';

const Entries = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const inputRef = useRef<TextInput>(null);
  const { entries, createEntry, getEntries, isAllCompleted } = useEntries();

  useEffect(() => {
    if (isAllCompleted) {
      router.replace({
        pathname: '/success',
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

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleAddEntry = async () => {
    if (inputText.trim()) {
      const entry = await createEntry({
        project_id: Number(projectId),
        title: inputText.trim(),
      });
      if (entry) {
        haptics.success();
        closeSheet();
      }
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
      <Pressable onPress={closeSheet} style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1, padding: 20 }}>
          {entries.length === 0 ? (
            <EmptyProject type="checklist" />
          ) : (
            <FlatList
              contentContainerStyle={styles.scrollContainer}
              data={entries}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => <Checklist item={item} />}
            />
          )}
          <Button onPress={openSheet} />
        </ThemedView>
      </Pressable>
      <BottomSheet
        index={-1}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors.primary, marginBottom: 20 }}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Add New Task
            </ThemedText>
            <InputText
              placeholder="Enter your task title..."
              inputRef={inputRef}
              inputText={inputText}
              setInputText={setInputText}
              onSubmit={handleAddEntry}
              onClose={closeSheet}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default Entries;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    height: 200,
  },
  scrollContainer: {
    gap: 15,
    marginVertical: 15,
  },
  sheetTitle: {
    textAlign: 'center',
  },
});
