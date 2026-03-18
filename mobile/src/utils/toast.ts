import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';

type ToastPosition = 'top' | 'bottom';

export const toast = (message: string, position: ToastPosition = 'bottom') => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      position === 'bottom' ? ToastAndroid.BOTTOM : ToastAndroid.TOP,
    );
  } else {
    Toast.show({
      type: 'info',
      text1: message,
      visibilityTime: 3000,
      position,
    });
  }
};
