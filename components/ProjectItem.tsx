import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { entries, IProject, projects } from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { useDb } from '@/db/useDb';
import { eq } from 'drizzle-orm';
import { toast } from '@/utils/toast';
import { ThemedText } from './ThemedText';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

type ProjectItemProps = {
  item: IProject;
  index: number;
};

const ProjectItem: FC<ProjectItemProps> = ({ item, index }) => {
  const db = useDb();
  const [completedCount, setCompletedCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getCompletedTask();
    }, [item]),
  );

  const getCompletedTask = async () => {
    const completedCount = await db.$count(entries, eq(entries.completed, true));
    setCompletedCount(completedCount);
    console.log(completedCount, 'WHAT');
  };

  const onDelete = async () => {
    const deleted = await db.delete(projects).where(eq(projects.id, item.id));

    if (deleted.changes === 1) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return toast('Project deleted successfully.');
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    return toast('Failed deleteing project');
  };

  const renderRightActions = useCallback(() => {
    return <RightAction onDelete={onDelete} />;
  }, []);

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Link
        href={{
          pathname: '/project',
          params: item,
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
