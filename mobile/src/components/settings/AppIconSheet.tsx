import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import { BottomSheet, ThemedText, BottomSheetModal } from '@/components/ui';
import { HapticButton } from '@/components/layout';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type AppIconSheetProps = {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  iconId: number;
  onSelect: (theme: AppTheme) => void;
};

export const AppIconSheet: React.FC<AppIconSheetProps> = ({ sheetRef, iconId, onSelect }) => {
  const { primarySoft, border, primary } = useTheme();

  const sortedThemes = useMemo(
    () =>
      [...APP_THEMES].sort((a, b) => {
        if (!!a.isNew === !!b.isNew) return 0;
        return a.isNew ? -1 : 1;
      }),
    [],
  );

  return (
    <BottomSheet
      snapPoints={['35%']}
      bottomSheetRef={sheetRef}
      backgroundStyle={{ backgroundColor: primarySoft }}
      handleIndicatorStyle={{ backgroundColor: border }}
      title={
        <View style={styles.header}>
          <Ionicons name="apps-outline" color="#11181B" size={20} />
          <ThemedText type="subtitle" lightColor="#11181B" darkColor="#11181B">
            App Icon
          </ThemedText>
        </View>
      }
    >
      <ThemedText style={styles.description} lightColor="#11181B99" darkColor="#11181B99">
        Choose an icon that matches your theme.
      </ThemedText>

      <BottomSheetScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.iconsRow}
      >
        {sortedThemes.map(theme => {
          const isActive = iconId === theme.id;
          return (
            <HapticButton
              key={theme.id}
              onPress={() => onSelect(theme)}
              style={[
                styles.iconOption,
                {
                  backgroundColor: isActive ? '#11181B' : 'rgba(0,0,0,0.15)',
                  borderColor: isActive ? '#11181B' : 'transparent',
                },
              ]}
            >
              {theme.isNew && (
                <View style={[styles.badge, { backgroundColor: primary }]}>
                  <ThemedText style={styles.badgeLabel}>New</ThemedText>
                </View>
              )}
              <Image source={theme.image!} style={styles.iconImage} resizeMode="cover" />
              <ThemedText style={styles.iconLabel}>{theme.name}</ThemedText>

              {isActive && <View style={styles.activeDot} />}
            </HapticButton>
          );
        })}
      </BottomSheetScrollView>
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
  iconsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  iconOption: {
    width: 84,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    position: 'relative',
  },
  iconImage: {
    width: 56,
    height: 56,
    borderRadius: 14, // iOS icon corner radius
  },
  iconLabel: {
    color: '#fff',
    fontSize: 12,
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
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
