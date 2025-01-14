import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { entries, IProject, projects } from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { toast } from '@/utils/toast';
import { ThemedText } from './ThemedText';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getDb } from '@/utils/db';
import { and, eq } from 'drizzle-orm';
import { useProject } from '@/store/projects';
import { useEntries } from '@/store/entries';

type ProjectItemProps = {
  item: IProject;
  index: number;
};

const ProjectItem: FC<ProjectItemProps> = ({ item, index }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const { deleteProject } = useProject();
  const { getCompletedEntriesCount } = useEntries();

  useFocusEffect(
    useCallback(() => {
      getCompletedTask();
    }, []),
  );

  const getCompletedTask = useCallback(async () => {
    try {
      const count = await getCompletedEntriesCount(item.id);
      setCompletedCount(count);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  }, []);

  const onDelete = async () => {
    try {
      const deleted = await deleteProject(item.id);

      if (deleted) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return toast('Project deleted successfully.');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast('Failed deleting project');
      console.error(error);
    }
  };

  return (
    <Swipeable renderRightActions={() => <RightAction onDelete={onDelete} />}>
      <Link
        href={{
          pathname: '/entries',
          params: {
            projectId: item.id,
            title: item.title,
          },
        }}
      >
        <Animated.View entering={FadeInDown.delay(100 * (index + 1))} style={styles.projectItem}>
          <View>
            <ThemedText type="defaultSemiBold" darkColor={Colors.light.text}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.completed} darkColor={Colors.light.icon}>
              {completedCount} completed
            </ThemedText>
          </View>
        </Animated.View>
      </Link>
    </Swipeable>
  );
};

export default ProjectItem;

const RightAction = memo(({ onDelete }: { onDelete: () => void }) => {
  return (
    <Pressable onPress={onDelete} style={styles.deleteContainer}>
      <MaterialCommunityIcons
        color="white"
        style={styles.deleteIcon}
        name="delete-outline"
        size={24}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  projectItem: {
    backgroundColor: Colors.primary,
    minHeight: 60,
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  deleteContainer: {
    backgroundColor: 'red',
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteIcon: { textAlign: 'center' },
  completed: { fontSize: 14 },
});
