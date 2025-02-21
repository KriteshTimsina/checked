import { usePreferences } from '@/store/preferences';
import { Redirect } from 'expo-router';

export default function Index() {
  const { primaryTab } = usePreferences();
  const href = primaryTab === 'index' ? `/(tabs)` : `/(tabs)/notes`;
  return <Redirect href={href} />;
}
