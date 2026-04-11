import { StyleSheet, TextInputProps, View } from 'react-native';
import React, { FC, useState } from 'react';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { MAX_INPUT_LENGTH } from '@/constants/constants';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Button from '@/components/reuseables/Button';

type InputTextProps = {
  onSubmit: (text: string) => void;
  onClose: VoidFunction;
  initialValue?: string;
} & Omit<TextInputProps, 'onSubmit'>;

const InputText: FC<InputTextProps> = ({
  onClose,
  onSubmit,
  initialValue = '',
  ...textInputProps
}) => {
  const [inputText, setInputText] = useState(initialValue);

  const { primary, card, textMuted, isDark } = useTheme();

  const containerBg = isDark ? 'rgba(255,255,255,0.08)' : card;
  const inputColor = isDark ? '#FAFAFA' : '#18181B';
  const placeholderColor = isDark ? 'rgba(255,255,255,0.35)' : textMuted;
  const iconColor = isDark ? '#FAFAFA' : '#18181B';
  const isOverLimit = inputText.trim().length > MAX_INPUT_LENGTH;

  const disabledInput = isOverLimit || !inputText.trim();

  const handleSubmit = () => {
    onSubmit(inputText);
    setInputText('');
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: containerBg }]}>
      <BottomSheetTextInput
        value={inputText}
        onChangeText={setInputText}
        placeholderTextColor={placeholderColor}
        style={[styles.input, { color: inputColor }]}
        autoFocus
        {...textInputProps}
      />

      <View style={styles.counter}>
        <ThemedText style={[styles.countText, { color: isOverLimit ? '#ef4444' : textMuted }]}>
          {inputText.trim().length}/{MAX_INPUT_LENGTH}
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <Button hitSlop={5} onPress={onClose} style={styles.iconButton}>
          <Ionicons name="close-outline" size={25} color={iconColor} />
        </Button>
        <Button
          disabled={disabledInput}
          onPress={handleSubmit}
          style={[styles.iconButton, { opacity: disabledInput ? 0.4 : 1 }]}
        >
          <Ionicons name="paper-plane-outline" size={25} color={primary} />
        </Button>
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
    fontFamily: 'ClashGroteskMedium',
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
