import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isWrapper?: boolean;
  // card uses the elevated card surface instead of base surface
  variant?: 'surface' | 'card';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  isWrapper = false,
  variant = 'surface',
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === 'card' ? 'card' : 'surface',
  );
  const { top } = useSafeAreaInsets();
  const marginTop = isWrapper ? top : 0;

  return <View style={[{ backgroundColor, marginTop }, style]} {...otherProps} />;
}
