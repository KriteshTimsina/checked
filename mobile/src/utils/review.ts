import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';

const ANDROID_PACKAGE = Constants.expoConfig?.android?.package;
const IOS_APP_ID = Constants.expoConfig?.ios?.bundleIdentifier;

export const openStoreListing = async () => {
  const url = Platform.select({
    ios: `https://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`,
    android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&showAllReviews=true`,
  });
  if (!url) return;
  await Linking.openURL(url);
};
