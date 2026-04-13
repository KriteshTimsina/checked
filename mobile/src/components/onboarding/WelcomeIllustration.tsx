import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Pill } from '../ui';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { AnimatedRow } from './AnimatedChecklist';

const { width: WIDTH } = Dimensions.get('window');

const items = ['Buy groceries 🛒', 'Read 20 pages 📖', 'Morning yoga 🧘'];

export default function WelcomeIllustration({ color }: { color: string }) {
  const [tick, setTick] = useState(0);
  const fadeAnims = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fadeAnims.forEach((anim, i) => {
      anim.value = withDelay(i * 100, withTiming(1, { duration: 400 }));
    });
  }, []);

  const done = tick % 4;

  return (
    <View style={ilStyles.wrapper}>
      <View style={[ilStyles.blob1, { backgroundColor: color + '30' }]} />
      <View style={[ilStyles.blob2, { backgroundColor: '#6BCB7730' }]} />

      <View style={[ilStyles.card, { borderColor: color + '40' }]}>
        <Text style={[ilStyles.cardTitle, { color }]}>MY DAY ☀️</Text>
        {items.map((item, i) => (
          <AnimatedRow
            key={i}
            item={item}
            index={i}
            anim={fadeAnims[i]}
            done={done}
            color={color}
          />
        ))}
      </View>

      {done > 0 && (
        <Pill
          label={`${done} done  🎉`}
          color="#FFE66D"
          containerStyle={ilStyles.sticker}
          labelStyle={ilStyles.stickerText}
        />
      )}
    </View>
  );
}

const ilStyles = StyleSheet.create({
  wrapper: {
    width: WIDTH - 80,
    height: 220,
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  blob2: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  card: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
  },

  sticker: {
    position: 'absolute',
    bottom: 2,
    right: 8,
    transform: [{ rotate: '4deg' }],
  },
  stickerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  dayLabel: {
    fontSize: 9,
    color: '#999',
    fontWeight: '700',
  },
  streakBar: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  streakCount: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
  },
  noteCard: {
    position: 'absolute',
    left: 10,
    width: 180,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  noteLine: {
    height: 2,
    borderRadius: 2,
    marginTop: 6,
  },
  newNoteBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  newNoteText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
