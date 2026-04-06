import { useCallback, useState } from 'react';

export const useNoteSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const isSelecting = selectedIds.size > 0;

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: number[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: number) => selectedIds.has(id), [selectedIds]);

  return {
    selectedIds,
    isSelecting,
    selectedCount: selectedIds.size,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
  };
};
