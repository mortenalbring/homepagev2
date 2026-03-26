import {RefObject, useState} from 'react';

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface WindowState {
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
    const [prevState, setPrevState] = useState<WindowState | null>(null);

    const toggleMaximize = () => {
        if (!desktopRef || !desktopRef.current) return;

        const desktopRect = desktopRef.current.getBoundingClientRect();

        if (!isMaximized) {
            setPrevState({position: {...position}, size: {...size}});
            const borderOffset = 40;
            setPosition({x: borderOffset, y: borderOffset});
            setSize({
                width: desktopRect.width - borderOffset * 3,
                height: desktopRect.height - borderOffset * 3,
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
