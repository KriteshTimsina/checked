import { usePreferences } from '@/hooks/usePreferences';
import { Tabs, MaterialTopTabs } from '@/components/layout';

export default function TabsLayout() {
  const { primaryTab } = usePreferences();
  const screens = primaryTab === 'notes' ? ['notes', 'index'] : ['index', 'notes'];
  return (
    <MaterialTopTabs initialRouteName={primaryTab} tabBar={props => <Tabs {...props} />}>
      {screens.map(screen => (
        <MaterialTopTabs.Screen key={screen} name={screen} />
      ))}
    </MaterialTopTabs>
  );
}
