import React, { FC, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { IProject } from '@/db/schema';
import { toast } from '@/utils/toast';
import { ThemedText } from '@/components/ui';
import { useProject } from '@/store/projects';
import { useEntries } from '@/store/entries';
import { haptics } from '@/utils/haptics';
import { usePreferences } from '@/hooks/usePreferences';
import { useTheme } from '@/hooks/useTheme';
import SwipeableList, { SwipeActionButton } from '../ui/SwipeableList';

type ChecklistProps = {
  item: IProject;
  index: number;
};

const Checklist: FC<ChecklistProps> = ({ item }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const { deleteProject } = useProject();
  const { getCompletedEntriesCount } = useEntries();
  const { icon, textMuted, primary } = useTheme();
  const reminder = usePreferences(s => s.checklistReminders?.[item.id]);
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
        toast('Task deleted successfully.');
      }
    } catch (error) {
      haptics.error();
      toast('Failed deleting task');
      console.error(error);
    }
  };

  const openTask = () => {
    router.push({
      pathname: '/(todos)',
      params: { projectId: item.id, title: item.title },
    });
    haptics.light();
  };

  return (
    <SwipeableList
      onPress={openTask}
      renderRightActions={() => (
        <SwipeActionButton
          style={{ backgroundColor: '#ef4444' }}
          icon="trash-outline"
          onPress={onDelete}
        />
      )}
    >
      <ThemedText type="defaultSemiBold" darkColor={icon}>
        {item.title}
      </ThemedText>
      <View style={styles.metaRow}>
        {reminder && (
          <View style={[styles.reminderBadge, { backgroundColor: primary + '18' }]}>
            <Ionicons name="notifications" size={11} color={primary} />
            <ThemedText style={[styles.reminderLabel, { color: primary }]}>
              {dayjs(reminder.dateTime).format('MMM D, h:mm A')}
            </ThemedText>
          </View>
        )}
        <ThemedText style={[styles.completed, { color: textMuted }]}>
          {completedCount} completed
        </ThemedText>
      </View>
    </SwipeableList>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reminderLabel: {
    fontSize: 11,
    fontWeight: '600',
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
