import { TextInput, Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import { Colors } from '@/constants/Colors';
import PagerView from 'react-native-pager-view';
import { ThemedText } from '@/components/ThemedText';
import { notes } from '@/app/(tabs)/notes';

const contentHeight = Dimensions.get('screen').height / 2;

export default function Index() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  console.log(noteId);
  const note = notes.find(note => note.id === Number(noteId));
  return (
    <ThemedView style={[globals.container, { paddingTop: 0 }]}>
      <TextInput
        autoFocus
        placeholder="Your title here"
        // onChangeText={text => onChange('title', text)}
        style={styles.title}
        value={note?.title}
      />
      <TextInput
        placeholder="Your song here"
        // onChangeText={text => onChange('content', text)}
        multiline
        style={styles.content}
        value={note?.content}
      />

      {/* <View style={styles.recordings}>
          {recordedUri && (
            <Recording
              onStartPlay={onStartPlay}
              onStopPlay={onStopPlay}
              isPlaying={isPlaying}
              duration={duration}
              playTime={playTime}
              records={recordedUri}
            />
          )}
        </View> */}

      {/* {isKeyboardVisible && (
        <NoteControls
          isRecording={isRecording}
          onStopRecord={onStopRecord}
          onStartRecord={onStartRecord}
          saveNote={saveNote}
        />
      )} */}

      {/* <Portal>
        <Modal
          visible={themeModalVisible}
          onDismiss={closeThemeModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text>Choose color background</Text>
          <View style={styles.colors}>
            {backgrounds.map(background => {
              return (
                <TouchableOpacity
                  onPress={() => onChangeTheme(background)}
                  key={background}
                  style={[styles.colorContainer, { backgroundColor: background }]}
                />
              );
            })}
          </View>
        </Modal>
      </Portal> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    fontSize: 18,
    flex: 1,
    textAlignVertical: 'top',
    minHeight: contentHeight,
    color: Colors.dark.icon,
  },
  recordings: {
    gap: 10,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
