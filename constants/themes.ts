/**
 * App themes for onboarding preference selection.
 * Theme 1 → Welcome step colors (warm red/yellow)
 * Theme 2 → Notes step colors (purple/orange)
 * Theme 3 → App primary color (e0c59e sandy/warm)
 */

export type AppTheme = {
  id: number;
  name: string;
  emoji: string;
  primary: string;
  accent: string;
  bg: string;
  cardBg: string;
  label: string;
};

export const APP_THEMES: AppTheme[] = [
  {
    id: 0,
    name: 'Sandy',
    emoji: '🌾',
    primary: '#B8864E', // darker warm brown instead of #e0c59e
    accent: '#7A5230', // deeper accent
    bg: '#FDF8F2', // keep the warm bg
    cardBg: '#F0E4D0',
    label: 'Warm & Minimal',
  },
  {
    id: 1,
    name: 'Tomato',
    emoji: '🍅',
    primary: '#FF6B6B',
    accent: '#FFE66D',
    bg: '#FFF5F5',
    cardBg: '#FFE0E0',
    label: 'Warm & Energetic',
  },
  {
    id: 2,
    name: 'Lavender',
    emoji: '🪻',
    primary: '#C77DFF',
    accent: '#FF9F1C',
    bg: '#FAF5FF',
    cardBg: '#EDD9FF',
    label: 'Calm & Creative',
  },
];

export const DEFAULT_THEME_ID = 0;
