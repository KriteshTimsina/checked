import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import React, { useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal,
  BottomSheetProps as GorhomBottomSheetProps,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface BottomSheetProps extends Partial<GorhomBottomSheetProps> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  snapPoints?: string[];
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onClose?: VoidFunction;
  onDelete?: VoidFunction; // ✅ optional delete action for edit mode
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  title,
  children,
  titleStyle,
  containerStyle,
  snapPoints = ['25%'],
  onClose,
  onDelete,
  ...props
}) => {
  const { border, text } = useTheme();

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        onPress={onClose}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...backdropProps}
      />
    ),
    [onClose],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: text }}
      handleStyle={styles.handleStyle}
      backgroundStyle={{ backgroundColor: border }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableBlurKeyboardOnGesture={true}
      {...props}
    >
      <BottomSheetView style={[styles.container, containerStyle]}>
        {title && (
          <View style={styles.titleRow}>
            {/* ✅ spacer so title stays centered when delete icon is present */}
            <View style={styles.titleSide} />

            {typeof title === 'string' ? (
              <ThemedText type="subtitle" style={[styles.sheetTitle, titleStyle]}>
                {title}
              </ThemedText>
            ) : (
              title
            )}

            <View style={styles.titleSide}>
              {onDelete && (
                <Pressable onPress={onDelete} hitSlop={10}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </Pressable>
              )}
            </View>
          </View>
        )}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  handleStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSide: {
    width: 32, // ✅ equal width both sides keeps title centered
    alignItems: 'flex-end',
  },
  sheetTitle: {
    textAlign: 'center',
    flex: 1,
  },
});
