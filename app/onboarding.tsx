import { ThemedView } from '@/components/ThemedView';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { usePreferences } from '@/store/preferences';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

// ─── Welcome Illustration ─────────────────────────────────────────────────────
function WelcomeIllustration({ color }: { color: string }) {
  const [tick, setTick] = useState(0);
  const fadeAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const items = ['Buy groceries 🛒', 'Read 20 pages 📖', 'Morning yoga 🧘'];

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    items.forEach((_, i) => {
      Animated.timing(fadeAnims[i], {
        toValue: 1,
        duration: 400,
        delay: i * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const done = tick % 4;

  return (
    <View style={ilStyles.wrapper}>
      {/* Blob */}
      <View style={[ilStyles.blob1, { backgroundColor: color + '30' }]} />
      <View style={[ilStyles.blob2, { backgroundColor: '#6BCB7730' }]} />

      {/* Card */}
      <View style={[ilStyles.card, { borderColor: color + '40' }]}>
        <Text style={[ilStyles.cardTitle, { color }]}>MY DAY ☀️</Text>
        {items.map((item, i) => (
          <Animated.View key={i} style={[ilStyles.checkRow, { opacity: fadeAnims[i] }]}>
            <View
              style={[
                ilStyles.checkbox,
                { borderColor: color, backgroundColor: i < done ? color : 'transparent' },
              ]}
            >
              {i < done && <Text style={ilStyles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                ilStyles.checkText,
                {
                  color: i < done ? '#CCC' : '#333',
                  textDecorationLine: i < done ? 'line-through' : 'none',
                },
              ]}
            >
              {item}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Sticker */}
      {done > 0 && (
        <View style={[ilStyles.sticker, { transform: [{ rotate: '4deg' }] }]}>
          <Text style={ilStyles.stickerText}>{done} done 🎉</Text>
        </View>
      )}
    </View>
  );
}

// ─── Habit Illustration ───────────────────────────────────────────────────────
function HabitIllustration({ color }: { color: string }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const filled = [true, true, true, true, false, false, false];
  const [streak, setStreak] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setStreak(s => (s === 4 ? 5 : 4)), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={ilStyles.wrapper}>
      <View
        style={[ilStyles.blob1, { backgroundColor: color + '25', right: 10, left: undefined }]}
      />
      <View style={[ilStyles.card, { borderColor: color + '40' }]}>
        <Text style={[ilStyles.cardTitle, { color }]}>HABIT TRACKER 🌱</Text>
        <Text style={ilStyles.cardSubtitle}>Morning Workout</Text>

        <View style={ilStyles.daysRow}>
          {days.map((d, i) => (
            <View key={i} style={ilStyles.dayCol}>
              <View style={[ilStyles.dayBox, { backgroundColor: filled[i] ? color : '#F0F0F0' }]}>
                {filled[i] && <Text style={ilStyles.dayCheck}>✓</Text>}
              </View>
              <Text style={ilStyles.dayLabel}>{d}</Text>
            </View>
          ))}
        </View>

        <View style={[ilStyles.streakBar, { backgroundColor: color }]}>
          <Text style={ilStyles.streakLabel}>🔥 Streak</Text>
          <Text style={ilStyles.streakCount}>{streak} days</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Notes Illustration ───────────────────────────────────────────────────────
function NotesIllustration({ color }: { color: string }) {
  const notes = [
    { text: 'Ideas for weekend 💡', color: '#FFE66D', rotate: '-3deg', top: 0 },
    { text: 'Recipe: avocado toast 🥑', color: '#C77DFF', rotate: '2deg', top: 55 },
    { text: 'Call dentist 📞', color: '#4D96FF', rotate: '-1.5deg', top: 110 },
  ];

  return (
    <View style={[ilStyles.wrapper, { height: 200 }]}>
      <View style={[ilStyles.blob1, { backgroundColor: color + '25' }]} />
      {notes.map((note, i) => (
        <View
          key={i}
          style={[
            ilStyles.noteCard,
            {
              backgroundColor: note.color,
              top: note.top,
              left: i * 12,
              transform: [{ rotate: note.rotate }],
              shadowColor: note.color,
            },
          ]}
        >
          <Text style={ilStyles.noteText}>{note.text}</Text>
          <View style={[ilStyles.noteLine, { backgroundColor: 'rgba(0,0,0,0.12)' }]} />
          <View
            style={[
              ilStyles.noteLine,
              { backgroundColor: 'rgba(0,0,0,0.08)', width: '65%', marginTop: 4 },
            ]}
          />
        </View>
      ))}
      <View style={[ilStyles.newNoteBtn, { borderColor: color }]}>
        <Text style={[ilStyles.newNoteText, { color }]}>+ New note ✏️</Text>
      </View>
    </View>
  );
}

export default function Onboarding() {
  const { top, bottom } = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const { completeOnboarding } = usePreferences();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const current = onboardingSteps[step];

  const goTo = (next: number) => {
    // Exit animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(24);
      // Enter animation
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, speed: 20, bounciness: 6, useNativeDriver: true }),
      ]).start();
    });
  };

  const illustrations = [
    <WelcomeIllustration color={current.color} />,
    <HabitIllustration color={current.color} />,
    <NotesIllustration color={current.color} />,
  ];

  const onComplete = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <ThemedView isWrapper style={[styles.root, { backgroundColor: current.bg }]}>
      {/* Top bar */}

      {/* Animated content */}
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Tag pill */}
        <View
          style={[
            styles.pill,
            { backgroundColor: current.color + '18', borderColor: current.color + '30' },
          ]}
        >
          <Text style={styles.pillEmoji}>{current.emoji}</Text>
          <Text style={[styles.pillText, { color: current.color }]}>
            {current.tag.toUpperCase()}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {current.title}
          {'\n'}
          <Text style={{ color: current.color }}>{current.titleAccent}</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{current.subtitle}</Text>

        {/* Illustration */}
        <View style={styles.illustrationArea}>{illustrations[step]}</View>
      </Animated.View>

      {/* Bottom */}
      <View style={[styles.bottom, { paddingBottom: bottom + 16 }]}>
        {/* Dots */}
        <View style={styles.dots}>
          {onboardingSteps.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View
                style={[
                  styles.dot,
                  {
                    width: i === step ? 24 : 8,
                    backgroundColor: i === step ? current.color : '#E0E0E0',
                    shadowColor: current.color,
                    shadowOpacity: i === step ? 0.5 : 0,
                    shadowRadius: 4,
                    elevation: i === step ? 3 : 0,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: current.color, shadowColor: current.color }]}
          onPress={() => (step < onboardingSteps.length - 1 ? goTo(step + 1) : onComplete?.())}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, { color: step === 2 ? '#333' : '#fff' }]}>
            {current.cta}
          </Text>
        </TouchableOpacity>

        {/* Sign in */}
        {step === 0 && (
          <Text style={styles.signinText}>
            Already have an account?{' '}
            <Text style={{ color: current.color, fontWeight: '700' }}>Sign in</Text>
          </Text>
        )}
      </View>
    </ThemedView>
  );
}

// ─── Illustration Styles ──────────────────────────────────────────────────────
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
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
  checkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sticker: {
    position: 'absolute',
    bottom: 2,
    right: 8,
    backgroundColor: '#FFE66D',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#FFE66D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
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

// ─── Main Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#222',
    letterSpacing: -0.4,
  },
  skipBtn: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AAA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 100,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    gap: 6,
    marginBottom: 16,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    paddingHorizontal: 28,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 100,
  },
  cta: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  signinText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BBB',
    fontWeight: '600',
    paddingBottom: 4,
  },
});
