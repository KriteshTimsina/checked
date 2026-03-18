import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import { BottomSheet } from '@/components/reuseables';

type ThemeSheetProps = {
  sheetRef: React.RefObject<BottomSheetModal>;
  themeId: number;
  onSelect: (theme: AppTheme) => void;
};

export const ThemeSheet: React.FC<ThemeSheetProps> = ({ sheetRef, themeId, onSelect }) => {
  const { card, text, border } = useTheme();

  return (
    <BottomSheet
      bottomSheetRef={sheetRef}
      snapPoints={['30%']}
      backgroundStyle={{ backgroundColor: card }}
      title={
        <View style={styles.header}>
          <Ionicons name="color-palette-outline" color={text} size={20} />
          <ThemedText type="subtitle" style={{ color: text }}>
            Choose Theme
          </ThemedText>
        </View>
      }
    >
      <View style={styles.grid}>
        {APP_THEMES.map(theme => {
          const isSelected = theme.id === themeId;
          return (
            <TouchableOpacity
              key={theme.id}
              onPress={() => onSelect(theme)}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  backgroundColor: theme.bg,
                  borderColor: isSelected ? theme.primary : 'transparent',
                  shadowColor: theme.primary,
                  shadowOpacity: isSelected ? 0.3 : 0,
                  elevation: isSelected ? 8 : 1,
                },
              ]}
            >
              <View style={styles.swatchRow}>
                <View style={[styles.swatchA, { backgroundColor: theme.primary }]} />
                <View style={[styles.swatchB, { backgroundColor: theme.accent }]} />
                <View style={[styles.swatchC, { backgroundColor: theme.cardBg }]} />
              </View>

              <ThemedText style={styles.emoji}>{theme.emoji}</ThemedText>
              <ThemedText style={[styles.name, { color: theme.primary }]}>{theme.name}</ThemedText>

              <View style={[styles.miniCard, { backgroundColor: theme.cardBg }]}>
                <View style={[styles.miniDot, { backgroundColor: theme.primary }]} />
                <View style={[styles.miniLine, { backgroundColor: theme.primary + '55' }]} />
              </View>

              {isSelected && (
                <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                  <ThemedText style={styles.badgeText}>✓</ThemedText>
                </View>
              )}
            </TouchableOpacity>
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    gap: 4,
    position: 'relative',
  },
  swatchRow: {
    flexDirection: 'row',
    width: '100%',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  swatchA: { flex: 2 },
  swatchB: { flex: 1 },
  swatchC: { flex: 1 },
  emoji: { fontSize: 22 },
  name: { fontSize: 12, fontWeight: '800' },
  miniCard: {
    width: '100%',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    gap: 4,
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  miniLine: {
    height: 3,
    borderRadius: 2,
    width: '80%',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
});
