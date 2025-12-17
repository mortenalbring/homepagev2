import {useReducer} from 'react';
import {FolderItem, FolderWindowState, OpenAction, WindowState, WindowType} from '../types';
import {windowReducer} from "./windowManagerReducer";

// Controls all the fakey 'windows' on the desktop 
export interface WindowManagerControls {
    /*
    Handles pre-opening stuff from the queryparam when refreshing page
     */
    addPopupFromURL: (popupId: string, zIndex: number) => void;
    bringToFront: (type: WindowType, id: string) => void;
    closeFolder: (folderId: string) => void;
    /*
    Closes
     */
    closePopup: (popupId: string) => void;
    handleItemOpen: (action: OpenAction) => void;
    handleTaskbarClick: (type: WindowType, id: string) => void;
    minimizeFolder: (folderId: string) => void;
    /*
    Minimimizes
     */
    minimizePopup: (popupId: string) => void;
    openFolder: (folder: FolderItem) => void;
    /*
    List of all the open 'folders' (consolidate with above?)
     */
    openFolders: FolderWindowState[];
    /* 
    Opens a window (or pops an existing one to the front)  
     */
    openPopup: (popupId: string) => void;
    /*
    List of all the windows that are open
     */
    openPopups: WindowState[];
    /*
    The biggest z-index, so new 'windows' appear on top. Might need to check if there's a max z-index?
     */
    topZ: number;
}

/*
 Controls all the fakey 'windows' on the desktop
 */
export function useWindowManager(): WindowManagerControls {
    const [state, dispatch] = useReducer(windowReducer, {
        popups: [],
        folders: [],
        topZ: 100
    });

    return {
        openPopups: state.popups,
        openFolders: state.folders,
        topZ: state.topZ,

        openPopup: id => dispatch({type: 'OPEN_POPUP', id}),
        closePopup: id => dispatch({type: 'CLOSE_POPUP', id}),
        minimizePopup: id => dispatch({type: 'MINIMIZE_POPUP', id}),

        openFolder: folder => dispatch({type: 'OPEN_FOLDER', folder}),
        closeFolder: id => dispatch({type: 'CLOSE_FOLDER', id}),
        minimizeFolder: id => dispatch({type: 'MINIMIZE_FOLDER', id}),

        bringToFront: (type, id) =>
            dispatch({type: 'BRING_TO_FRONT', windowType: type, id}),

        handleTaskbarClick: (type, id) =>
            dispatch({type: 'TASKBAR_CLICK', windowType: type, id}),

        handleItemOpen: action => {
            if (action.type === 'folder') {
                dispatch({type: 'OPEN_FOLDER', folder: action.item});
            } else {
                dispatch({type: 'OPEN_POPUP', id: action.id});
            }
        },

        addPopupFromURL: (id, zIndex) =>
            dispatch({type: 'ADD_POPUP_FROM_URL', id, zIndex})
    };
}

