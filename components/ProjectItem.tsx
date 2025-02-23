import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { IProject } from '@/db/schema';
import { Colors } from '@/constants/Colors';
import { toast } from '@/utils/toast';
import { ThemedText } from './ThemedText';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useProject } from '@/store/projects';
import { useEntries } from '@/store/entries';
import { haptics } from '@/utils/haptics';

let currentSwipeable: SwipeableMethods | null = null;

type ProjectItemProps = {
  item: IProject;
  index: number;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const ProjectItem: FC<ProjectItemProps> = ({ item, index }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const { deleteProject } = useProject();
  const { getCompletedEntriesCount } = useEntries();
  const swipeableRef = useRef<SwipeableMethods>(null);

  useEffect(() => {
    const currentRef = swipeableRef.current;
    return () => {
      if (currentSwipeable === currentRef) {
        currentSwipeable = null;
      }
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
        return toast('Project deleted successfully.');
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
    if (currentSwipeable === swipeableRef.current) {
      currentSwipeable = null;
    }
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
          pathname: '/(checklist)',
          params: {
            projectId: item.id,
            title: item.title,
          },
        }}
      >
        <Animated.View entering={FadeInDown.delay(100 * (index + 1))} style={styles.projectItem}>
          <View>
            <ThemedText
              type="defaultSemiBold"
              darkColor={Colors.light.text}
              lightColor={Colors.dark.text}
            >
              {item.title}
            </ThemedText>
            <ThemedText
              style={styles.completed}
              darkColor={Colors.light.icon}
              lightColor={Colors.light.shade}
            >
              {completedCount} completed
            </ThemedText>
          </View>
        </Animated.View>
      </Link>
    </Swipeable>
  );
};

export default ProjectItem;

const RightAction = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <AnimatedButton entering={FadeIn.delay(1000)} onPress={onDelete} style={styles.deleteContainer}>
      <MaterialCommunityIcons
        color="white"
        style={styles.deleteIcon}
        name="delete-outline"
        size={24}
      />
    </AnimatedButton>
  );
};

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
