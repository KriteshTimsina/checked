import { NOTES_PLACEHOLDERS } from '@/components/notes';

export const getRandomPlaceholder = () =>
  NOTES_PLACEHOLDERS[Math.floor(Math.random() * NOTES_PLACEHOLDERS.length)];
