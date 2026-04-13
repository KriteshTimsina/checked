import { useTheme } from '@/hooks/useTheme';
import React, { FC } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface PillProps {
  label: string;
  variant?: 'outline' | 'solid';
  color?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const Pill: FC<PillProps> = ({ label, variant = 'solid', color, containerStyle, labelStyle }) => {
  const { primary } = useTheme();
  const resolvedColor = color ?? primary;
  const variantStyle: ViewStyle =
    variant === 'outline'
      ? {
          backgroundColor: color + '18',
          borderColor: color + '30',
          borderWidth: 1.5,
        }
      : {
          backgroundColor: resolvedColor,
          shadowColor: resolvedColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 4,
        };

  const textColor = variant === 'outline' ? color : 'white';

  return (
    <View style={[styles.pill, variantStyle, containerStyle]}>
      <Text style={[styles.label, { color: textColor }, labelStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 5,
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

export default Pill;
