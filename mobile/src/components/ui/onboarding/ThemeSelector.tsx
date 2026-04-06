import Button from '@/components/reuseables/Button';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import React, { memo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: WIDTH } = Dimensions.get('window');

type Props = {
  selectedThemeId: number;
  onSelect: (theme: AppTheme) => void;
  accentColor: string; // passed from current step color
};

const ThemeSelector = memo(({ selectedThemeId, onSelect, accentColor }: Props) => {
  return (
    <View style={styles.container}>
      {/* Decorative blobs */}
      <View style={[styles.blob1, { backgroundColor: accentColor + '20' }]} />
      <View style={[styles.blob2, { backgroundColor: accentColor + '15' }]} />

      <Text style={[styles.sectionLabel, { color: accentColor }]}>PICK YOUR VIBE</Text>

      <View style={styles.themesRow}>
        {APP_THEMES.map(theme => {
          const isSelected = theme.id === selectedThemeId;
          return (
            <Button
              key={theme.id}
              onPress={() => onSelect(theme)}
              style={[
                styles.themeCard,
                {
                  backgroundColor: theme.bg,
                  borderColor: isSelected ? theme.primary : 'transparent',
                  shadowColor: theme.primary,
                  shadowOpacity: isSelected ? 0.3 : 0,
                  elevation: isSelected ? 6 : 1,
                  transform: [{ scale: isSelected ? 1.04 : 1 }],
                },
              ]}
            >
              {/* Color swatch strip */}
              <View style={styles.swatchRow}>
                <View style={[styles.swatchMain, { backgroundColor: theme.primary }]} />
                <View style={[styles.swatchAccent, { backgroundColor: theme.accent }]} />
                <View style={[styles.swatchBg, { backgroundColor: theme.cardBg }]} />
              </View>

              {/* Emoji + Name */}
              <Text style={styles.themeEmoji}>{theme.emoji}</Text>
              <Text style={[styles.themeName, { color: theme.primary }]}>{theme.name}</Text>
              <Text style={styles.themeLabel}>{theme.label}</Text>

              {/* Mini app preview */}
              <View
                style={[
                  styles.preview,
                  { backgroundColor: theme.cardBg, borderColor: theme.primary + '30' },
                ]}
              >
                <View style={[styles.previewDot, { backgroundColor: theme.primary }]} />
                <View
                  style={[
                    styles.previewLine,
                    { backgroundColor: theme.primary + '60', width: '70%' },
                  ]}
                />
                <View
                  style={[
                    styles.previewLine,
                    { backgroundColor: theme.primary + '30', width: '50%' },
                  ]}
                />
              </View>

              {/* Selected checkmark */}
              {isSelected && (
                <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </Button>
          );
        })}
      </View>

      {/* Selected theme name pill */}
      <View
        style={[
          styles.selectedPill,
          { backgroundColor: accentColor + '18', borderColor: accentColor + '40' },
        ]}
      >
        <Text style={[styles.selectedPillText, { color: accentColor }]}>
          {APP_THEMES.find(t => t.id === selectedThemeId)?.name} theme selected
        </Text>
      </View>
    </View>
  );
});

ThemeSelector.displayName = 'ThemeSelector';

export default ThemeSelector;

const CARD_WIDTH = (WIDTH - 80 - 16) / 3; // 3 cards with gaps, within slide padding

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 56,
    alignItems: 'center',
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    top: -10,
    right: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  blob2: {
    position: 'absolute',
    bottom: 20,
    left: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  themesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  themeCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 10,
    borderWidth: 2,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    position: 'relative',
  },
  swatchRow: {
    flexDirection: 'row',
    width: '100%',
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  swatchMain: {
    flex: 2,
  },
  swatchAccent: {
    flex: 1,
  },
  swatchBg: {
    flex: 1,
  },
  themeEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  themeName: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  themeLabel: {
    fontSize: 9,
    color: '#AAA',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  preview: {
    width: '100%',
    borderRadius: 8,
    padding: 7,
    borderWidth: 1,
    gap: 5,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  previewLine: {
    height: 3,
    borderRadius: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
  selectedPill: {
    borderRadius: 100,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
