// Hooks
export {useWindowManager} from './useWindowManager';
export {useIconDrag} from './useIconDrag';
export {useClock} from './useClock';

// Hook return types
export type {WindowManagerControls} from './useWindowManager';
export type {IconDragControls} from './useIconDrag';

// Reducer exports (for testing)
export {windowManagerReducer, initialState} from './windowManagerReducer';
export type {WindowManagerState, WindowManagerAction} from './windowManagerReducer';

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
