import {FolderItem, LocalizedString} from './filesystem';
import {Size} from './desktop';

/**
 * Base state for any open window (popup or folder).
 */
export interface WindowState {
    id: string;
    minimized: boolean;
    zIndex: number;
    initialSize?: Size;
    resizable?: boolean;
}

/**
 * State for an open folder window, extending base window state
 * with folder-specific properties.
 */
export interface FolderWindowState extends WindowState {
    children?: FolderItem[];
    icon: string;
    name: LocalizedString;
}

/**
 * Discriminated union representing an action to open an item.
 * Either opens a folder (with nested navigation) or a popup window.
 */
export type OpenAction =
    | { type: 'folder'; item: FolderItem }
    | { type: 'popup'; id: string; initialSize?: Size; resizable?: boolean };

/**
 * Window type identifier for taskbar and focus management.
 */
export type WindowType = 'popup' | 'folder';
