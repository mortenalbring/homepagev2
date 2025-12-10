import { FolderItem } from './filesystem';

/**
 * Base state for any open window (popup or folder).
 */
export interface WindowState {
  id: string;
  zIndex: number;
  minimized: boolean;
}

/**
 * State for an open folder window, extending base window state
 * with folder-specific properties.
 */
export interface FolderWindowState extends WindowState {
  name: string;
  icon: string;
  children?: FolderItem[];
}

/**
 * Discriminated union representing an action to open an item.
 * Either opens a folder (with nested navigation) or a popup window.
 */
export type OpenAction =
  | { type: 'folder'; item: FolderItem }
  | { type: 'popup'; id: string };

/**
 * Window type identifier for taskbar and focus management.
 */
export type WindowType = 'popup' | 'folder';
