import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 80;
const ICON_SIZE = 64;
const TASKBAR_HEIGHT = 28;

export function useIconDrag(desktopRef, initialPositions) {
  const [iconPositions, setIconPositions] = useState(initialPositions);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
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

  const handleDragStart = useCallback((e, item) => {
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

// Helper to build initial positions from desktop items
export function buildInitialPositions(desktopItems) {
  const positions = {};
  desktopItems.forEach(item => {
    positions[item.id] = item.position || { x: 10, y: 10 };
  });
  return positions;
}
