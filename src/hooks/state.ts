import {FolderItem, FolderWindowState, WindowState, WindowType} from "../types";

export type State = {
    popups: WindowState[];
    folders: FolderWindowState[];
    topZ: number;
};

/*
Things you can do with a window
 */
export type WindowAction =
    | { type: 'OPEN_POPUP'; id: string }
    | { type: 'CLOSE_POPUP'; id: string }
    | { type: 'MINIMIZE_POPUP'; id: string }
    | { type: 'OPEN_FOLDER'; folder: FolderItem }
    | { type: 'CLOSE_FOLDER'; id: string }
    | { type: 'MINIMIZE_FOLDER'; id: string }
    | { type: 'BRING_TO_FRONT'; windowType: WindowType; id: string }
    | { type: 'TASKBAR_CLICK'; windowType: WindowType; id: string }
    | { type: 'ADD_POPUP_FROM_URL'; id: string; zIndex: number };
