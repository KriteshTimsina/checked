import { StyleSheet, FlatList, View, RefreshControl, Alert, Pressable } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import EmptyProject from '@/components/EmptyProject';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import NoteItem from '@/components/NoteItem';
import { useNotes } from '@/store/notes';
import { ThemedText } from '@/components/ThemedText';
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

export default function Notes() {
  const { notes, getNotes, isLoading, createNote, deleteNote, updateNote } = useNotes();
  const router = useRouter();
  const { primary, textMuted } = useTheme();
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

  const handlePin = useCallback(async () => {
    if (selectedIds.size === 0) return;
    try {
      await Promise.all([...selectedIds].map(id => updateNote(id, { pinned: true })));
      haptics.success();
      const count = selectedIds.size;
      clearSelection();
      toast(`${count} note${count > 1 ? 's' : ''} pinned`);
    } catch {
      haptics.error();
      toast('Failed to pin notes');
    }
  }, [selectedIds, updateNote, clearSelection]);

  const handleDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    Alert.alert('Delete Notes', `This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
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
    <ThemedView style={globals.flex}>
      <View style={styles.titleBar}>
        <ThemedText type="title">
          {selectedCount ? `${selectedCount} Selected` : ' 📒 Your notes'}
        </ThemedText>

        {isSelecting && (
          <Pressable onPress={clearSelection} hitSlop={12}>
            <ThemedText style={[styles.cancelText, { color: primary }]}>Cancel</ThemedText>
          </Pressable>
        )}
      </View>

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
            // extra bottom padding so last row isn't hidden behind SelectionBar
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
          onPin={handlePin}
          onDelete={handleDelete}
        />
      )}
      {isSelecting ? (
        <FAB
          onPress={() => {
            console.log('OPEN');
            open();
          }}
          icon="ellipsis-horizontal"
          style={{ backgroundColor: textMuted }}
        />
      ) : (
        <FAB onPress={onAddNote} icon="add" />
      )}
    </ThemedView>
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
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  titleBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
