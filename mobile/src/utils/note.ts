import { notesPlaceholders } from '@/constants/notes';

export const getRandomPlaceholder = () => {
  return notesPlaceholders[Math.floor(Math.random() * notesPlaceholders.length)];
};
