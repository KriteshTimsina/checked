import { useFonts } from 'expo-font';

export const useFontLoading = () => {
  const [loaded] = useFonts({
    ClashGroteskMedium: require('../assets/fonts/ClashGrotesk-Medium.otf'),
  });
  return loaded;
};
