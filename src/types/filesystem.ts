/**
 * Represents a file or folder item in the desktop filesystem.
 * Can be nested recursively via the children property.
 */
export interface FolderItem {
  id: string;
  name: string;
  icon: string;
  popup?: string;
  link?: string;
  children?: FolderItem[];
  position?: { x: number; y: number };
}

/**
 * Configuration for a popup window's appearance and behavior.
 */
export interface PopupConfig {
  title: string;
  icon: string;
  menu: string[];
  status?: string;
}

/**
 * The complete filesystem structure loaded from fileSystem.json.
 */
export interface FileSystem {
  desktopItems: FolderItem[];
  popupConfig: Record<string, PopupConfig>;
}
