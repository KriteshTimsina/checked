import { View, StyleSheet, Dimensions } from 'react-native';
import { Pill } from '@/components/ui';
import { FloatingNote } from './FloatingNote';

const { width: WIDTH } = Dimensions.get('window');

const notes = [
  { text: 'Ideas for weekend 💡', color: '#FFE66D', rotate: '-3deg', top: 0 },
  { text: 'Chord Progression in C major 🎸', color: '#C77DFF', rotate: '2deg', top: 55 },
  { text: 'Grocery expenses 🛒', color: '#4D96FF', rotate: '-1.5deg', top: 110 },
];

export default function NotesIllustration({ color }: { color: string }) {
  return (
    <View style={[styles.wrapper, { height: 300 }]}>
      <View style={[styles.blob1, { backgroundColor: color + '25' }]} />
      {notes.map((note, i) => (
        <FloatingNote key={i} note={note} index={i} />
      ))}
      <Pill
        containerStyle={styles.newNoteBtn}
        label="+ New note ✏️"
        variant="outline"
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH - 80,
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    top: -30,
    left: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  newNoteBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
