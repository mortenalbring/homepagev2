/**
 * Represents a file or folder item in the desktop filesystem.
 * Can be nested recursively via the children property.
 */
export interface FolderItem {
    children?: FolderItem[];
    icon: string;
    id: string;
    link?: string;
    name: string;
    popup?: string;
    position?: { x: number; y: number };
}

/**
 * Configuration for a popup window's appearance and behavior.
 */
export interface PopupConfig {
    icon: string;
    menu: string[];
    status?: string;
    title: string;
}

/**
 * The complete filesystem structure loaded from fileSystem.json.
 */
export interface FileSystem {
    desktopItems: FolderItem[];
    popupConfig: Record<string, PopupConfig>;
}
