import {useCallback, useEffect, useReducer, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FolderItem, FolderWindowState, OpenAction, WindowState, WindowType} from '../types';
import {initialState, windowManagerReducer} from './windowManagerReducer';

export interface WindowManagerControls {
    openPopups: WindowState[];
    openFolders: FolderWindowState[];
    topZ: number;
    openPopup: (popupId: string) => void;
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

    // Parse popups from URL query params
    const getPopupsFromURL = useCallback((): string[] => {
        const params = new URLSearchParams(location.search);
        const open = params.get('open');
        return open ? open.split(',') : [];
    }, [location.search]);

    // Update URL to reflect open popups
    const updateURL = useCallback((popupIds: string[]) => {
        const params = new URLSearchParams();
        if (popupIds.length) {
            params.set('open', popupIds.join(','));
        }
        navigate({search: params.toString()}, {replace: true});
    }, [navigate]);

    // Initialize from URL on mount
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const urlPopups = getPopupsFromURL();
        if (urlPopups.length) {
            dispatch({type: 'INIT_FROM_URL', popupIds: urlPopups});
        }
    }, [getPopupsFromURL]);

    // Sync URL when popups change (after initialization)
    useEffect(() => {
        if (!isInitialized.current) return;
        updateURL(state.openPopups.map(p => p.id));
    }, [state.openPopups, updateURL]);

    // Action creators
    const openPopup = useCallback((popupId: string) => {
        dispatch({type: 'OPEN_POPUP', popupId});
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
            dispatch({type: 'OPEN_POPUP', popupId: action.id});
        }
    }, []);

    return {
        openPopups: state.openPopups,
        openFolders: state.openFolders,
        topZ: state.topZ,
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
