import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import React, { FC } from 'react';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { MAX_INPUT_LENGTH } from '@/constants/constants';

type InputTextProps = {
  onSubmit: VoidFunction;
  onClose: VoidFunction;
  inputText: string;
  setInputText: (text: string) => void;
  inputRef: React.RefObject<TextInput>;
} & TextInputProps;

const ENTRY_MAX_INPUT_LENGTH = MAX_INPUT_LENGTH * 2;

const InputText: FC<InputTextProps> = ({
  inputRef,
  inputText,
  onClose,
  onSubmit,
  setInputText,
  ...textInputProps
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter your task title..."
        placeholderTextColor="white"
        style={styles.input}
        {...textInputProps}
      />

      <View style={styles.counter}>
        <ThemedText
          lightColor={Colors.dark.text}
          style={[
            styles.countText,
            inputText.trim().length > ENTRY_MAX_INPUT_LENGTH && styles.error,
          ]}
        >
          {inputText.trim().length}/{ENTRY_MAX_INPUT_LENGTH}
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable hitSlop={5} onPress={onClose} style={styles.iconButton}>
          <Ionicons name="close-outline" size={25} color="white" />
        </Pressable>

        <Pressable
          onPress={onSubmit}
          style={[styles.iconButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
        >
          <Ionicons name="paper-plane-outline" size={25} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
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
    height: 40,
    textAlignVertical: 'top',
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
  counter: { position: 'absolute', right: 10, top: 0 },
  countText: {
    fontSize: 12,
  },
  error: {
    color: 'red',
  },
});
