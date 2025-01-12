import { ToastAndroid } from 'react-native';

export const toast = (message: string) =>
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
