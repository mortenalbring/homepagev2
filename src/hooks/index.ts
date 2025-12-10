// Hooks
export { useWindowManager } from './useWindowManager';
export { useURLSync } from './useURLSync';
export { useIconDrag, buildInitialPositions } from './useIconDrag';
export { useClock, formatTime } from './useClock';

// Hook return types
export type { UseWindowManagerReturn } from './useWindowManager';
export type { UseURLSyncReturn } from './useURLSync';
export type { UseIconDragReturn } from './useIconDrag';

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
