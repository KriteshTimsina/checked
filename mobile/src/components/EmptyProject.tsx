import { StyleSheet } from 'react-native';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ThemedText } from './ThemedText';
import LottieView from 'lottie-react-native';
import emptyProject from '@/assets/lottie/empty-state.json';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/hooks/useTheme';

const TITLE = {
  todos: 'No Tasks. Add one to view.',
  todoItem: 'Todo has no items. Add one to view.',
  notes: 'Notes is empty. Add one to view.',
};

type EmptyProjectProps = {
  type?: 'todos' | 'todoItem' | 'notes';
};

const EmptyProject: FC<EmptyProjectProps> = ({ type = 'todos' }) => {
  const animation = useRef<LottieView>(null);
  const { primary } = useTheme();

  const colorFilters = useMemo(
    () => [
      { keypath: 'Folder back 2.Fill 1', color: primary },
      { keypath: 'Folder back 2.Fill 6', color: primary },
      { keypath: 'Folder Front 3.Fill 8', color: primary },
      { keypath: 'Shape Layer 4', color: 'white' },
      { keypath: 'Shape Layer 3', color: 'white' },
      { keypath: 'Shape Layer 5.Shape 1.Stroke 1', color: 'white' },
      { keypath: 'Shape Layer 2.Shape 1.Stroke 1', color: 'white' },
    ],
    [primary],
  );

  useEffect(() => {
    const current = animation.current;
    if (!current) return;
    current?.play();

    return () => current?.pause();
  }, []);
  return (
    <ThemedView style={styles.container}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.empty}
        source={emptyProject}
        colorFilters={colorFilters}
      />
      <ThemedText style={{ textAlign: 'center' }}>{TITLE[type]}</ThemedText>
    </ThemedView>
  );
};

export default EmptyProject;

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  empty: {
    width: 200,
    height: 200,
  },
});
