import {Size} from './desktop';

/**
 * A string that may be provided either as a plain value (same in every
 * language) or as a partial language map. Mirrors `Localizable<string>` from
 * src/i18n/Localized — duplicated here so the types layer doesn't depend on
 * the i18n module.
 */
export type LocalizedString = string | { en?: string; no?: string };

/**
 * Represents a file or folder item in the desktop filesystem.
 * Can be nested recursively via the children property.
 */
export interface FolderItem {
    children?: FolderItem[];
    icon: string;
    id: string;
    link?: string;
    /** Display name. Use a `{ en, no }` map to localize. */
    name: LocalizedString;
    popup?: string;
    position?: { x: number; y: number };
    initialSize?: Size;
    resizable?: boolean;
}

/**
 * Configuration for a popup window's appearance and behavior.
 * Title, menu items and status text accept `{ en, no }` maps for translation.
 */
export interface PopupConfig {
    icon: string;
    menu: LocalizedString[];
    status?: LocalizedString;
    title: LocalizedString;
    initialSize?: Size;
    resizable?: boolean;
}

/**
 * The complete filesystem structure loaded from fileSystem.json.
 */
export interface FileSystem {
    desktopItems: FolderItem[];
    popupConfig: Record<string, PopupConfig>;
}
