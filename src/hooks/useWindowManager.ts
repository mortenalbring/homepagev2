import {useCallback, useEffect, useReducer, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FolderItem, FolderWindowState, OpenAction, WindowState, WindowType} from '../types';
import {initialState, windowManagerReducer} from './windowManagerReducer';
import fileSystem from '../fileSystem.json';

export interface WindowManagerControls {
    openPopups: WindowState[];
    openFolders: FolderWindowState[];
    topZ: number;
    allWindows: Array<{ type: WindowType; id: string; zIndex: number; minimized: boolean; title: string }>;
    openPopup: (popupId: string, initialSize?: { width: number; height: number }) => void;
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

    const {desktopItems, popupConfig} = (fileSystem as any) || {desktopItems: [], popupConfig: {}};

    // Parse popups from URL query params (ids only)
    const parseOpenParam = useCallback((): string[] => {
        const params = new URLSearchParams(location.search);
        const open = params.get('open');
        return open ? open.split(',').map(s => decodeURIComponent(s)) : [];
    }, [location.search]);

    // Helper: find initialSize for a popup id from popupConfig or desktopItems recursively
    const findInitialSizeForPopup = useCallback((popupId: string) => {
        // Check popupConfig first (priority)
        const cfg = popupConfig?.[popupId];
        if (cfg && cfg.initialSize && cfg.initialSize.width && cfg.initialSize.height) {
            return cfg.initialSize;
        }

        // Search desktopItems recursively for a matching item with initialSize
        const stack: any[] = [...desktopItems];
        while (stack.length) {
            const item = stack.shift();
            if (!item) continue;
            if (item.popup === popupId && item.initialSize && item.initialSize.width && item.initialSize.height) {
                return item.initialSize;
            }
            if (item.children && item.children.length) {
                stack.push(...item.children);
            }
        }

        // Not found — return undefined
        return undefined;
    }, [desktopItems, popupConfig]);

    // Update URL to reflect open popups (ids only)
    const updateURL = useCallback((popupIds: string[]) => {
        const params = new URLSearchParams();
        if (popupIds.length) {
            const encoded = popupIds.map(id => encodeURIComponent(id)).join(',');
            params.set('open', encoded);
        }
        navigate({search: params.toString()}, {replace: true});
    }, [navigate]);

    // Initialize from URL on mount
    useEffect(() => {
        if (isInitialized.current) {
            return;
        }
        isInitialized.current = true;

        const urlIds = parseOpenParam();
        if (urlIds.length) {
            // create popup specs with initialSize looked up from config / desktop items
            const specs = urlIds.map(id => ({id, initialSize: findInitialSizeForPopup(id)}));
            dispatch({type: 'INIT_FROM_URL', popupSpecs: specs});
        }
    }, [parseOpenParam, findInitialSizeForPopup]);

    // Sync URL when popups change (after initialization)
    useEffect(() => {
        if (!isInitialized.current) {
            return;
        }
        updateURL(state.openPopups.map(p => p.id));
    }, [state.openPopups, updateURL]);

    // Action creators
    const openPopup = useCallback((popupId: string, initialSize?: { width: number; height: number }) => {
        dispatch({type: 'OPEN_POPUP', popupId, initialSize});
    }, []);

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
            dispatch({type: 'OPEN_POPUP', popupId: action.id, initialSize: (action as any).initialSize});
        }
    }, []);

    const allWindows = [
        ...state.openPopups.map(p => ({
            type: 'popup' as const,
            id: p.id,
            zIndex: p.zIndex,
            minimized: p.minimized,
            title: popupConfig[p.id]?.title || p.id
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
