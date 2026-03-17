import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';

export const toast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
  } else {
    Toast.show({
      type: 'info',
      text1: message,
      visibilityTime: 3000,
    });
  }
};
