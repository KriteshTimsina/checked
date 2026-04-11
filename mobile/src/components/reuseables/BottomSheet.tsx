import { Platform, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import React, { useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal,
  BottomSheetProps as GorhomBottomSheetProps,
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { ThemedText } from '../ThemedText';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/reuseables/Button';
import { haptics } from '@/utils/haptics';

interface BottomSheetProps extends Partial<BottomSheetModalProps> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  snapPoints?: string[];
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onClose?: VoidFunction;
  headerLeft?: React.FC | null;
  headerRight?: React.FC | null;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  title,
  children,
  titleStyle,
  containerStyle,
  snapPoints = Platform.OS === 'android' ? ['40%'] : ['25%'],
  onClose,
  headerLeft: HeaderLeft,
  headerRight: HeaderRight,
  ...props
}) => {
  const { border, text } = useTheme();

  const handleClose = () => {
    haptics.medium();
    onClose?.();
  };

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        onPress={handleClose}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...backdropProps}
      />
    ),
    [],
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
        <View style={styles.header}>
          {HeaderLeft && <View style={styles.side}>{<HeaderLeft />}</View>}
          {typeof title === 'string' ? (
            <ThemedText style={[styles.title, titleStyle]} type="subtitle" numberOfLines={1}>
              {title}
            </ThemedText>
          ) : (
            title
          )}
          {HeaderRight && <View style={styles.side}>{<HeaderRight />}</View>}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
