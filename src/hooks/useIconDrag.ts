import {RefObject, useCallback, useEffect, useState} from 'react';
import {FolderItem, IconPositions} from '../types';

const GRID_SIZE = 80;
const ICON_SIZE = 64;
const TASKBAR_HEIGHT = 28;

interface DragState {
    id: string;
    offsetX: number;
    offsetY: number;
}

export interface IconDragControls {
    handleDragStart: (e: React.MouseEvent | React.TouchEvent, item: FolderItem) => void;
    iconPositions: IconPositions;
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

    const constrainIconPosition = useCallback((x: number, y: number, desktopRect: DOMRect) => {
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;
        x = Math.max(0, Math.min(x, desktopRect.width - ICON_SIZE));
        y = Math.max(0, Math.min(y, desktopRect.height - ICON_SIZE - TASKBAR_HEIGHT));
        return {x, y};
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (!desktopRef.current) return;
            const rect = desktopRef.current.getBoundingClientRect();

            setIconPositions(prev => {
                const constrained = {...prev};
                let changed = false;

                Object.entries(prev).forEach(([id, pos]) => {
                    const newPos = constrainIconPosition(pos.x, pos.y, rect);
                    if (newPos.x !== pos.x || newPos.y !== pos.y) {
                        constrained[id] = newPos;
                        changed = true;
                    }
                });

                return changed ? constrained : prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [desktopRef, constrainIconPosition]);

    useEffect(() => {
        if (!dragging) {
            return;
        }

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!desktopRef.current) {
                return;
            }
            const rect = desktopRef.current.getBoundingClientRect();
            let clientX: number, clientY: number;
            if (e instanceof MouseEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e instanceof TouchEvent) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                return;
            }
            let x = clientX - rect.left - dragging.offsetX;
            let y = clientY - rect.top - dragging.offsetY;
            const constrained = constrainIconPosition(x, y, rect);
            setIconPositions(prev => ({...prev, [dragging.id]: constrained}));
        };

        const handleUp = () => setDragging(null);

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, {passive: false});
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [dragging, desktopRef, constrainIconPosition]);

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, item: FolderItem) => {
        if (!desktopRef.current) {
            return;
        }
        const rect = desktopRef.current.getBoundingClientRect();
        const pos = iconPositions[item.id];
        let clientX: number, clientY: number;
        if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            return;
        }
        setDragging({
            id: item.id,
            offsetX: clientX - rect.left - pos.x,
            offsetY: clientY - rect.top - pos.y
        });
    }, [desktopRef, iconPositions]);

    return {
        iconPositions,
        handleDragStart
    };
}
