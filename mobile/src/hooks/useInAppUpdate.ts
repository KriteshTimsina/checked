import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as ExpoInAppUpdates from 'expo-in-app-updates';
import { openStoreListing } from '@/utils/review';

export const useInAppUpdates = () => {
  useEffect(() => {
    if (__DEV__ || Platform.OS === 'web') return;

    const checkForUpdates = async () => {
      try {
        if (Platform.OS === 'android') {
          await ExpoInAppUpdates.checkAndStartUpdate(false);
        } else {
          const result = await ExpoInAppUpdates.checkForUpdate();
          if (!result.updateAvailable) return;

          Alert.alert(
            'Update Available',
            'A new version of Checked is available with improvements and bug fixes.',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Update', onPress: () => openStoreListing() },
            ],
          );
        }
      } catch (e) {
        console.log('Update check failed:', e);
      }
    };

    checkForUpdates();
  }, []);
};
