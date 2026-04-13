import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { HapticButton } from '@/components/layout';

type BaseProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
};

type ToggleProps = BaseProps & {
  variant: 'toggle';
  value: boolean;
  onValueChange: (val: boolean) => void;
};

type NavigateProps = BaseProps & {
  variant: 'navigate';
  onPress: () => void;
  rightLabel?: string;
  rightElement?: React.ReactNode;
};

type InfoProps = BaseProps & {
  variant: 'info';
  rightElement: React.ReactNode;
  onPress?: () => void;
};

export type SettingItemProps = ToggleProps | NavigateProps | InfoProps;

export const SettingItem: React.FC<SettingItemProps> = props => {
  const { primary, card, text, icon, border } = useTheme();

  const left = (
    <View style={styles.left}>
      <View style={[styles.iconWrap, { backgroundColor: primary + '18' }]}>
        <Ionicons name={props.icon} color={primary} size={20} />
      </View>
      <ThemedText style={[styles.label, { color: text }]}>{props.label}</ThemedText>
    </View>
  );

  const containerStyle = [styles.item, { backgroundColor: card }];

  if (props.variant === 'toggle') {
    return (
      <View style={containerStyle}>
        {left}
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          thumbColor={props.value ? primary : icon}
          trackColor={{ false: border, true: primary + '55' }}
          ios_backgroundColor={border}
        />
      </View>
    );
  }

  if (props.variant === 'navigate') {
    return (
      <HapticButton
        onPress={props.onPress}
        style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
        android_ripple={{ color: primary + '20' }}
      >
        {left}
        <View style={styles.right}>
          {props.rightLabel && (
            <ThemedText style={[styles.rightLabel, { color: primary }]}>
              {props.rightLabel}
            </ThemedText>
          )}
          {props.rightElement}
          <Ionicons name="chevron-forward" size={16} color={icon} />
        </View>
      </HapticButton>
    );
  }

  return (
    <HapticButton
      onPress={props.onPress}
      style={({ pressed }) => [containerStyle, pressed && props.onPress && styles.pressed]}
      android_ripple={props.onPress ? { color: primary + '20' } : undefined}
    >
      {left}
      <View style={styles.right}>{props.rightElement}</View>
    </HapticButton>
  );
};

export const SettingSection: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const { textMuted } = useTheme();
  return (
    <View style={styles.section}>
      {title && (
        <ThemedText style={[styles.sectionTitle, { color: textMuted }]}>{title}</ThemedText>
      )}
      <View style={styles.sectionItems}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 58,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  pressed: {
    opacity: 0.75,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  sectionItems: {
    gap: 12,
  },
});
