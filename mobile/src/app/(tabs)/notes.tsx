import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';
import React, { useEffect } from 'react';
import EmptyProject from '@/components/EmptyProject';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import NoteItem from '@/components/NoteItem';
import { useNotes } from '@/store/notes';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import FAB from '@/components/reuseables/FAB';
import { debounce } from 'lodash';
import { toast } from '@/utils/toast';

export default function Notes() {
  const { notes, getNotes, isLoading, createNote } = useNotes();
  const router = useRouter();

  useEffect(() => {
    getNotes();
  }, []);

  const onAddProject = debounce(async () => {
    const newNote = await createNote({
      title: '',
      content: '',
    });

    if (!newNote) {
      toast('Failed to create note');
      return;
    }
    const { id } = newNote;
    if (id) {
      router.push({
        pathname: '/(notes)',
        params: { noteId: String(id) },
      });
    }
  }, 100);

  return (
    <ThemedView style={globals.flex}>
      <ThemedText style={styles.title} type="subtitle">
        📒 Your notes
      </ThemedText>
      <View style={styles.noteContainer}>
        <FlatList
          ListEmptyComponent={<EmptyProject type="notes" />}
          showsVerticalScrollIndicator={true}
          data={notes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <NoteItem item={item} />}
          numColumns={2}
          refreshControl={
            <RefreshControl colors={[Colors.primary]} onRefresh={getNotes} refreshing={isLoading} />
          }
          contentContainerStyle={styles.contentContainer}
        />
      </View>

      <FAB onPress={onAddProject} icon="add" />
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

  title: {
    paddingHorizontal: 10,
  },
});
