import {useCallback, useEffect, useReducer, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FileSystem, FolderItem, FolderWindowState, LocalizedString, OpenAction, Size, WindowState, WindowType} from '../types';
import {initialState, windowManagerReducer} from './windowManagerReducer';
import fileSystem from '../fileSystem.json';

/** A window entry as shown in the taskbar. */
export interface TaskbarWindow {
    type: WindowType;
    id: string;
    zIndex: number;
    minimized: boolean;
    /** Localizable title — resolve via `pickLocalized` in the renderer. */
    title: LocalizedString;
}

export interface WindowManagerControls {
    openPopups: WindowState[];
    openFolders: FolderWindowState[];
    topZ: number;
    allWindows: TaskbarWindow[];
    openPopup: (popupId: string, initialSize?: Size, resizable?: boolean) => void;
    closePopup: (popupId: string) => void;
    minimizePopup: (popupId: string) => void;
    openFolder: (folder: FolderItem) => void;
    closeFolder: (folderId: string) => void;
    minimizeFolder: (folderId: string) => void;
    bringToFront: (type: WindowType, id: string) => void;
    handleTaskbarClick: (type: WindowType, id: string) => void;
    handleItemOpen: (action: OpenAction) => void;
}

/**
 * Central state management for desktop windows.
 * Handles popups, folders, z-index stacking, and URL sync.
 */
export function useWindowManager(): WindowManagerControls {
    const [state, dispatch] = useReducer(windowManagerReducer, initialState);
    const location = useLocation();
    const navigate = useNavigate();
    const isInitialized = useRef(false);

    const {desktopItems, popupConfig} = fileSystem as unknown as FileSystem;

    // Parse popups from URL query params (ids only). Filters out ids unknown to
    // popupConfig so a hand-crafted ?open=foo URL doesn't add ghost windows.
    const parseOpenParam = useCallback((): string[] => {
        const params = new URLSearchParams(location.search);
        const open = params.get('open');
        if (!open) return [];
        return open
            .split(',')
            .map(s => decodeURIComponent(s))
            .filter(id => Boolean(popupConfig?.[id]));
    }, [location.search, popupConfig]);

    // Helper: find initialSize for a popup id from popupConfig or desktopItems recursively
    const findInitialSizeForPopup = useCallback((popupId: string): Size | undefined => {
        const cfg = popupConfig?.[popupId];
        if (cfg?.initialSize?.width && cfg.initialSize.height) {
            return cfg.initialSize;
        }

        const stack: FolderItem[] = [...desktopItems];
        while (stack.length) {
            const item = stack.shift();
            if (!item) continue;
            if (item.popup === popupId && item.initialSize?.width && item.initialSize.height) {
                return item.initialSize;
            }
            if (item.children?.length) {
                stack.push(...item.children);
            }
        }

        return undefined;
    }, [desktopItems, popupConfig]);

    const findResizableForPopup = useCallback((popupId: string): boolean | undefined => {
        const cfg = popupConfig?.[popupId];
        if (typeof cfg?.resizable === 'boolean') {
            return cfg.resizable;
        }

        const stack: FolderItem[] = [...desktopItems];
        while (stack.length) {
            const item = stack.shift();
            if (!item) continue;
            if (item.popup === popupId && typeof item.resizable === 'boolean') {
                return item.resizable;
            }
            if (item.children?.length) {
                stack.push(...item.children);
            }
        }

        return undefined;
    }, [desktopItems, popupConfig]);

    // Update URL to reflect open popups (ids only)
    const updateURL = useCallback((popupIds: string[]) => {
        const params = new URLSearchParams();
        if (popupIds.length) {
            params.set('open', popupIds.map(id => encodeURIComponent(id)).join(','));
        }
        navigate({search: params.toString()}, {replace: true});
    }, [navigate]);

    // Initialize from URL on mount
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const urlIds = parseOpenParam();
        if (urlIds.length) {
            const specs = urlIds.map(id => ({
                id,
                initialSize: findInitialSizeForPopup(id),
                resizable: findResizableForPopup(id)
            }));
            dispatch({type: 'INIT_FROM_URL', popupSpecs: specs});
        }
    }, [parseOpenParam, findInitialSizeForPopup, findResizableForPopup]);

    // Sync URL when popups change (after initialization)
    useEffect(() => {
        if (!isInitialized.current) return;
        updateURL(state.openPopups.map(p => p.id));
    }, [state.openPopups, updateURL]);

    // Action creators
    const openPopup = useCallback((popupId: string, initialSize?: Size, resizable?: boolean) => {
        dispatch({
            type: 'OPEN_POPUP',
            popupId,
            initialSize,
            resizable: typeof resizable === 'boolean' ? resizable : findResizableForPopup(popupId)
        });
    }, [findResizableForPopup]);

    const closePopup = useCallback((popupId: string) => {
        dispatch({type: 'CLOSE_POPUP', popupId});
    }, []);

    const minimizePopup = useCallback((popupId: string) => {
        dispatch({type: 'MINIMIZE_POPUP', popupId});
    }, []);

    const openFolder = useCallback((folder: FolderItem) => {
        dispatch({type: 'OPEN_FOLDER', folder});
    }, []);

    const closeFolder = useCallback((folderId: string) => {
        dispatch({type: 'CLOSE_FOLDER', folderId});
    }, []);

    const minimizeFolder = useCallback((folderId: string) => {
        dispatch({type: 'MINIMIZE_FOLDER', folderId});
    }, []);

    const bringToFront = useCallback((windowType: WindowType, id: string) => {
        dispatch({type: 'BRING_TO_FRONT', windowType, id});
    }, []);

    const handleTaskbarClick = useCallback((windowType: WindowType, id: string) => {
        dispatch({type: 'TASKBAR_CLICK', windowType, id});
    }, []);

    const handleItemOpen = useCallback((action: OpenAction) => {
        if (action.type === 'folder') {
            dispatch({type: 'OPEN_FOLDER', folder: action.item});
        } else {
            dispatch({
                type: 'OPEN_POPUP',
                popupId: action.id,
                initialSize: action.initialSize,
                resizable: typeof action.resizable === 'boolean'
                    ? action.resizable
                    : findResizableForPopup(action.id)
            });
        }
    }, [findResizableForPopup]);

    const allWindows: TaskbarWindow[] = [
        ...state.openPopups.map(p => ({
            type: 'popup' as const,
            id: p.id,
            zIndex: p.zIndex,
            minimized: p.minimized,
            title: popupConfig[p.id]?.title ?? p.id
        })),
        ...state.openFolders.map(f => ({
            type: 'folder' as const,
            id: f.id,
            zIndex: f.zIndex,
            minimized: f.minimized,
            title: f.name
        }))
    ];

    return {
        openPopups: state.openPopups,
        openFolders: state.openFolders,
        topZ: state.topZ,
        allWindows,
        openPopup,
        closePopup,
        minimizePopup,
        openFolder,
        closeFolder,
        minimizeFolder,
        bringToFront,
        handleTaskbarClick,
        handleItemOpen
    };
}
