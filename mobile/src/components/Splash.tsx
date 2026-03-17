import { APP_THEMES } from '@/constants/themes';
import { usePreferences } from '@/hooks/usePreferences';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { version } from '../../package.json';
import { useTheme } from '@/hooks/useTheme';

function GlowCircle() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);
  const { primarySoft } = useTheme();

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.glow, style, { backgroundColor: `${primarySoft}60` }]}
      pointerEvents="none"
    />
  );
}

function LoaderBar() {
  const fillWidth = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const { primary, primarySoft } = useTheme();

  useEffect(() => {
    containerOpacity.value = withDelay(1400, withTiming(1, { duration: 600 }));
    fillWidth.value = withDelay(
      1600,
      withTiming(140, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const fillStyle = useAnimatedStyle(() => ({ width: fillWidth.value }));

  return (
    <Animated.View style={[styles.loaderWrap, containerStyle]}>
      <View style={[styles.loaderTrack, { backgroundColor: primarySoft }]}>
        <Animated.View style={[styles.loaderFill, fillStyle, { backgroundColor: primary }]} />
      </View>
    </Animated.View>
  );
}

export default function SplashScreen() {
  const { themeId } = usePreferences();
  const { primary, primarySoft, textMuted, text } = useTheme();

  const iconUrl = APP_THEMES.find(item => item.id === themeId)?.image;
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.6);
  const iconTranslateY = useSharedValue(10);

  const nameOpacity = useSharedValue(0);
  const nameTranslateY = useSharedValue(16);

  const versionOpacity = useSharedValue(0);

  useEffect(() => {
    iconOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    iconScale.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 180 }));
    iconTranslateY.value = withDelay(300, withSpring(0, { damping: 14, stiffness: 160 }));

    nameOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
    nameTranslateY.value = withDelay(
      700,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );

    versionOpacity.value = withDelay(1800, withTiming(1, { duration: 500 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }, { translateY: iconTranslateY.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameTranslateY.value }],
  }));

  const versionStyle = useAnimatedStyle(() => ({
    opacity: versionOpacity.value,
  }));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={primary} />

      <GlowCircle />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.iconWrap,
            iconStyle,
            {
              borderColor: primary,
              backgroundColor: `${primarySoft}10`,
            },
          ]}
        >
          <Image source={iconUrl!} style={styles.iconImage} resizeMode="cover" />
        </Animated.View>

        <Animated.Text style={[styles.appName, nameStyle, { color: text }]}>
          Ch<Text style={[styles.appNameAccent, { color: primary }]}>e</Text>cked
        </Animated.Text>
      </View>

      <LoaderBar />

      <Animated.Text style={[styles.version, versionStyle, { color: textMuted }]}>
        Version {version}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Glow
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '50%',
    left: '50%',
    marginTop: -210,
    marginLeft: -150,
  },

  center: {
    alignItems: 'center',
    marginTop: -60,
  },

  // Icon
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },

  appName: {
    fontSize: 44,
    letterSpacing: -1,
    fontWeight: '800',
    fontFamily: 'ClashGroteskSemi',
  },
  appNameAccent: {
    fontStyle: 'italic',
  },

  tagline: {
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 10,
  },

  loaderWrap: {
    position: 'absolute',
    bottom: 110,
    alignItems: 'center',
  },
  loaderTrack: {
    width: 140,
    height: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    height: 2,
    borderRadius: 2,
  },

  version: {
    position: 'absolute',
    bottom: 48,
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
