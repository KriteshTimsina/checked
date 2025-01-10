import {
  Pressable,
  StyleSheet,
  View,
  Button,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Header } from '@/components/Header';
import { data } from '@/constants/data';
import { Colors } from '@/constants/Colors';
import Checkbox, { CheckboxEvent } from 'expo-checkbox';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDb } from '@/db/useDb';
import { eq } from 'drizzle-orm';
import { entries as entrySchema } from '@/db/schema';

const Project = () => {
  const navigation = useNavigation();
  const [allCompleted, setAllCompleted] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const params = useLocalSearchParams();
  const [entries, setEntries] = useState<any>([]);
  const db = useDb();

  useEffect(() => {
    const load = async () => {
      if (params) {
        const data = await db.query.entries.findMany({
          where: eq(entrySchema.project_id, Number(params.id)),
        });
        setEntries(data);
      }
    };
    load();
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const close = () => setAllCompleted(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params.title,
    });
  }, [navigation]);

  const handleAddTask = async () => {
    if (inputText.trim()) {
      // Add your task logic here
      const entry = await db
        .insert(entrySchema)
        .values({ project_id: Number(params.id), title: inputText, status: 0 })
        .then(success => {
          if (success.changes === 1) {
            const newEntry = db.query.entries
              .findFirst({
                where: eq(entrySchema.id, Number(success.lastInsertRowId)),
              })
              .then(data => {
                setEntries(prev => [...prev, data]);
              });
          }
        });

      setInputText('');
      bottomSheetRef.current?.close();
    }
  };
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1, padding: 20 }}>
          {allCompleted && <Success close={close} />}
          <ScrollView
            contentContainerStyle={{
              gap: 20,
            }}
            style={{ flex: 1 }}
          >
            {entries.map(item => {
              return <CheckList key={item.id} item={item} />;
            })}
          </ScrollView>

          <Pressable
            onPress={() => bottomSheetRef.current?.expand()}
            style={{
              backgroundColor: Colors.highlight,
              height: 50,
              width: 50,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: '5%',
              right: '5%',
            }}
          >
            <AntDesign name="plus" size={35} color="white" />
          </Pressable>

          {/* <Button title="TEST" onPress={() => setAllCompleted(true)} /> */}
        </ThemedView>
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
                  multiline
                  value={inputText}
                  onChangeText={setInputText}
                  autoFocus
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
                  <Pressable
                    onPress={() => {
                      setInputText('');
                      bottomSheetRef.current?.close();
                    }}
                    style={styles.iconButton}
                  >
                    <Ionicons name="close-outline" size={25} color="white" />
                  </Pressable>

                  <Pressable
                    onPress={handleAddTask}
                    style={[styles.iconButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                  >
                    <Ionicons name="paper-plane-outline" size={25} color="white" />
                  </Pressable>
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
};

export default Project;

const CheckList = ({ item }: any) => {
  const checkedRef = useRef<CheckboxEvent | null>(null);
  const [checked, setChecked] = useState(item.completed);

  const toggleCheckbox = () => {
    setChecked(!checked);
    checkedRef.current?.value === checked ? true : false;
  };

  return (
    <Pressable
      onPress={toggleCheckbox}
      android_ripple={{ color: Colors.light.icon }}
      ref={checkedRef}
      style={{
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: Colors.shade,
        borderRadius: 10,
        minHeight: 50,
        padding: 5,
      }}
    >
      <Checkbox
        style={{ borderRadius: 100, width: 25, height: 25, padding: 5 }}
        color={Colors.highlight}
        value={checked}
        onValueChange={toggleCheckbox}
      />
      <ThemedText
        style={{
          textDecorationLine: checked ? 'line-through' : 'none',
        }}
      >
        {item.title}
      </ThemedText>
    </Pressable>
  );
};

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
      <Button onPress={close} title="Reset all tasks" color={Colors.highlight} />
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
  sheetTitle: {
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: Colors.shade,
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
