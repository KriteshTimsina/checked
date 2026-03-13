import { IconName } from '@howincodes/expo-dynamic-app-icon';

export type AppTheme = {
  id: number;
  name: string;
  iconKey: IconName;
  emoji: string;
  primary: string;
  accent: string;
  bg: string;
  cardBg: string;
  label: string;
  image: ReturnType<typeof require>;
};

export const APP_THEMES: AppTheme[] = [
  {
    id: 0,
    name: 'Forest',
    iconKey: 'forest',
    emoji: '🌿',
    primary: '#3DC42A',
    accent: '#2A8A1E',
    bg: '#E4F3D8',
    cardBg: '#E7F9DD',
    label: 'Fresh & Natural',
    image: require('@/assets/images/icon.png'),
  },
  {
    id: 1,
    name: 'Sandy',
    iconKey: 'sandy',
    emoji: '🌾',
    primary: '#B8864E',
    accent: '#7A5230',
    bg: '#FDF8F2',
    cardBg: '#F0E4D0',
    label: 'Warm & Minimal',
    image: require('@/assets/images/icon-1.png'),
  },
  {
    id: 2,
    name: 'Tomato',
    iconKey: 'tomato',
    emoji: '🍅',
    primary: '#FF6B6B',
    accent: '#FFE66D',
    bg: '#FFF5F5',
    cardBg: '#FFE0E0',
    label: 'Warm & Energetic',
    image: require('@/assets/images/icon-2.png'),
  },
  {
    id: 3,
    name: 'Lavender',
    iconKey: 'lavender',
    emoji: '🪻',
    primary: '#C77DFF',
    accent: '#FF9F1C',
    bg: '#FAF5FF',
    cardBg: '#EDD9FF',
    label: 'Calm & Creative',
    image: require('@/assets/images/icon-3.png'),
  },
];
