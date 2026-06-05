import {FolderItem, FolderWindowState, Size, WindowState, WindowType} from '../types';

// State shape
export interface WindowManagerState {
    openPopups: WindowState[];
    openFolders: FolderWindowState[];
    topZ: number;
}

// Action types
export type WindowManagerAction =
    | { type: 'OPEN_POPUP'; popupId: string; initialSize?: Size; resizable?: boolean }
    | { type: 'CLOSE_POPUP'; popupId: string }
    | { type: 'MINIMIZE_POPUP'; popupId: string }
    | { type: 'OPEN_FOLDER'; folder: FolderItem }
    | { type: 'CLOSE_FOLDER'; folderId: string }
    | { type: 'MINIMIZE_FOLDER'; folderId: string }
    | { type: 'BRING_TO_FRONT'; windowType: WindowType; id: string }
    | { type: 'TASKBAR_CLICK'; windowType: WindowType; id: string }
    | { type: 'INIT_FROM_URL'; popupSpecs: Array<{ id: string; initialSize?: Size; resizable?: boolean }> };

export const initialState: WindowManagerState = {
    openPopups: [],
    openFolders: [],
    topZ: 100
};

// Helper: generic window operations for popups and folders
function getWindowList(state: WindowManagerState, type: WindowType): WindowState[] | FolderWindowState[] {
    return type === 'popup' ? state.openPopups : state.openFolders;
}

function setWindowList(
    state: WindowManagerState,
    type: WindowType,
    list: WindowState[] | FolderWindowState[]
): WindowManagerState {
    return type === 'popup'
        ? {...state, openPopups: list as WindowState[]}
        : {...state, openFolders: list as FolderWindowState[]};
}

function findWindow<T extends { id: string }>(list: T[], id: string): T | undefined {
    return list.find(w => w.id === id);
}

function updateWindow<T extends { id: string }>(list: T[], id: string, update: Partial<T>): T[] {
    return list.map(w => (w.id === id ? {...w, ...update} : w));
}

function handleMinimizeOrFocus(
    state: WindowManagerState,
    windowType: WindowType,
    id: string
): WindowManagerState {
    const list = getWindowList(state, windowType);
    const win = findWindow(list, id);
    if (!win) return state;

    const maxZ = Math.max(
        ...state.openPopups.map(p => p.zIndex),
        ...state.openFolders.map(f => f.zIndex),
        0
    );

    if (win.minimized) {
        const newZ = maxZ + 1;
        return {
            ...setWindowList(state, windowType, updateWindow(list, id, {zIndex: newZ, minimized: false} as any)),
            topZ: newZ
        };
    } else if (win.zIndex === maxZ) {
        return setWindowList(state, windowType, updateWindow(list, id, {minimized: true} as any));
    } else {
        const newZ = maxZ + 1;
        return {
            ...setWindowList(state, windowType, updateWindow(list, id, {zIndex: newZ, minimized: false} as any)),
            topZ: newZ
        };
    }
}

export function windowManagerReducer(
    state: WindowManagerState,
    action: WindowManagerAction
): WindowManagerState {
    switch (action.type) {
        case 'OPEN_POPUP': {
            const {popupId} = action;
            const newZ = state.topZ + 1;
            const existing = findWindow(state.openPopups, popupId);

            if (existing) {
                return {
                    ...state,
                    topZ: newZ,
                    openPopups: updateWindow(state.openPopups, popupId, {zIndex: newZ, minimized: false})
                };
            }

            return {
                ...state,
                topZ: newZ,
                openPopups: [...state.openPopups, {
                    id: popupId,
                    zIndex: newZ,
                    minimized: false,
                    initialSize: action.initialSize,
                    resizable: action.resizable
                }]
            };
        }

        case 'CLOSE_POPUP':
            return {...state, openPopups: state.openPopups.filter(p => p.id !== action.popupId)};

        case 'MINIMIZE_POPUP':
            return {...state, openPopups: updateWindow(state.openPopups, action.popupId, {minimized: true})};

        case 'OPEN_FOLDER': {
            const {folder} = action;
            const newZ = state.topZ + 1;
            const existing = findWindow(state.openFolders, folder.id);

            if (existing) {
                return {
                    ...state,
                    topZ: newZ,
                    openFolders: updateWindow(state.openFolders, folder.id, {zIndex: newZ, minimized: false})
                };
            }

            return {
                ...state,
                topZ: newZ,
                openFolders: [...state.openFolders, {...folder, zIndex: newZ, minimized: false}]
            };
        }

        case 'CLOSE_FOLDER':
            return {...state, openFolders: state.openFolders.filter(f => f.id !== action.folderId)};

        case 'MINIMIZE_FOLDER':
            return {...state, openFolders: updateWindow(state.openFolders, action.folderId, {minimized: true})};

        case 'BRING_TO_FRONT': {
            const {windowType, id} = action;
            const list = getWindowList(state, windowType);
            const win = findWindow(list, id);
            // No-op if the window is already on top and visible — avoids
            // a re-render and unbounded z-index growth on every mousedown.
            if (win && !win.minimized && win.zIndex === state.topZ) {
                return state;
            }
            const newZ = state.topZ + 1;
            return {
                ...setWindowList(state, windowType, updateWindow(list, id, {zIndex: newZ, minimized: false} as any)),
                topZ: newZ
            };
        }

        case 'TASKBAR_CLICK':
            return handleMinimizeOrFocus(state, action.windowType, action.id);

        case 'INIT_FROM_URL': {
            const {popupSpecs} = action;
            const currentIds = new Set(state.openPopups.map(p => p.id));
            const newSpecs = popupSpecs.filter(s => !currentIds.has(s.id));

            if (newSpecs.length === 0) return state;

            let z = state.topZ;
            const popupsToAdd: WindowState[] = newSpecs.map(s => ({
                id: s.id,
                zIndex: ++z,
                minimized: false,
                initialSize: s.initialSize,
                resizable: s.resizable
            }));

            return {
                ...state,
                topZ: z,
                openPopups: [...state.openPopups, ...popupsToAdd]
            };
        }

        default:
            return state;
    }
}
