import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import { BottomSheet, ThemedText, BottomSheetModal } from '@/components/ui';
import { HapticButton } from '@/components/layout';

type AppIconSheetProps = {
  sheetRef: React.RefObject<BottomSheetModal>;
  iconId: number;
  onSelect: (theme: AppTheme) => void;
};

export const AppIconSheet: React.FC<AppIconSheetProps> = ({ sheetRef, iconId, onSelect }) => {
  const { primarySoft, border } = useTheme();

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

      <View style={styles.iconsRow}>
        {APP_THEMES.map(theme => {
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
              <Image source={theme.image!} style={styles.iconImage} resizeMode="cover" />
              <ThemedText style={styles.iconLabel}>{theme.name}</ThemedText>

              {isActive && <View style={styles.activeDot} />}
            </HapticButton>
          );
        })}
      </View>
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
  },
  iconOption: {
    flex: 1,
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
});
