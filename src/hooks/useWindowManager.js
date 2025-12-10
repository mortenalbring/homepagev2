import { useState, useCallback } from 'react';

export function useWindowManager() {
  const [openPopups, setOpenPopups] = useState([]);
  const [openFolders, setOpenFolders] = useState([]);
  const [topZ, setTopZ] = useState(100);

  const openPopup = useCallback((popupId) => {
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

  const closePopup = useCallback((popupId) => {
    setOpenPopups(prev => prev.filter(p => p.id !== popupId));
  }, []);

  const minimizePopup = useCallback((popupId) => {
    setOpenPopups(prev => prev.map(p =>
      p.id === popupId ? { ...p, minimized: true } : p
    ));
  }, []);

  const openFolder = useCallback((folder) => {
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

  const closeFolder = useCallback((folderId) => {
    setOpenFolders(prev => prev.filter(f => f.id !== folderId));
  }, []);

  const minimizeFolder = useCallback((folderId) => {
    setOpenFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, minimized: true } : f
    ));
  }, []);

  const bringToFront = useCallback((type, id) => {
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

  const handleTaskbarClick = useCallback((type, id) => {
    if (type === 'popup') {
      setOpenPopups(popups => {
        const window = popups.find(p => p.id === id);
        if (!window) return popups;

        const maxZ = Math.max(...popups.map(p => p.zIndex), ...openFolders.map(f => f.zIndex));

        if (window.minimized) {
          // Restore minimized window
          setTopZ(prev => prev + 1);
          return popups.map(p =>
            p.id === id ? { ...p, zIndex: maxZ + 1, minimized: false } : p
          );
        } else if (window.zIndex === maxZ) {
          // Minimize active window
          return popups.map(p =>
            p.id === id ? { ...p, minimized: true } : p
          );
        } else {
          // Bring to front
          setTopZ(prev => prev + 1);
          return popups.map(p =>
            p.id === id ? { ...p, zIndex: maxZ + 1, minimized: false } : p
          );
        }
      });
    } else {
      setOpenFolders(folders => {
        const window = folders.find(f => f.id === id);
        if (!window) return folders;

        const maxZ = Math.max(...openPopups.map(p => p.zIndex), ...folders.map(f => f.zIndex));

        if (window.minimized) {
          setTopZ(prev => prev + 1);
          return folders.map(f =>
            f.id === id ? { ...f, zIndex: maxZ + 1, minimized: false } : f
          );
        } else if (window.zIndex === maxZ) {
          return folders.map(f =>
            f.id === id ? { ...f, minimized: true } : f
          );
        } else {
          setTopZ(prev => prev + 1);
          return folders.map(f =>
            f.id === id ? { ...f, zIndex: maxZ + 1, minimized: false } : f
          );
        }
      });
    }
  }, [openPopups, openFolders]);

  const handleItemOpen = useCallback((action) => {
    if (action.type === 'folder') {
      openFolder(action.item);
    } else if (action.type === 'popup') {
      openPopup(action.id);
    }
  }, [openFolder, openPopup]);

  // Add popup from external source (URL sync)
  const addPopupFromURL = useCallback((popupId, zIndex) => {
    setOpenPopups(prev => {
      if (prev.find(p => p.id === popupId)) return prev;
      return [...prev, { id: popupId, zIndex, minimized: false }];
    });
  }, []);

  const getMaxPopupZ = useCallback(() => {
    return openPopups.length ? Math.max(...openPopups.map(p => p.zIndex)) : 100;
  }, [openPopups]);

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
    addPopupFromURL,
    getMaxPopupZ
  };
}
