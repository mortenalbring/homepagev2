import {RefObject, useState} from 'react';
import {Position, Size} from '../types';

interface SavedWindowState {
    position: Position;
    size: Size;
}

export function useMaximize(
    desktopRef: RefObject<HTMLDivElement>,
    position: Position,
    size: Size,
    setPosition: (pos: Position) => void,
    setSize: (size: Size) => void
) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [prevState, setPrevState] = useState<SavedWindowState | null>(null);

    const toggleMaximize = () => {
        if (!desktopRef || !desktopRef.current) return;

        const desktopRect = desktopRef.current.getBoundingClientRect();
        const TASKBAR_HEIGHT = 28;

        if (!isMaximized) {
            setPrevState({position: {...position}, size: {...size}});
            const margin = 4;
            setPosition({x: margin, y: margin});
            setSize({
                width: desktopRect.width - margin * 2,
                height: desktopRect.height - TASKBAR_HEIGHT - margin * 2,
            });
            setIsMaximized(true);
        } else {
            if (prevState) {
                setPosition(prevState.position);
                setSize(prevState.size);
            }
            setIsMaximized(false);
        }
    };

    return {
        isMaximized,
        toggleMaximize
    };
}
