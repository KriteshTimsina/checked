import { Keyboard, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import React, { FC, useCallback } from 'react';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetProps as GorhomBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface BottomSheetProps extends Partial<GorhomBottomSheetProps> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  snapPoints?: string[];
  backgroundColor?: string; // optional override, defaults to primary
  bottomSheetRef: React.RefObject<GorhomBottomSheet>;
}

const BottomSheet: FC<BottomSheetProps> = ({
  children,
  title,
  containerStyle,
  titleStyle,
  snapPoints = ['30%'],
  backgroundColor,
  enablePanDownToClose = true,
  index = -1,
  bottomSheetRef,
  ...restProps
}) => {
  const { primary, text, card, primarySoft } = useTheme();

  // Caller can override; otherwise falls back to theme primary
  const sheetBg = backgroundColor ?? primary;

  const renderBackdrop = useCallback(
    (props: any) => (
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
    <GorhomBottomSheet
      index={index}
      enablePanDownToClose={enablePanDownToClose}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={[styles.bottomSheet, { backgroundColor: sheetBg }]}
      handleIndicatorStyle={{ backgroundColor: `${text}40` }}
      backdropComponent={renderBackdrop}
      {...restProps}
    >
      <BottomSheetView style={[styles.container, containerStyle]}>
        {title &&
          (typeof title === 'string' ? (
            <ThemedText
              type="subtitle"
              // title sits on primary-colored background — always use dark text
              lightColor="#11181B"
              darkColor="#11181B"
              style={[styles.sheetTitle, titleStyle]}
            >
              {title}
            </ThemedText>
          ) : (
            title
          ))}
        {children}
      </BottomSheetView>
    </GorhomBottomSheet>
  );
};

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
});

export default BottomSheet;
