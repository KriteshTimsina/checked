import { Pressable, StyleSheet, View, TextInput, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Button from '@/components/Button';
import EmptyProject from '@/components/EmptyProject';
import { useEntries } from '@/store/entries';
import Checklist from '@/components/Checklist';
import { haptics } from '@/utils/haptics';

const Entries = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const inputRef = useRef<TextInput>(null);
  const { entries, createEntry, getEntries } = useEntries();

  console.log(entries, 'HHHH');

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

  // const resetProject = async () => {
  //   const data = await db
  //     .update(entrySchema)
  //     .set({ completed: false })
  //     .where(eq(entrySchema.project_id, Number(projectId)))
  //     .returning({
  //       id: entrySchema.id,
  //       title: entrySchema.title,
  //       completed: entrySchema.completed,
  //       createdAt: entrySchema.createdAt,
  //       project_id: entrySchema.project_id,
  //     });

  //   console.log(data, 'HHU');

  //   if (data) {
  //     // setEntries(data);
  //     setAllCompleted(false);
  //   }
  // };

  const handleAddEntry = async () => {
    if (inputText.trim()) {
      const entry = await createEntry({
        project_id: Number(projectId),
        title: inputText,
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
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                multiline
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter your task title..."
                placeholderTextColor="white"
                style={[
                  styles.input,
                  {
                    height: 40,
                    textAlignVertical: 'top',
                  },
                ]}
              />

              <View style={styles.buttonContainer}>
                <Pressable onPress={closeSheet} style={styles.iconButton}>
                  <Ionicons name="close-outline" size={25} color="white" />
                </Pressable>

                <Pressable
                  onPress={handleAddEntry}
                  style={[styles.iconButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                >
                  <Ionicons name="paper-plane-outline" size={25} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default Entries;

const Success = ({ close }: any) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.primary,
        flex: 1,
        zIndex: 10,
        top: -20,
        padding: 20,
        alignItems: 'center',
        paddingTop: 50,
        gap: 20,
        justifyContent: 'center',
      }}
    >
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      <Animated.Image
        entering={FadeInDown.delay(300)}
        source={require('@/assets/images/success.png')}
        style={{ width: 100, height: 100 }}
      />
      <Animated.Text entering={FadeInDown.delay(400)} style={{ fontSize: 16 }}>
        All tasks completed
      </Animated.Text>
      <Pressable
        onPress={close}
        style={{
          backgroundColor: Colors.dark.background,
          borderRadius: 10,
          height: 40,
          justifyContent: 'center',
          marginTop: 20,
          width: '40%',
        }}
      >
        <ThemedText style={{ textAlign: 'center' }}>Reset checklist</ThemedText>
      </Pressable>
    </View>
  );
};
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
  inputContainer: {
    backgroundColor: Colors.dark.shade,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 10,
  },
  iconButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: Colors.highlight,
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
