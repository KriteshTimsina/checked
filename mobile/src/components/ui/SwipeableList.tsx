import React, { FC, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Swipeable, {
  SwipeableMethods,
  SwipeableProps,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { useTheme } from '@/hooks/useTheme';

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
    <Swipeable
      enabled={swipeEnabled}
      ref={swipeableRef}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableWillClose={onSwipeableWillClose}
      {...swipeableProps}
    >
      <Pressable onPress={onPress} style={[styles.container, { backgroundColor: primarySoft }]}>
        {accentBarVisible && <View style={[styles.accentBar, { backgroundColor: primary }]} />}
        <View style={styles.content}>{children}</View>
      </Pressable>
    </Swipeable>
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
});
