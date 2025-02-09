import React from 'react';
import { MaterialTopTabs } from '@/constants/layout';
import Tabs from '@/components/Tabs';

export default function TabsLayout() {
  return <MaterialTopTabs tabBar={props => <Tabs {...props} />}></MaterialTopTabs>;
}
