import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';
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

export default function Notes() {
  const { notes, getNotes, isLoading } = useNotes();
  const router = useRouter();

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const onAddProject = async () => {
    router.push('/(notes)');
  };
  return (
    <ThemedView style={globals.container}>
      <ThemedText type="subtitle">📒 Your notes</ThemedText>
      <View style={styles.noteContainer}>
        <FlatList
          ListEmptyComponent={<EmptyProject type="notes" />}
          showsVerticalScrollIndicator={false}
          data={notes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <NoteItem item={item} />}
          numColumns={2}
          // refreshing={isLoading}
          refreshControl={
            <RefreshControl colors={[Colors.primary]} onRefresh={getNotes} refreshing={isLoading} />
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={onAddProject} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    gap: 10,
    marginVertical: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 28,
    right: 24,
  },
});
