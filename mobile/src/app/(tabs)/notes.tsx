import { StyleSheet, FlatList, View, RefreshControl, Alert, Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import EmptyProject from '@/components/EmptyProject';
import NoteItem from '@/components/NoteItem';
import { useNotes } from '@/store/notes';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import FAB from '@/components/reuseables/FAB';
import { useNoteSelection } from '@/hooks/useNotesSelection';
import { debounce } from 'lodash';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';
import { INote } from '@/db/schema';
import { useTheme } from '@/hooks/useTheme';
import { SelectionMenu } from '@/components/ui/SelectionMenu';
import { useContextMenu } from '@/components/reuseables/ContextMenu';
import TitledScreen from '@/components/reuseables/TitledScreen';
import SelectionTitleBar from '@/components/ui/notes/SelectionTitleBar';

export default function Notes() {
  const { notes, getNotes, isLoading, createNote, deleteNote } = useNotes();
  const router = useRouter();
  const { textMuted } = useTheme();
  const { isSelecting, isSelected, selectedIds, selectedCount, toggleSelect, clearSelection } =
    useNoteSelection();
  const { visible, open, close } = useContextMenu();

  useEffect(() => {
    getNotes();
  }, []);

  const onAddNote = debounce(async () => {
    const newNote = await createNote({ title: '', content: '' });
    if (!newNote) return toast('Failed to create note');
    router.push({ pathname: '/(notes)', params: { noteId: String(newNote.id) } });
  }, 100);

  const handleLongPress = useCallback(
    (id: number) => {
      haptics.success();
      toggleSelect(id);
    },
    [toggleSelect],
  );

  const handlePress = useCallback(
    (id: number) => {
      if (isSelecting) {
        toggleSelect(id);
      } else {
        router.push({ pathname: '/(notes)', params: { noteId: String(id) } });
      }
    },
    [isSelecting, toggleSelect, router],
  );

  const handleDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    Alert.alert('Confirmation', `This action is irreversible. Do you want to proceed?`, [
      { text: 'Cancel', style: 'cancel', onPress: clearSelection },
      {
        text: 'Proceed',
        style: 'destructive',
        onPress: async () => {
          try {
            await Promise.all([...selectedIds].map(id => deleteNote(id)));
            haptics.success();
            clearSelection();
            toast(`${count} note${count > 1 ? 's' : ''} deleted`);
          } catch {
            haptics.error();
            toast('Failed to delete notes');
          }
        },
      },
    ]);
  }, [selectedIds, deleteNote, clearSelection]);

  const onCloseSelectionMenu = () => {
    clearSelection();
    close();
  };

  const renderItem = useCallback(
    ({ item }: { item: INote }) => (
      <NoteItem
        item={item}
        isSelecting={isSelecting}
        isSelected={isSelected(item.id)}
        onPress={handlePress}
        onLongPress={handleLongPress}
      />
    ),
    [isSelecting, isSelected, handlePress, handleLongPress],
  );

  return (
    <TitledScreen
      title={
        <SelectionTitleBar
          isSelecting={isSelecting}
          selectedCount={selectedCount}
          clearSelection={clearSelection}
        />
      }
    >
      <View style={styles.noteContainer}>
        <FlatList
          ListEmptyComponent={<EmptyProject type="notes" />}
          showsVerticalScrollIndicator={false}
          data={notes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          refreshControl={
            <RefreshControl colors={[Colors.primary]} onRefresh={getNotes} refreshing={isLoading} />
          }
          contentContainerStyle={[
            styles.contentContainer,
            isSelecting && styles.contentContainerSelecting,
          ]}
        />
      </View>

      {isSelecting && (
        <SelectionMenu
          visible={visible}
          onClose={onCloseSelectionMenu}
          selectedCount={selectedCount}
          totalCount={notes.length}
          onDelete={handleDelete}
        />
      )}
      {isSelecting ? (
        Platform.OS === 'android' ? (
          <FAB onPress={handleDelete} icon="trash-outline" style={{ backgroundColor: 'red' }} />
        ) : (
          <FAB onPress={open} icon="ellipsis-horizontal" />
        )
      ) : (
        <FAB onPress={onAddNote} icon="add" />
      )}
    </TitledScreen>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    gap: 10,
    marginVertical: 20,
    flex: 1,
  },
  contentContainer: {
    gap: 10,
    paddingBottom: 20,
    padding: 10,
  },
  contentContainerSelecting: {
    paddingBottom: 140,
  },
  title: {
    paddingHorizontal: 10,
  },
});
