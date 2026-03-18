import { Keyboard, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React, { useCallback } from 'react';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal,
  BottomSheetProps as GorhomBottomSheetProps,
  BottomSheetModalProvider,
  BottomSheetModalProps,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface BottomSheetProps extends Partial<GorhomBottomSheetProps> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  snapPoints?: string[];
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  title,
  children,
  titleStyle,
  containerStyle,
  snapPoints = ['25%'],
  ...props
}) => {
  const { border, text } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        onPress={() => Keyboard.dismiss()}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );
  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      enableDynamicSizing={false}
      handleIndicatorStyle={{ backgroundColor: text }}
      handleStyle={[{ backgroundColor: border }, styles.handleStyle]}
      backgroundStyle={{ backgroundColor: border }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      {...props}
    >
      <BottomSheetView style={[styles.container, containerStyle]}>
        {title &&
          (typeof title === 'string' ? (
            <ThemedText type="subtitle" style={[styles.sheetTitle, titleStyle]}>
              {title}
            </ThemedText>
          ) : (
            title
          ))}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  handleStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'red',
  },
});
