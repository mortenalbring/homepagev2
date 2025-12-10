import React, { useRef, useState, useMemo } from 'react';
import PopupWindow from './PopupWindow';
import FolderWindow from './FolderWindow';
import DesktopIcon from './DesktopIcon';
import PopupContent from './PopupContent';
import fileSystem from './fileSystem.json';
import {
  useWindowManager,
  useURLSync,
  useIconDrag,
  buildInitialPositions,
  useClock,
  formatTime
} from './hooks';
import './Desktop.css';

const { desktopItems, popupConfig } = fileSystem;

export default function Desktop() {
    
    //Reference to desktop DOM, used for dragging the icons and maximise windows  
  const desktopRef = useRef(null);
  //Tracks which icons are single clicked 
  const [selectedId, setSelectedId] = useState(null);
  
  const currentTime = useClock();

  const {
    openPopups,
    openFolders,
    topZ,
    openPopup,
    closePopup,
    minimizePopup,
    closeFolder,
    minimizeFolder,
    bringToFront,
    handleTaskbarClick,
    handleItemOpen,
    addPopupFromURL,
    getMaxPopupZ
  } = useWindowManager();

  const { openPopupWithURL, closePopupWithURL } = useURLSync(
    openPopups,
    addPopupFromURL,
    getMaxPopupZ
  );

  const { iconPositions, handleDragStart } = useIconDrag(
    desktopRef,
    buildInitialPositions(desktopItems)
  );
  
  const handleOpenPopup = (popupId) => openPopupWithURL(popupId, openPopup);
  const handleClosePopup = (popupId) => closePopupWithURL(popupId, closePopup);

  const handleItemOpenWithURL = (action) => {
    if (action.type === 'popup') {
      handleOpenPopup(action.id);
    } else {
      handleItemOpen(action);
    }
  };

  // Memoized taskbar windows list
  const allWindows = useMemo(() => [
    ...openPopups.map(p => ({
      type: 'popup',
      id: p.id,
      zIndex: p.zIndex,
      minimized: p.minimized,
      title: popupConfig[p.id]?.title || p.id
    })),
    ...openFolders.map(f => ({
      type: 'folder',
      id: f.id,
      zIndex: f.zIndex,
      minimized: f.minimized,
      title: f.name
    }))
  ], [openPopups, openFolders]);

  const clearSelection = () => setSelectedId(null);

  return (
    <div className="monitor">
      <div className="desktop" ref={desktopRef} onClick={clearSelection}>

        {/* Desktop Icons */}
        {desktopItems.map(item => (
          <DesktopIcon
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            style={{
              position: 'absolute',
              left: iconPositions[item.id]?.x || 10,
              top: iconPositions[item.id]?.y || 10,
              zIndex: 1
            }}
            onSelect={setSelectedId}
            onOpen={handleItemOpenWithURL}
            onDragStart={handleDragStart}
          />
        ))}

        {/* Taskbar */}
        <div className="taskbar">
          <button className="start-button">
            <span className="win-flag">
              <span className="flag-red" />
              <span className="flag-green" />
              <span className="flag-blue" />
              <span className="flag-yellow" />
            </span>
            <span>Start</span>
          </button>

          <div className="taskbar-divider" />

          <div className="taskbar-windows">
            {allWindows.map(win => (
              <button
                key={`${win.type}-${win.id}`}
                className={`taskbar-window-btn ${win.zIndex === topZ && !win.minimized ? 'active' : ''}`}
                onClick={() => handleTaskbarClick(win.type, win.id)}
              >
                {win.type === 'folder' ? '📁' : (popupConfig[win.id]?.icon || '📄')}
                <span className="taskbar-btn-text">{win.title}</span>
              </button>
            ))}
          </div>

          <div className="taskbar-tray">
            <span className="taskbar-time">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Popup Windows */}
        {openPopups.map(popup => {
          if (popup.minimized) return null;
          const config = popupConfig[popup.id] || { title: popup.id, icon: '📄', menu: [] };
          return (
            <PopupWindow
              key={popup.id}
              title={config.title}
              icon={config.icon}
              menuItems={config.menu}
              statusText={config.status}
              zIndex={popup.zIndex}
              onClose={() => handleClosePopup(popup.id)}
              onMinimize={() => minimizePopup(popup.id)}
              onFocus={() => bringToFront('popup', popup.id)}
              desktopRef={desktopRef}
            >
              <PopupContent popupId={popup.id} />
            </PopupWindow>
          );
        })}

        {/* Folder Windows */}
        {openFolders.map(folder => {
          if (folder.minimized) return null;
          return (
            <FolderWindow
              key={folder.id}
              folder={folder}
              zIndex={folder.zIndex}
              onClose={() => closeFolder(folder.id)}
              onMinimize={() => minimizeFolder(folder.id)}
              onFocus={() => bringToFront('folder', folder.id)}
              onOpenPopup={handleOpenPopup}
              desktopRef={desktopRef}
            />
          );
        })}
      </div>
    </div>
  );
}
