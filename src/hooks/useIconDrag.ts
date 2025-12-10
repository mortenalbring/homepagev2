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

export interface IconDragControls {
  iconPositions: IconPositions;
  handleDragStart: (e: React.MouseEvent, item: FolderItem) => void;
}

/*
All of this is just for dragging the icons around...
 */
export function useIconDrag(
  desktopRef: RefObject<HTMLDivElement>,
  initialPositions: IconPositions
): IconDragControls {
  const [iconPositions, setIconPositions] = useState<IconPositions>(initialPositions);
  const [dragging, setDragging] = useState<DragState | null>(null);

  useEffect(() => {
      //don't do stuff if I'm not dragging (ie, if I'm trying to open the thing) 
    if (!dragging) {
        return;
    }

    const handleMove = (e: MouseEvent) => {
      if (!desktopRef.current) {
          return;
      }

      const rect = desktopRef.current.getBoundingClientRect();
      
      //This offset stuff is so it remembers where exactly on the icon I clicked it
        //Without it, it kinda does a weird 'jump' if you click it wrong.
        
        
      let x = e.clientX - rect.left - dragging.offsetX;
      let y = e.clientY - rect.top - dragging.offsetY;

      // Snaps the thing to the grid (nearest multiple of 80, or whatever I finally set the grid size to be)
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;

      // and then also stop the things going off the screen
      x = Math.max(0, Math.min(x, rect.width - ICON_SIZE));
      y = Math.max(0, Math.min(y, rect.height - ICON_SIZE - TASKBAR_HEIGHT));

      setIconPositions(prev => ({ ...prev, [dragging.id]: { x, y } }));
    };

    const handleUp = () => setDragging(null);
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
        //remove event listeners when thing unmounts 
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, desktopRef]);

  const handleDragStart = useCallback((e: React.MouseEvent, item: FolderItem) => {
    if (!desktopRef.current) {
        return;
    }

    const rect = desktopRef.current.getBoundingClientRect();
    const pos = iconPositions[item.id];
    //store the thing being dragged, and ALSO the DOM bounding box of the 'desktop'.
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
