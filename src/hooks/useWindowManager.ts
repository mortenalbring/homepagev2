import { useState, useCallback } from 'react';
import {
  FolderItem,
  WindowState,
  FolderWindowState,
  OpenAction,
  WindowType
} from '../types';

// Controls all the fakey 'windows' on the desktop 
export interface UseWindowManagerReturn {
  openPopups: WindowState[]; //Open 'windows'
  openFolders: FolderWindowState[]; //Open 'folders'
  topZ: number; //The biggest z-index, so new 'windows' appear on top. Might need to check if there's a max z-index? 
  openPopup: (popupId: string) => void;
  closePopup: (popupId: string) => void;
  minimizePopup: (popupId: string) => void;
  openFolder: (folder: FolderItem) => void;
  closeFolder: (folderId: string) => void;
  minimizeFolder: (folderId: string) => void;
  bringToFront: (type: WindowType, id: string) => void;
  handleTaskbarClick: (type: WindowType, id: string) => void;
  handleItemOpen: (action: OpenAction) => void;
  addPopupFromURL: (popupId: string, zIndex: number) => void;
}

export function useWindowManager(): UseWindowManagerReturn {
  const [openPopups, setOpenPopups] = useState<WindowState[]>([]);
  const [openFolders, setOpenFolders] = useState<FolderWindowState[]>([]);
  const [topZ, setTopZ] = useState(100);

  const openPopup = useCallback((popupId: string) => {
    setTopZ(prev => {
      const newZ = prev + 1;
      setOpenPopups(popups => {
        const existing = popups.find(p => p.id === popupId);
        if (existing) {
          return popups.map(p =>
            p.id === popupId ? { ...p, zIndex: newZ, minimized: false } : p
          );
        }
        return [...popups, { id: popupId, zIndex: newZ, minimized: false }];
      });
      return newZ;
    });
  }, []);

  const closePopup = useCallback((popupId: string) => {
    setOpenPopups(prev => prev.filter(p => p.id !== popupId));
  }, []);

  const minimizePopup = useCallback((popupId: string) => {
    setOpenPopups(prev => prev.map(p =>
      p.id === popupId ? { ...p, minimized: true } : p
    ));
  }, []);

  const openFolder = useCallback((folder: FolderItem) => {
    setTopZ(prev => {
      const newZ = prev + 1;
      setOpenFolders(folders => {
        const existing = folders.find(f => f.id === folder.id);
        if (existing) {
          return folders.map(f =>
            f.id === folder.id ? { ...f, zIndex: newZ, minimized: false } : f
          );
        }
        return [...folders, { ...folder, zIndex: newZ, minimized: false }];
      });
      return newZ;
    });
  }, []);

  const closeFolder = useCallback((folderId: string) => {
    setOpenFolders(prev => prev.filter(f => f.id !== folderId));
  }, []);

  const minimizeFolder = useCallback((folderId: string) => {
    setOpenFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, minimized: true } : f
    ));
  }, []);

  const bringToFront = useCallback((type: WindowType, id: string) => {
    setTopZ(prev => {
      const newZ = prev + 1;
      if (type === 'popup') {
        setOpenPopups(popups => popups.map(p =>
          p.id === id ? { ...p, zIndex: newZ, minimized: false } : p
        ));
      } else {
        setOpenFolders(folders => folders.map(f =>
          f.id === id ? { ...f, zIndex: newZ, minimized: false } : f
        ));
      }
      return newZ;
    });
  }, []);

  const handleTaskbarClick = useCallback((type: WindowType, id: string) => {
    if (type === 'popup') {
      setOpenPopups(popups => {
        setOpenFolders(folders => {
          const window = popups.find(p => p.id === id);
          if (!window) return folders;

          const maxZ = Math.max(
            ...popups.map(p => p.zIndex),
            ...folders.map(f => f.zIndex),
            0
          );

          if (window.minimized) {
            setOpenPopups(prev => prev.map(p =>
              p.id === id ? { ...p, zIndex: maxZ + 1, minimized: false } : p
            ));
            setTopZ(maxZ + 1);
          } else if (window.zIndex === maxZ) {
            setOpenPopups(prev => prev.map(p =>
              p.id === id ? { ...p, minimized: true } : p
            ));
          } else {
            setOpenPopups(prev => prev.map(p =>
              p.id === id ? { ...p, zIndex: maxZ + 1, minimized: false } : p
            ));
            setTopZ(maxZ + 1);
          }
          return folders;
        });
        return popups;
      });
    } else {
      setOpenFolders(folders => {
        setOpenPopups(popups => {
          const window = folders.find(f => f.id === id);
          if (!window) return popups;

          const maxZ = Math.max(
            ...popups.map(p => p.zIndex),
            ...folders.map(f => f.zIndex),
            0
          );

          if (window.minimized) {
            setOpenFolders(prev => prev.map(f =>
              f.id === id ? { ...f, zIndex: maxZ + 1, minimized: false } : f
            ));
            setTopZ(maxZ + 1);
          } else if (window.zIndex === maxZ) {
            setOpenFolders(prev => prev.map(f =>
              f.id === id ? { ...f, minimized: true } : f
            ));
          } else {
            setOpenFolders(prev => prev.map(f =>
              f.id === id ? { ...f, zIndex: maxZ + 1, minimized: false } : f
            ));
            setTopZ(maxZ + 1);
          }
          return popups;
        });
        return folders;
      });
    }
  }, []);

  const handleItemOpen = useCallback((action: OpenAction) => {
    if (action.type === 'folder') {
      openFolder(action.item);
    } else if (action.type === 'popup') {
      openPopup(action.id);
    }
  }, [openFolder, openPopup]);

  const addPopupFromURL = useCallback((popupId: string, zIndex: number) => {
    setOpenPopups(prev => {
      if (prev.find(p => p.id === popupId)) return prev;
      return [...prev, { id: popupId, zIndex, minimized: false }];
    });
  }, []);

  return {
    openPopups,
    openFolders,
    topZ,
    openPopup,
    closePopup,
    minimizePopup,
    openFolder,
    closeFolder,
    minimizeFolder,
    bringToFront,
    handleTaskbarClick,
    handleItemOpen,
    addPopupFromURL
  };
}
