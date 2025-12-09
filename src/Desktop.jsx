import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PopupWindow from './PopupWindow';
import FolderWindow from './FolderWindow';
import DesktopIcon from './DesktopIcon';
import PopupContent from './PopupContent';
import fileSystem from './fileSystem.json';
import './Desktop.css';

const { desktopItems, popupConfig } = fileSystem;

const GRID_SIZE = 80;
const ICON_SIZE = 64;

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export default function Desktop() {
  const desktopRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Icon positions (can be dragged)
  const [iconPositions, setIconPositions] = useState(() => {
    const positions = {};
    desktopItems.forEach(item => {
      positions[item.id] = item.position || { x: 10, y: 10 };
    });
    return positions;
  });

  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [topZ, setTopZ] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Open windows
  const [openPopups, setOpenPopups] = useState([]);
  const [openFolders, setOpenFolders] = useState([]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // URL sync for popups
  const getPopupsFromURL = () => {
    const params = new URLSearchParams(location.search);
    const open = params.get('open');
    return open ? open.split(',') : [];
  };

  const updateURL = (popupIds) => {
    const params = new URLSearchParams();
    if (popupIds.length) params.set('open', popupIds.join(','));
    navigate({ search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    const urlPopups = getPopupsFromURL();

    setOpenPopups(prev => {
      const currentIds = new Set(prev.map(p => p.id));
      const newIds = urlPopups.filter(id => !currentIds.has(id));

      if (!newIds.length) return prev;

      const maxZ = prev.length ? Math.max(...prev.map(p => p.zIndex)) : 100;
      return [
        ...prev,
        ...newIds.map((id, i) => ({ id, zIndex: maxZ + i + 1 }))
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Dragging logic
  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      const rect = desktopRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left - dragging.offsetX;
      let y = e.clientY - rect.top - dragging.offsetY;

      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      x = Math.max(0, Math.min(x, rect.width - ICON_SIZE));
      y = Math.max(0, Math.min(y, rect.height - ICON_SIZE - 28)); // account for taskbar

      setIconPositions(prev => ({ ...prev, [dragging.id]: { x, y } }));
    };

    const handleUp = () => setDragging(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  const handleDragStart = (e, item) => {
    const rect = desktopRef.current.getBoundingClientRect();
    const pos = iconPositions[item.id];
    setDragging({
      id: item.id,
      offsetX: e.clientX - rect.left - pos.x,
      offsetY: e.clientY - rect.top - pos.y
    });
  };

  const openPopup = (popupId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);

    setOpenPopups(prev => {
      const existing = prev.find(p => p.id === popupId);
      if (existing) {
        return prev.map(p => p.id === popupId ? { ...p, zIndex: newZ } : p);
      }
      return [...prev, { id: popupId, zIndex: newZ }];
    });

    const urlPopups = getPopupsFromURL();
    if (!urlPopups.includes(popupId)) {
      updateURL([...urlPopups, popupId]);
    }
  };

  const closePopup = (popupId) => {
    setOpenPopups(prev => prev.filter(p => p.id !== popupId));
    updateURL(getPopupsFromURL().filter(id => id !== popupId));
  };

  const openFolder = (folder) => {
    const newZ = topZ + 1;
    setTopZ(newZ);

    setOpenFolders(prev => {
      const existing = prev.find(f => f.id === folder.id);
      if (existing) {
        return prev.map(f => f.id === folder.id ? { ...f, zIndex: newZ } : f);
      }
      return [...prev, { ...folder, zIndex: newZ }];
    });
  };

  const closeFolder = (folderId) => {
    setOpenFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const handleItemOpen = (action) => {
    if (action.type === 'folder') {
      openFolder(action.item);
    } else if (action.type === 'popup') {
      openPopup(action.id);
    }
  };

  const bringToFront = (type, id) => {
    const newZ = topZ + 1;
    setTopZ(newZ);

    if (type === 'popup') {
      setOpenPopups(prev => prev.map(p => p.id === id ? { ...p, zIndex: newZ } : p));
    } else {
      setOpenFolders(prev => prev.map(f => f.id === id ? { ...f, zIndex: newZ } : f));
    }
  };

  const clearSelection = () => setSelectedId(null);

  // All open windows for taskbar
  const allWindows = [
    ...openPopups.map(p => ({ type: 'popup', ...p, title: popupConfig[p.id]?.title || p.id })),
    ...openFolders.map(f => ({ type: 'folder', ...f, title: f.name }))
  ];

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
            onOpen={handleItemOpen}
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
                className={`taskbar-window-btn ${win.zIndex === topZ ? 'active' : ''}`}
                onClick={() => bringToFront(win.type, win.id)}
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
          const config = popupConfig[popup.id] || { title: popup.id, icon: '📄', menu: [] };
          return (
            <PopupWindow
              key={popup.id}
              title={config.title}
              icon={config.icon}
              menuItems={config.menu}
              statusText={config.status}
              zIndex={popup.zIndex}
              onClose={() => closePopup(popup.id)}
              desktopRef={desktopRef}
            >
              <PopupContent popupId={popup.id} />
            </PopupWindow>
          );
        })}

        {/* Folder Windows */}
        {openFolders.map(folder => (
          <FolderWindow
            key={folder.id}
            folder={folder}
            zIndex={folder.zIndex}
            onClose={() => closeFolder(folder.id)}
            onOpenPopup={openPopup}
            desktopRef={desktopRef}
          />
        ))}
      </div>
    </div>
  );
}
