import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import GearIcon from './GearIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

function Tabs({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  const { top } = useSafeAreaInsets();
  const { primary, icon } = useTheme();
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
          <TouchableOpacity
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
          </TouchableOpacity>
        );
      })}
      <GearIcon />
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
});
