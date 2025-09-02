import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import GearIcon from './GearIcon';

function Tabs({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
  return (
    <View style={styles.container}>
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
                color={isFocused ? Colors.primary : Colors.dark.icon}
                size={30}
              />
            ) : (
              <FontAwesome
                size={28}
                name={isFocused ? 'sticky-note' : 'sticky-note-o'}
                color={isFocused ? Colors.primary : Colors.dark.icon}
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
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  icon: {
    padding: 5,
    margin: 10,
  },
});
