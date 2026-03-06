import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isWrapper?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  isWrapper = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const { top } = useSafeAreaInsets();
  const marginTop = isWrapper ? top : 0;

  return <View style={[{ backgroundColor, marginTop }, style]} {...otherProps} />;
}
