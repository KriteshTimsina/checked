import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import GearIcon from './GearIcon';

function Tabs({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        marginTop: 20,
        // display: state.index === 0 ? 'flex' : 'none',
      }}
    >
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

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            key={label as string}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              padding: 5,
              margin: 10,
              alignSelf: 'center',
            }}
          >
            {label === 'index' ? (
              <MaterialIcons
                size={35}
                name="checklist"
                color={isFocused ? Colors.primary : Colors.secondary}
              />
            ) : (
              <MaterialIcons
                size={35}
                name="notes"
                color={isFocused ? Colors.primary : Colors.secondary}
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
  setting: {
    position: 'absolute',
    right: 0,
    marginRight: 20,
  },
});
