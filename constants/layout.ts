import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from './Colors';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
// import Tabs from '@/components/Tabs';

const { Navigator } = createMaterialTopTabNavigator();

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

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);
