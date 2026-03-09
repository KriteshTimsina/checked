import { usePreferences } from '@/hooks/usePreferences';
import { Redirect } from 'expo-router';

export default function Index() {
  const { primaryTab, hasCompletedOnboarding } = usePreferences();
  const href = primaryTab === 'index' ? `/(tabs)` : `/(tabs)/notes`;
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href={href} />;
}
