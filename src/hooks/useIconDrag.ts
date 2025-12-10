import { useState, useEffect, useCallback, RefObject } from 'react';
import { FolderItem, IconPositions } from '../types';

const GRID_SIZE = 80;
const ICON_SIZE = 64;
const TASKBAR_HEIGHT = 28;

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
}

export interface UseIconDragReturn {
  iconPositions: IconPositions;
  handleDragStart: (e: React.MouseEvent, item: FolderItem) => void;
}

export function useIconDrag(
  desktopRef: RefObject<HTMLDivElement>,
  initialPositions: IconPositions
): UseIconDragReturn {
  const [iconPositions, setIconPositions] = useState<IconPositions>(initialPositions);
  const [dragging, setDragging] = useState<DragState | null>(null);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent) => {
      if (!desktopRef.current) return;

      const rect = desktopRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left - dragging.offsetX;
      let y = e.clientY - rect.top - dragging.offsetY;

      // Snap to grid
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;

      // Constrain to desktop bounds
      x = Math.max(0, Math.min(x, rect.width - ICON_SIZE));
      y = Math.max(0, Math.min(y, rect.height - ICON_SIZE - TASKBAR_HEIGHT));

      setIconPositions(prev => ({ ...prev, [dragging.id]: { x, y } }));
    };

    const handleUp = () => setDragging(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, desktopRef]);

  const handleDragStart = useCallback((e: React.MouseEvent, item: FolderItem) => {
    if (!desktopRef.current) return;

    const rect = desktopRef.current.getBoundingClientRect();
    const pos = iconPositions[item.id];
    setDragging({
      id: item.id,
      offsetX: e.clientX - rect.left - pos.x,
      offsetY: e.clientY - rect.top - pos.y
    });
  }, [desktopRef, iconPositions]);

  return {
    iconPositions,
    handleDragStart
  };
}

export function buildInitialPositions(desktopItems: FolderItem[]): IconPositions {
  const positions: IconPositions = {};
  desktopItems.forEach(item => {
    positions[item.id] = item.position || { x: 10, y: 10 };
  });
  return positions;
}
