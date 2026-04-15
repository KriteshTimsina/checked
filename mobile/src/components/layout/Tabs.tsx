import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/layout/HapticButton';
import HapticButton from '@/components/layout/HapticButton';
import { router } from 'expo-router';

function Tabs({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  const { top } = useSafeAreaInsets();
  const { primary, icon } = useTheme();

  const openSettings = () => {
    router.push('/settings');
  };
  return (
    <View style={[styles.container, { marginTop: top }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Button
            key={label as string}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.icon}
          >
            {label === 'index' ? (
              <Ionicons
                name={isFocused ? 'checkbox' : 'checkbox-outline'}
                color={isFocused ? primary : icon}
                size={30}
              />
            ) : (
              <FontAwesome
                size={28}
                name={isFocused ? 'sticky-note' : 'sticky-note-o'}
                color={isFocused ? primary : icon}
              />
            )}
          </Button>
        );
      })}
      <HapticButton
        onPress={openSettings}
        style={({ pressed }) => [styles.settings, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
      >
        <Ionicons name="settings" size={26} color={primary} />
      </HapticButton>
    </View>
  );
}
export default Tabs;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  icon: {
    padding: 5,
    margin: 10,
  },
  settings: {
    padding: 4,
    position: 'absolute',
    right: 20,
  },
});
