import React, { FC, memo, useRef } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Swipeable, {
  SwipeableMethods,
  SwipeableProps,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeIn, FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

let currentSwipeable: SwipeableMethods | null = null;

type SwipeableListEnabledProps = {
  swipeEnabled?: true;
} & SwipeableProps;

type SwipeableListDisabledProps = {
  swipeEnabled?: false;
};

type SwipeableListProps = {
  children: React.ReactNode;
  onPress?: VoidFunction | undefined;
  accentBarVisible?: boolean;
} & (SwipeableListDisabledProps | SwipeableListEnabledProps);

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

type SwipeActionButtonProps = {
  onPress: VoidFunction;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
};

export const SwipeActionButton = memo(
  ({ onPress, icon, style, ...props }: SwipeActionButtonProps) => {
    return (
      <AnimatedButton
        {...props}
        entering={FadeIn.delay(1000)}
        onPress={onPress}
        style={[styles.swipeActionContainer, { ...style }]}
      >
        <Ionicons color="white" name={icon} size={24} />
      </AnimatedButton>
    );
  },
);
SwipeActionButton.displayName = 'SwipeActionButton';

const SwipeableList: FC<SwipeableListProps> = ({
  children,
  onPress,
  swipeEnabled = true,
  accentBarVisible = true,
  ...swipeableProps
}) => {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { primary, primarySoft } = useTheme();

  const onSwipeableWillOpen = () => {
    if (currentSwipeable && currentSwipeable !== swipeableRef.current) {
      currentSwipeable.close();
    }
    currentSwipeable = swipeableRef.current;
  };

  const onSwipeableWillClose = () => {
    if (currentSwipeable === swipeableRef.current) currentSwipeable = null;
  };
  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutLeft.duration(300)}
    >
      <Swipeable
        enabled={swipeEnabled}
        ref={swipeableRef}
        onSwipeableWillOpen={onSwipeableWillOpen}
        onSwipeableWillClose={onSwipeableWillClose}
        onSwipeableOpen={() => {
          setTimeout(() => swipeableRef.current?.close(), 3000);
        }}
        {...swipeableProps}
      >
        <Pressable onPress={onPress} style={[styles.container, { backgroundColor: primarySoft }]}>
          {accentBarVisible && <View style={[styles.accentBar, { backgroundColor: primary }]} />}
          <View style={styles.content}>{children}</View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
};

export default SwipeableList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  swipeActionContainer: {
    width: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
