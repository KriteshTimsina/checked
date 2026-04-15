export const NOTES_PLACEHOLDERS = [
  'Untitled brilliance',
  'Big brain moment',
  'Random thoughts',
  '// TODO: write something useful',
  'Future you will thank you',
  'Another genius idea',
  'Capture the idea',
  'Why did I open this…',
];

export type OnboardingStepProps = {
  id: number;
  emoji: string;
  tag: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  color: string;
  accent: string;
  bg: string;
  cta: string;
};

export const onboardingSteps: OnboardingStepProps[] = [
  {
    id: 0,
    emoji: '👋',
    tag: 'Welcome',
    title: 'Your brain,',
    titleAccent: 'organized.',
    subtitle: 'A fun, colorful space to capture every idea, task, and habit — all in one place.',
    color: '#FF6B6B',
    accent: '#FFE66D',
    bg: '#FFF5F5',
    cta: "What's next",
  },
  {
    id: 1,
    emoji: '📝',
    tag: 'Notes',
    title: 'Capture every',
    titleAccent: 'big idea.',
    subtitle: 'Jot down thoughts, doodles, lists — your notes are always colorful, always yours.',
    color: '#C77DFF',
    accent: '#FF9F1C',
    bg: '#FAF5FF',
    cta: 'Sounds good',
  },
  {
    id: 2,
    emoji: '🎨',
    tag: 'Make it yours',
    title: 'Choose your',
    titleAccent: 'style.',
    subtitle: 'Pick a theme that feels like you. You can always change it later in settings.',
    color: '#B8864E',
    accent: '#7A5230',
    bg: '#FDF8F2',
    cta: "Let's go →",
  },
];
