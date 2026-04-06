import { notesPlaceholders } from '@/constants/notes';

export const getRandomPlaceholder = () =>
  notesPlaceholders[Math.floor(Math.random() * notesPlaceholders.length)];
