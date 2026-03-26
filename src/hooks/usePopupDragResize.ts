import {useEffect, useState} from 'react';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

export function useDragResize(initialPosition: Position, initialSize: Size) {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});

    const handleDragStart = (e: React.MouseEvent, isMaximized: boolean) => {
        if (isMaximized) return;
        e.stopPropagation();
        setDragging(true);
        setOffset({x: e.clientX - position.x, y: e.clientY - position.y});
    };

    const handleResizeStart = (e: React.MouseEvent, isMaximized: boolean) => {
        if (isMaximized) return;
        e.stopPropagation();
        setResizing(true);
        setOffset({x: e.clientX, y: e.clientY});
    };

    useEffect(() => {
        if (!dragging && !resizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (dragging) {
                setPosition({x: e.clientX - offset.x, y: e.clientY - offset.y});
            } else if (resizing) {
                const newWidth = Math.max(MIN_WIDTH, size.width + (e.clientX - offset.x));
                const newHeight = Math.max(MIN_HEIGHT, size.height + (e.clientY - offset.y));
                setSize({width: newWidth, height: newHeight});
                setOffset({x: e.clientX, y: e.clientY});
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            setResizing(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, resizing, offset, size]);

    return {
        position,
        setPosition,
        size,
        setSize,
        handleDragStart,
        handleResizeStart
    };
}
