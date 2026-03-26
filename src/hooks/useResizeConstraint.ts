import {RefObject, useEffect} from 'react';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;
const TITLE_BAR_HEIGHT = 22;

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

export function useResizeConstraint(
    desktopRef: RefObject<HTMLDivElement>,
    size: Size,
    setPosition: (pos: Position | ((prev: Position) => Position)) => void,
    setSize: (size: Size | ((prev: Size) => Size)) => void
) {
    useEffect(() => {
        const handleResize = () => {
            if (!desktopRef || !desktopRef.current) return;

            const desktopRect = desktopRef.current.getBoundingClientRect();

            setPosition((currentPosition: Position) => {
                let newPosition = {...currentPosition};
                let changed = false;

                if (newPosition.x + size.width > desktopRect.width) {
                    newPosition.x = Math.max(0, desktopRect.width - size.width);
                    changed = true;
                }

                if (newPosition.y + size.height > desktopRect.height) {
                    newPosition.y = Math.max(TITLE_BAR_HEIGHT, desktopRect.height - size.height);
                    changed = true;
                }

                if (newPosition.x < 0) {
                    newPosition.x = 0;
                    changed = true;
                }

                if (newPosition.y < 0) {
                    newPosition.y = 0;
                    changed = true;
                }

                return changed ? newPosition : currentPosition;
            });

            setSize((currentSize: Size) => {
                let newSize = {...currentSize};
                let changed = false;

                if (newSize.width > desktopRect.width) {
                    newSize.width = Math.max(MIN_WIDTH, desktopRect.width);
                    changed = true;
                }

                if (newSize.height > desktopRect.height - TITLE_BAR_HEIGHT) {
                    newSize.height = Math.max(MIN_HEIGHT, desktopRect.height - TITLE_BAR_HEIGHT);
                    changed = true;
                }

                return changed ? newSize : currentSize;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [desktopRef, size]);
}
