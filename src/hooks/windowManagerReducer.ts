import {FolderItem, FolderWindowState, WindowState, WindowType} from '../types';

// State shape
export interface WindowManagerState {
    openPopups: WindowState[];
    openFolders: FolderWindowState[];
    topZ: number;
}

// Action types
export type WindowManagerAction =
    | { type: 'OPEN_POPUP'; popupId: string }
    | { type: 'CLOSE_POPUP'; popupId: string }
    | { type: 'MINIMIZE_POPUP'; popupId: string }
    | { type: 'OPEN_FOLDER'; folder: FolderItem }
    | { type: 'CLOSE_FOLDER'; folderId: string }
    | { type: 'MINIMIZE_FOLDER'; folderId: string }
    | { type: 'BRING_TO_FRONT'; windowType: WindowType; id: string }
    | { type: 'TASKBAR_CLICK'; windowType: WindowType; id: string }
    | { type: 'INIT_FROM_URL'; popupIds: string[] };

export const initialState: WindowManagerState = {
    openPopups: [],
    openFolders: [],
    topZ: 100
};

export function windowManagerReducer(
    state: WindowManagerState,
    action: WindowManagerAction
): WindowManagerState {
    switch (action.type) {
        case 'OPEN_POPUP': {
            const {popupId} = action;
            const newZ = state.topZ + 1;
            const existing = state.openPopups.find(p => p.id === popupId);

            if (existing) {
                return {
                    ...state,
                    topZ: newZ,
                    openPopups: state.openPopups.map(p =>
                        p.id === popupId ? {...p, zIndex: newZ, minimized: false} : p
                    )
                };
            }

            return {
                ...state,
                topZ: newZ,
                openPopups: [...state.openPopups, {id: popupId, zIndex: newZ, minimized: false}]
            };
        }

        case 'CLOSE_POPUP': {
            return {
                ...state,
                openPopups: state.openPopups.filter(p => p.id !== action.popupId)
            };
        }

        case 'MINIMIZE_POPUP': {
            return {
                ...state,
                openPopups: state.openPopups.map(p =>
                    p.id === action.popupId ? {...p, minimized: true} : p
                )
            };
        }

        case 'OPEN_FOLDER': {
            const {folder} = action;
            const newZ = state.topZ + 1;
            const existing = state.openFolders.find(f => f.id === folder.id);

            if (existing) {
                return {
                    ...state,
                    topZ: newZ,
                    openFolders: state.openFolders.map(f =>
                        f.id === folder.id ? {...f, zIndex: newZ, minimized: false} : f
                    )
                };
            }

            return {
                ...state,
                topZ: newZ,
                openFolders: [...state.openFolders, {...folder, zIndex: newZ, minimized: false}]
            };
        }

        case 'CLOSE_FOLDER': {
            return {
                ...state,
                openFolders: state.openFolders.filter(f => f.id !== action.folderId)
            };
        }

        case 'MINIMIZE_FOLDER': {
            return {
                ...state,
                openFolders: state.openFolders.map(f =>
                    f.id === action.folderId ? {...f, minimized: true} : f
                )
            };
        }

        case 'BRING_TO_FRONT': {
            const {windowType, id} = action;
            const newZ = state.topZ + 1;

            if (windowType === 'popup') {
                return {
                    ...state,
                    topZ: newZ,
                    openPopups: state.openPopups.map(p =>
                        p.id === id ? {...p, zIndex: newZ, minimized: false} : p
                    )
                };
            }

            return {
                ...state,
                topZ: newZ,
                openFolders: state.openFolders.map(f =>
                    f.id === id ? {...f, zIndex: newZ, minimized: false} : f
                )
            };
        }

        case 'TASKBAR_CLICK': {
            const {windowType, id} = action;
            const maxZ = Math.max(
                ...state.openPopups.map(p => p.zIndex),
                ...state.openFolders.map(f => f.zIndex),
                0
            );

            if (windowType === 'popup') {
                const window = state.openPopups.find(p => p.id === id);
                if (!window) return state;

                if (window.minimized) {
                    // Restore minimized window
                    return {
                        ...state,
                        topZ: maxZ + 1,
                        openPopups: state.openPopups.map(p =>
                            p.id === id ? {...p, zIndex: maxZ + 1, minimized: false} : p
                        )
                    };
                } else if (window.zIndex === maxZ) {
                    // Already on top, minimize it
                    return {
                        ...state,
                        openPopups: state.openPopups.map(p =>
                            p.id === id ? {...p, minimized: true} : p
                        )
                    };
                } else {
                    // Bring to front
                    return {
                        ...state,
                        topZ: maxZ + 1,
                        openPopups: state.openPopups.map(p =>
                            p.id === id ? {...p, zIndex: maxZ + 1, minimized: false} : p
                        )
                    };
                }
            } else {
                const window = state.openFolders.find(f => f.id === id);
                if (!window) return state;

                if (window.minimized) {
                    return {
                        ...state,
                        topZ: maxZ + 1,
                        openFolders: state.openFolders.map(f =>
                            f.id === id ? {...f, zIndex: maxZ + 1, minimized: false} : f
                        )
                    };
                } else if (window.zIndex === maxZ) {
                    return {
                        ...state,
                        openFolders: state.openFolders.map(f =>
                            f.id === id ? {...f, minimized: true} : f
                        )
                    };
                } else {
                    return {
                        ...state,
                        topZ: maxZ + 1,
                        openFolders: state.openFolders.map(f =>
                            f.id === id ? {...f, zIndex: maxZ + 1, minimized: false} : f
                        )
                    };
                }
            }
        }

        case 'INIT_FROM_URL': {
            const {popupIds} = action;
            const currentIds = new Set(state.openPopups.map(p => p.id));
            const newPopups = popupIds.filter(id => !currentIds.has(id));

            if (newPopups.length === 0) return state;

            let z = state.topZ;
            const popupsToAdd: WindowState[] = newPopups.map(id => ({
                id,
                zIndex: ++z,
                minimized: false
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
