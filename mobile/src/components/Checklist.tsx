import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { IProject } from '@/db/schema';
import { toast } from '@/utils/toast';
import { ThemedText } from './ThemedText';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useProject } from '@/store/projects';
import { useEntries } from '@/store/entries';
import { haptics } from '@/utils/haptics';
import { useTheme } from '@/hooks/useTheme';

let currentSwipeable: SwipeableMethods | null = null;

type ChecklistProps = {
  item: IProject;
  index: number;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item, index }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const { deleteProject } = useProject();
  const { getCompletedEntriesCount } = useEntries();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { primary, primarySoft, icon, textMuted } = useTheme();

  useEffect(() => {
    const currentRef = swipeableRef.current;
    return () => {
      if (currentSwipeable === currentRef) currentSwipeable = null;
    };
  }, []);

  const getCompletedTask = useCallback(async () => {
    try {
      const count = await getCompletedEntriesCount(item.id);
      setCompletedCount(count);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  }, [getCompletedEntriesCount, item.id]);

  useFocusEffect(
    useCallback(() => {
      getCompletedTask();
    }, [getCompletedTask]),
  );

  const onDelete = async () => {
    try {
      const deleted = await deleteProject(item.id);
      if (deleted) {
        haptics.success();
        toast('Project deleted successfully.');
      }
    } catch (error) {
      haptics.error();
      toast('Failed deleting project');
      console.error(error);
    }
  };

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
      ref={swipeableRef}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableWillClose={onSwipeableWillClose}
      renderRightActions={() => <RightAction onDelete={onDelete} />}
    >
      <Link
        href={{
          pathname: '/(todos)',
          params: { projectId: item.id, title: item.title },
        }}
      >
        <Animated.View
          entering={FadeInDown.delay(100 * (index + 1))}
          style={[styles.projectItem, { backgroundColor: primarySoft }]}
        >
          <View style={[styles.accentBar, { backgroundColor: primary }]} />

          <View style={styles.content}>
            <ThemedText type="defaultSemiBold" darkColor={icon}>
              {item.title}
            </ThemedText>
            <ThemedText style={[styles.completed, { color: textMuted }]}>
              {completedCount} completed
            </ThemedText>
          </View>
        </Animated.View>
      </Link>
    </Swipeable>
  );
};

export default Checklist;

const RightAction = ({ onDelete }: { onDelete: () => void }) => (
  <AnimatedButton entering={FadeIn.delay(1000)} onPress={onDelete} style={styles.deleteContainer}>
    <MaterialCommunityIcons color="white" name="delete-outline" size={24} />
  </AnimatedButton>
);

const styles = StyleSheet.create({
  projectItem: {
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
  completed: {
    fontSize: 13,
  },
  deleteContainer: {
    backgroundColor: '#ef4444',
    width: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
