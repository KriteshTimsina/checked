// ChecklistItem.tsx — remove entering prop, use useEffect + useAnimatedStyle instead
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import React, { FC, useCallback, useRef } from 'react';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useProject } from '@/store/projects';
import { toast } from '@/utils/toast';
import { Colors } from '@/constants/colors';

let currentSwipeable: SwipeableMethods | null = null;

type ChecklistItemProps = {
  item: IEntry;
  onEdit: (item: IEntry) => void;
};
const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const ChecklistItem: FC<ChecklistItemProps> = ({ item, onEdit }) => {
  const { primary, primarySoft, icon } = useTheme();
  const { updateEntryStatus } = useEntries();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { deleteEntry } = useEntries();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const currentRef = swipeableRef.current;
    return () => {
      if (currentSwipeable === currentRef) currentSwipeable = null;
    };
  }, []);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 20 });
    translateY.value = withSpring(0, { damping: 20 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const toggleCheckbox = useCallback(async () => {
    try {
      await updateEntryStatus(item.id, !item.completed);
    } catch (error) {
      console.error('Error updating entry status:', error);
    }
  }, [item.id, item.completed, updateEntryStatus]);

  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const onSwipeableWillOpen = () => {
    if (currentSwipeable && currentSwipeable !== swipeableRef.current) {
      currentSwipeable.close();
    }
    currentSwipeable = swipeableRef.current;
  };

  const onSwipeableWillClose = () => {
    if (currentSwipeable === swipeableRef.current) currentSwipeable = null;
  };

  const onDelete = () => {
    deleteEntry(item.id);
    toast('Deleted');
  };

  const onRightSwipe = () => {
    toggleCheckbox();
    currentSwipeable?.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableWillClose={onSwipeableWillClose}
      renderRightActions={() => <RightAction onDelete={onDelete} />}
      renderLeftActions={() => <LeftAction onCompleted={onRightSwipe} />}
    >
      <Animated.View style={[styles.container, { backgroundColor: primarySoft }, animatedStyle]}>
        <View
          style={[styles.accentBar, { backgroundColor: item.completed ? 'transparent' : primary }]}
        />
        <Pressable onPress={handleEdit} android_ripple={{ color: icon }} style={styles.content}>
          <Pressable onPress={toggleCheckbox} hitSlop={6}>
            <Checkbox
              style={styles.checkbox}
              color={item.completed ? primary : undefined}
              value={item.completed}
              onValueChange={toggleCheckbox}
            />
          </Pressable>
          <ThemedText
            style={{
              flex: 1,
              textDecorationLine: item.completed ? 'line-through' : 'none',
              opacity: item.completed ? 0.45 : 1,
            }}
            darkColor={icon}
          >
            {item.title}
          </ThemedText>
        </Pressable>
      </Animated.View>
    </Swipeable>
  );
};

const RightAction = ({ onDelete }: { onDelete: () => void }) => (
  <AnimatedButton entering={FadeIn.delay(1000)} onPress={onDelete} style={styles.deleteContainer}>
    <MaterialCommunityIcons color="white" name="delete-outline" size={24} />
  </AnimatedButton>
);

const LeftAction = ({ onCompleted }: { onCompleted: () => void }) => (
  <AnimatedButton entering={FadeIn.delay(1000)} onPress={onCompleted} style={styles.leftContainer}>
    <Ionicons name="checkmark-sharp" size={24} color="white" />
  </AnimatedButton>
);

export default React.memo(ChecklistItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 60,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkbox: {
    borderRadius: 100,
    width: 25,
    height: 25,
  },
  deleteContainer: {
    backgroundColor: '#ef4444',
    width: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  leftContainer: {
    width: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: Colors.primary,
  },
});
