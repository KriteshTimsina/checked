import React, { FC, useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { IProject } from '@/db/schema';
import { toast } from '@/utils/toast';
import { ThemedText } from './ThemedText';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useProject } from '@/store/projects';
import { useEntries } from '@/store/entries';
import { haptics } from '@/utils/haptics';
import { useTheme } from '@/hooks/useTheme';
import SwipeableList from './ui/SwipeableList';

type ChecklistProps = {
  item: IProject;
  index: number;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item, index }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const { deleteProject } = useProject();
  const { getCompletedEntriesCount } = useEntries();
  const { icon, textMuted } = useTheme();
  const router = useRouter();

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

  return (
    <SwipeableList
      onPress={() =>
        router.push({
          pathname: '/(todos)',
          params: { projectId: item.id, title: item.title },
        })
      }
      renderRightActions={() => <RightAction onDelete={onDelete} />}
    >
      <ThemedText type="defaultSemiBold" darkColor={icon}>
        {item.title}
      </ThemedText>
      <ThemedText style={[styles.completed, { color: textMuted }]}>
        {completedCount} completed
      </ThemedText>
    </SwipeableList>
  );
};

export default Checklist;

const RightAction = ({ onDelete }: { onDelete: () => void }) => (
  <AnimatedButton entering={FadeIn.delay(1000)} onPress={onDelete} style={styles.deleteContainer}>
    <MaterialCommunityIcons color="white" name="delete-outline" size={24} />
  </AnimatedButton>
);

const styles = StyleSheet.create({
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
