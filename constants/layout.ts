import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from './Colors';

export const StackScreenDefaultOptions: NativeStackNavigationOptions = {
  headerLargeTitle: true,
  headerLargeStyle: {
    backgroundColor: Colors.primary,
  },
  headerLargeTitleStyle: {
    color: Colors['light'].text,
  },
  headerBlurEffect: 'prominent',
  headerShadowVisible: false,
  headerTitleStyle: {
    fontSize: 24,
    fontFamily: 'ClashGroteskMedium',
    fontWeight: '700',
  },
};
