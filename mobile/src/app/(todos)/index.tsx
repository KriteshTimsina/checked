import React, { useCallback, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';
import { useEntries } from '@/store/entries';
import { ChecklistItem } from '@/components/todos';
import { ThemedView } from '@/components/layout';
import { EmptyState, BottomSheet, BottomSheetModal, InputText, FAB } from '@/components/ui';
import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { IEntry } from '@/db/schema';
import { globals } from '@/styles/globals';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

export default function Entry() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // const calendarSheetRef = useRef<BottomSheetModal>(null);

  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { entries, createEntry, getEntries, updateEntry, deleteEntry } = useEntries();

  const [editingEntry, setEditingEntry] = useState<IEntry | null>(null);

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const top = Platform.OS === 'android' ? height - insets.bottom - 176 : null;
  // const [dueDate, setDueDate] = useState<string>('');

  // const { primary, textMuted } = useTheme();

  // useEffect(() => {
  //   if (isAllCompleted) {
  //     router.replace({ pathname: '/(todos)/success', params: { projectId } });
  //   }
  // }, [isAllCompleted, projectId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        if (projectId && isActive) await getEntries(projectId);
      };
      load();
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
    bottomSheetRef.current?.dismiss();
  }, []);

  // const openCalendar = useCallback(() => {
  //   calendarSheetRef.current?.present();
  // }, []);

  // const closeCalendar = useCallback(() => {
  //   calendarSheetRef.current?.dismiss();
  // }, []);

  const onEdit = useCallback((item: IEntry) => {
    setEditingEntry(item);
    bottomSheetRef.current?.present();
  }, []);

  const handleSave = useCallback(
    async (title: string) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle.length || trimmedTitle.length > MAX_INPUT_LENGTH) return;
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
    },
    [editingEntry, projectId, createEntry, updateEntry],
  );

  const handleDelete = useCallback(async () => {
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
  }, [editingEntry, deleteEntry, closeSheet]);

  // const handleSelectDate = useCallback((date: string) => {
  //   setDueDate(date);
  // }, []);

  // const clearDueDate = useCallback(() => {
  //   setDueDate('');
  // }, []);

  const HeaderRight = useCallback(
    () =>
      editingEntry ? (
        <Pressable onPress={handleDelete} hitSlop={10}>
          <Ionicons color="red" name="trash-outline" size={18} />
        </Pressable>
      ) : null,
    [editingEntry, handleDelete],
  );

  const renderItem = useCallback(
    ({ item }: { item: IEntry }) => <ChecklistItem item={item} onEdit={onEdit} />,
    [onEdit],
  );

  return (
    <>
      <ThemedView style={globals.flex}>
        <View style={styles.projectContainer}>
          <Animated.FlatList
            contentContainerStyle={styles.contentContainer}
            data={entries}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            itemLayoutAnimation={LinearTransition}
            showsVerticalScrollIndicator
            ListEmptyComponent={<EmptyState type="todoItem" />}
          />
        </View>
      </ThemedView>

      <FAB onPress={openSheet} icon="add" style={{ top }} />
      <BottomSheet
        onClose={closeSheet}
        onDismiss={() => setEditingEntry(null)}
        title={editingEntry ? 'Edit Entry' : 'Add new Entry'}
        headerRight={editingEntry ? HeaderRight : undefined}
        bottomSheetRef={bottomSheetRef}
      >
        <InputText
          key={editingEntry?.id ?? 'new'}
          initialValue={editingEntry?.title ?? ''}
          placeholder={editingEntry ? 'Edit todo...' : 'Enter new todo...'}
          onSubmit={handleSave}
          onClose={closeSheet}
        />

        {/* <Pressable onPress={openCalendar} style={styles.pill}>
          <Ionicons name="calendar-outline" size={18} color={dueDate ? primary : textMuted} />
          <ThemedText style={{ color: dueDate ? primary : textMuted }}>
            {dueDate ? dayjs(dueDate).format('MMM D') : 'Due date'}
          </ThemedText>
          {dueDate && (
            <Pressable hitSlop={6} onPress={clearDueDate}>
              <Ionicons name="close-circle" size={14} color={primary} />
            </Pressable>
          )}
        </Pressable> */}
      </BottomSheet>

      {/* <CalendarSheet
        sheetRef={calendarSheetRef}
        onClose={closeCalendar}
        onSelectDate={handleSelectDate}
        selectedDate={dueDate}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  projectContainer: {
    gap: 10,
    marginVertical: 20,
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    gap: 10,
    paddingBottom: 90,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: Colors.blackAccent,
  },
});
