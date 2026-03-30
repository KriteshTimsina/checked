import { StyleSheet, FlatList, View, RefreshControl, Platform } from 'react-native';
import React, { useEffect } from 'react';
import EmptyProject from '@/components/EmptyProject';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import Button from '@/components/Button';
import NoteItem from '@/components/NoteItem';
import { useNotes } from '@/store/notes';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import FAB from '@/components/reuseables/FAB';

export default function Notes() {
  const { notes, getNotes, isLoading } = useNotes();
  const router = useRouter();

  useEffect(() => {
    getNotes();
  }, []);

  const onAddProject = async () => {
    router.push('/(notes)');
  };
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
