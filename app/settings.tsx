import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '@/constants/data';

const settings = () => {
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={closeSheet}>
        <ThemedView style={{ flex: 1, padding: 20 }}>
          <ThemedText type="subtitle">Settings</ThemedText>

          <View style={{ marginVertical: 20 }}>
            <Pressable
              onPress={openSheet}
              style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}
            >
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="color-palette" color={Colors.primary} size={24} />
                <ThemedText>Select Theme</ThemedText>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  backgroundColor: Colors.primary,
                }}
              />
            </Pressable>
          </View>
        </ThemedView>
      </Pressable>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors.primary, marginBottom: 20 }}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <Ionicons name="color-palette" size={30} />
            <ThemedText darkColor={Colors.light.text} type="subtitle">
              Select Theme
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              {colors.map(color => {
                return (
                  <View
                    key={color.id}
                    style={[
                      styles.color,
                      color.selected ? styles.selected : null,
                      { backgroundColor: color.primary },
                    ]}
                  >
                    {color.selected && <Ionicons size={20} name="checkmark-outline" />}
                  </View>
                );
              })}
            </View>
            <Pressable
              style={{
                backgroundColor: Colors.dark.background,
                borderRadius: 10,
                height: 40,
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <ThemedText style={{ textAlign: 'center' }}>Apply</ThemedText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default settings;

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    height: 60,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
    height: 200,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 1,
    borderColor: Colors.dark.tabIconDefault,
  },
});
