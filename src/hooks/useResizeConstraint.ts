import {RefObject, useEffect, useRef} from 'react';
import {Position, Size} from '../types';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;
const TITLE_BAR_HEIGHT = 22;


export function useResizeConstraint(
    desktopRef: RefObject<HTMLDivElement>,
    size: Size,
    setPosition: (pos: Position | ((prev: Position) => Position)) => void,
    setSize: (size: Size | ((prev: Size) => Size)) => void
) {
    // Track the latest size in a ref so the window resize listener doesn't get
    // detached/reattached on every drag-resize tick.
    const sizeRef = useRef(size);
    useEffect(() => {
        sizeRef.current = size;
    }, [size]);

    useEffect(() => {
        const handleResize = () => {
            if (!desktopRef || !desktopRef.current) return;

            const desktopRect = desktopRef.current.getBoundingClientRect();
            const currentSize = sizeRef.current;

            setPosition((currentPosition: Position) => {
                let newPosition = {...currentPosition};
                let changed = false;

                if (newPosition.x + currentSize.width > desktopRect.width) {
                    newPosition.x = Math.max(0, desktopRect.width - currentSize.width);
                    changed = true;
                }

                if (newPosition.y + currentSize.height > desktopRect.height) {
                    newPosition.y = Math.max(TITLE_BAR_HEIGHT, desktopRect.height - currentSize.height);
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

            setSize((currentSizeState: Size) => {
                let newSize = {...currentSizeState};
                let changed = false;

                if (newSize.width > desktopRect.width) {
                    newSize.width = Math.max(MIN_WIDTH, desktopRect.width);
                    changed = true;
                }

                if (newSize.height > desktopRect.height - TITLE_BAR_HEIGHT) {
                    newSize.height = Math.max(MIN_HEIGHT, desktopRect.height - TITLE_BAR_HEIGHT);
                    changed = true;
                }

                return changed ? newSize : currentSizeState;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [desktopRef, setPosition, setSize]);
}