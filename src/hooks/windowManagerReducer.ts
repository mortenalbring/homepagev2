import {State, WindowAction} from "./state";

function getMaxZ(state: State) {
    return Math.max(
        ...state.popups.map(p => p.zIndex),
        ...state.folders.map(f => f.zIndex),
        state.topZ,
        0
    );
}

/*
reducer for window states, doing the allowed things for a window given the state it is currently in
 */
export function windowReducer(state: State, action: WindowAction): State {
    console.info("thing happening", "state", state, "action", action);
    switch (action.type) {

        case 'OPEN_POPUP': {

            const maxZ = getMaxZ(state) + 1;
            const existing = state.popups.find(p => p.id === action.id);

            if (existing) {
                return {
                    ...state,
                    topZ: maxZ,
                    popups: state.popups.map(p =>
                        p.id === action.id
                            ? {...p, zIndex: maxZ, minimized: false}
                            : p
                    )
                };
            }

            return {
                ...state,
                topZ: maxZ,
                popups: [
                    ...state.popups,
                    {id: action.id, zIndex: maxZ, minimized: false}
                ]
            };
        }

        case 'CLOSE_POPUP':
            return {
                ...state,
                popups: state.popups.filter(p => p.id !== action.id)
            };

        case 'MINIMIZE_POPUP':
            return {
                ...state,
                popups: state.popups.map(p =>
                    p.id === action.id ? {...p, minimized: true} : p
                )
            };

        case 'OPEN_FOLDER': {
            const maxZ = getMaxZ(state) + 1;
            const existing = state.folders.find(f => f.id === action.folder.id);

            if (existing) {
                return {
                    ...state,
                    topZ: maxZ,
                    folders: state.folders.map(f =>
                        f.id === action.folder.id
                            ? {...f, zIndex: maxZ, minimized: false}
                            : f
                    )
                };
            }

            return {
                ...state,
                topZ: maxZ,
                folders: [
                    ...state.folders,
                    {...action.folder, zIndex: maxZ, minimized: false}
                ]
            };
        }

        case 'CLOSE_FOLDER':
            return {
                ...state,
                folders: state.folders.filter(f => f.id !== action.id)
            };

        case 'MINIMIZE_FOLDER':
            return {
                ...state,
                folders: state.folders.map(f =>
                    f.id === action.id ? {...f, minimized: true} : f
                )
            };

        case 'BRING_TO_FRONT': {
            const maxZ = getMaxZ(state) + 1;

            if (action.windowType === 'popup') {
                return {
                    ...state,
                    topZ: maxZ,
                    popups: state.popups.map(p =>
                        p.id === action.id
                            ? {...p, zIndex: maxZ, minimized: false}
                            : p
                    )
                };
            }

            return {
                ...state,
                topZ: maxZ,
                folders: state.folders.map(f =>
                    f.id === action.id
                        ? {...f, zIndex: maxZ, minimized: false}
                        : f
                )
            };
        }

        case 'TASKBAR_CLICK': {
            const maxZ = getMaxZ(state);
            const isPopup = action.windowType === 'popup';

            const windows = isPopup ? state.popups : state.folders;
            const window = windows.find(w => w.id === action.id);
            if (!window) return state;

            if (window.minimized) {
                return windowReducer(state, {
                    type: 'BRING_TO_FRONT',
                    windowType: action.windowType,
                    id: action.id
                });
            }

            if (window.zIndex === maxZ) {
                return isPopup
                    ? windowReducer(state, {type: 'MINIMIZE_POPUP', id: action.id})
                    : windowReducer(state, {type: 'MINIMIZE_FOLDER', id: action.id});
            }

            return windowReducer(state, {
                type: 'BRING_TO_FRONT',
                windowType: action.windowType,
                id: action.id
            });
        }

        case 'ADD_POPUP_FROM_URL':
            if (state.popups.some(p => p.id === action.id)) {
                return state;
            }

            return {
                ...state,
                popups: [
                    ...state.popups,
                    {id: action.id, zIndex: action.zIndex, minimized: false}
                ],
                topZ: Math.max(state.topZ, action.zIndex)
            };

        default:
            return state;
    }
}
