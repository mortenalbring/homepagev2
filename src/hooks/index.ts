// Hooks
export {useWindowManager} from './useWindowManager';
export {useIconDrag} from './useIconDrag';
export {useClock} from './useClock';
export {useDragResize} from './usePopupDragResize';
export {useResizeConstraint} from './useResizeConstraint';
export {useMaximize} from './useMaximize';

// Hook return types
export type {WindowManagerControls} from './useWindowManager';
export type {IconDragControls} from './useIconDrag';

// Re-export common types for convenience
export type {
    FolderItem,
    PopupConfig,
    FileSystem,
    WindowState,
    FolderWindowState,
    OpenAction,
    WindowType,
    Position,
    IconPositions
} from '../types';
