import { Keyboard, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import React, { FC, useCallback } from 'react';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetProps as GorhomBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';

interface BottomSheetProps extends Partial<GorhomBottomSheetProps> {
  title?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  snapPoints?: string[];
  backgroundColor?: string;
  bottomSheetRef: React.RefObject<GorhomBottomSheet>;
}

const BottomSheet: FC<BottomSheetProps> = ({
  children,
  title,
  containerStyle,
  titleStyle,
  snapPoints = ['30%'],
  backgroundColor = Colors.primary,
  enablePanDownToClose = true,
  index = -1,
  bottomSheetRef,
  ...restProps
}) => {
  const containerStyles = [styles.inputContainer, containerStyle];
  const titleStyles = [styles.sheetTitle, titleStyle];
  const backgroundStyle = {
    ...styles.bottomSheet,
    backgroundColor,
  };

  const renderBackdrop = useCallback((props: any) => {
    const onPress = () => Keyboard.dismiss();
    return (
      <BottomSheetBackdrop onPress={onPress} appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
    );
  }, []);

  return (
    <GorhomBottomSheet
      index={index}
      enablePanDownToClose={enablePanDownToClose}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={backgroundStyle}
      backdropComponent={renderBackdrop}
      {...restProps}
    >
      <BottomSheetView style={containerStyles}>
        <View style={containerStyles}>
          {title && (
            <ThemedText type="subtitle" lightColor={Colors.dark.text} style={titleStyles}>
              {title}
            </ThemedText>
          )}
          {children}
        </View>
      </BottomSheetView>
    </GorhomBottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.primary,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
  },
  sheetTitle: {
    textAlign: 'center',
  },
});

export default BottomSheet;
