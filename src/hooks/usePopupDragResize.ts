import {MouseEvent as ReactMouseEvent, RefObject, TouchEvent as ReactTouchEvent, useEffect, useRef, useState} from 'react';

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

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function constrainPosition(position: Position, size: Size, desktopRect: DOMRect): Position {
    const maxX = Math.max(0, desktopRect.width - size.width);
    const maxY = Math.max(0, desktopRect.height - size.height);
    return {
        x: clamp(position.x, 0, maxX),
        y: clamp(position.y, 0, maxY)
    };
}

export function useDragResize(
    desktopRef: RefObject<HTMLDivElement>,
    initialPosition: Position,
    initialSize: Size
) {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);

    const dragOffsetRef = useRef({x: 0, y: 0});
    const resizeStartRef = useRef({x: 0, y: 0, width: initialSize.width, height: initialSize.height});
    const positionRef = useRef(position);
    const sizeRef = useRef(size);

    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    useEffect(() => {
        sizeRef.current = size;
    }, [size]);

    useEffect(() => {
        const desktopRect = desktopRef.current?.getBoundingClientRect();
        if (!desktopRect) {
            return;
        }

        setPosition(prev => constrainPosition(prev, size, desktopRect));
    }, [desktopRef, size]);

    const handleDragStart = (e: ReactMouseEvent | ReactTouchEvent, isMaximized: boolean) => {
        if (isMaximized) return;
        e.stopPropagation();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragOffsetRef.current = {
            x: clientX - positionRef.current.x,
            y: clientY - positionRef.current.y
        };
        setDragging(true);
    };

    const handleResizeStart = (e: ReactMouseEvent | ReactTouchEvent, isMaximized: boolean) => {
        if (isMaximized) return;
        e.stopPropagation();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        resizeStartRef.current = {
            x: clientX,
            y: clientY,
            width: sizeRef.current.width,
            height: sizeRef.current.height
        };
        setResizing(true);
    };

    useEffect(() => {
        if (!dragging && !resizing) return;

        const getClient = (e: MouseEvent | TouchEvent) => {
            if (e instanceof TouchEvent && e.touches.length > 0) {
                return {clientX: e.touches[0].clientX, clientY: e.touches[0].clientY};
            }
            if (e instanceof MouseEvent) {
                return {clientX: e.clientX, clientY: e.clientY};
            }
            return null;
        };

        const handleMove = (e: MouseEvent | TouchEvent) => {
            const desktopRect = desktopRef.current?.getBoundingClientRect();
            if (!desktopRect) return;

            const client = getClient(e);
            if (!client) return;

            if (dragging) {
                const nextPosition = {
                    x: client.clientX - dragOffsetRef.current.x,
                    y: client.clientY - dragOffsetRef.current.y
                };
                setPosition(constrainPosition(nextPosition, sizeRef.current, desktopRect));
            } else if (resizing) {
                const deltaX = client.clientX - resizeStartRef.current.x;
                const deltaY = client.clientY - resizeStartRef.current.y;

                const maxWidth = Math.max(MIN_WIDTH, desktopRect.width - positionRef.current.x);
                const maxHeight = Math.max(MIN_HEIGHT, desktopRect.height - positionRef.current.y);

                const newWidth = clamp(resizeStartRef.current.width + deltaX, MIN_WIDTH, maxWidth);
                const newHeight = clamp(resizeStartRef.current.height + deltaY, MIN_HEIGHT, maxHeight);

                setSize({width: newWidth, height: newHeight});
            }
        };

        const handleEnd = () => {
            setDragging(false);
            setResizing(false);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove, {passive: false});
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [desktopRef, dragging, resizing]);

    return {
        position,
        setPosition,
        size,
        setSize,
        handleDragStart,
        handleResizeStart
    };
}
