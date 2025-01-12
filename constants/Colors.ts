/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const tintColorLight = '#22c55e';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#e0c59e',
  secondary: '#EAF8FF',
  highlight: '#e0c59e',

  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    shade: '#f1f5f9',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    shade: 'rgba(255, 255, 255, 0.1)',
  },
};

export const updatePrimaryColor = (newColor: string) => {
  if (typeof newColor === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
    Colors.primary = newColor;
    Colors.highlight = newColor;
    console.log(`Primary color updated to: ${newColor}`);
  } else {
    console.error('Invalid color format. Please provide a valid hex color code.');
  }
};
