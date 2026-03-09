import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { type Tab } from '@/store/preferences';
import { tabs } from '@/constants/data';

type DefaultTabSheetProps = {
  sheetRef: React.RefObject<BottomSheet>;
  primaryTab: Tab;
  onSelect: (label: Tab) => void;
  renderBackdrop: (props: any) => React.ReactElement;
};

export const DefaultTabSheet: React.FC<DefaultTabSheetProps> = ({
  sheetRef,
  primaryTab,
  onSelect,
  renderBackdrop,
}) => {
  const { primary, primarySoft, text, textMuted } = useTheme();

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['32%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: primary }}
      handleIndicatorStyle={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="home" color="#11181B" size={20} />
          <ThemedText type="subtitle" lightColor="#11181B" darkColor="#11181B">
            Default Tab
          </ThemedText>
        </View>
        <ThemedText style={styles.description} lightColor="#11181B99" darkColor="#11181B99">
          This is where your app opens to.
        </ThemedText>
        <View style={styles.tabsRow}>
          {tabs.map(tab => {
            const isActive = primaryTab === tab.label;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.75}
                onPress={() => onSelect(tab.label as Tab)}
                style={[
                  styles.tabOption,
                  {
                    backgroundColor: isActive ? '#11181B' : 'rgba(0,0,0,0.15)',
                    borderColor: isActive ? '#11181B' : 'transparent',
                  },
                ]}
              >
                {tab.label === 'index' ? (
                  <Ionicons color="white" size={24} name="checkbox-outline" />
                ) : (
                  <FontAwesome color="white" size={22} name="sticky-note-o" />
                )}
                <ThemedText style={styles.tabLabel}>{tab.title}</ThemedText>
                {isActive && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  description: {
    fontSize: 13,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  tabOption: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    position: 'relative',
  },
  tabLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
});
