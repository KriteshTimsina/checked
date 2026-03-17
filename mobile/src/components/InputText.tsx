import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import React, { FC } from 'react';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { MAX_INPUT_LENGTH } from '@/constants/constants';

type InputTextProps = {
  onSubmit: VoidFunction;
  onClose: VoidFunction;
  inputText: string;
  setInputText: (text: string) => void;
  inputRef: React.RefObject<TextInput>;
} & TextInputProps;

const InputText: FC<InputTextProps> = ({
  inputRef,
  inputText,
  onClose,
  onSubmit,
  setInputText,
  ...textInputProps
}) => {
  const { primary, card, textMuted, isDark } = useTheme();

  // Input container sits inside a bottom sheet — always use card surface
  const containerBg = isDark ? 'rgba(255,255,255,0.08)' : card;
  const inputColor = isDark ? '#FAFAFA' : '#18181B';
  const placeholderColor = isDark ? 'rgba(255,255,255,0.35)' : textMuted;
  const iconColor = isDark ? '#FAFAFA' : '#18181B';

  const isOverLimit = inputText.trim().length > MAX_INPUT_LENGTH;

  return (
    <View style={[styles.inputContainer, { backgroundColor: containerBg }]}>
      <TextInput
        ref={inputRef}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter your task title..."
        placeholderTextColor={placeholderColor}
        style={[styles.input, { color: inputColor }]}
        {...textInputProps}
      />

      <View style={styles.counter}>
        <ThemedText style={[styles.countText, { color: isOverLimit ? '#ef4444' : textMuted }]}>
          {inputText.trim().length}/{MAX_INPUT_LENGTH}
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable hitSlop={5} onPress={onClose} style={styles.iconButton}>
          <Ionicons name="close-outline" size={25} color={iconColor} />
        </Pressable>

        <Pressable
          onPress={onSubmit}
          style={[styles.iconButton, { opacity: inputText.trim() ? 1 : 0.4 }]}
        >
          {/* Send icon uses primary theme color */}
          <Ionicons name="paper-plane-outline" size={25} color={primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 12,
    padding: 10,
  },
  input: {
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
  counter: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
  countText: {
    fontSize: 12,
  },
});
