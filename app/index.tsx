import { usePreferences } from '@/store/preferences';
import { Redirect } from 'expo-router';

export default function Index() {
  const { primaryTab, onboardingCompleted } = usePreferences();
  const href = primaryTab === 'index' ? `/(tabs)` : `/(tabs)/notes`;
  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href={href} />;
}
