import React, { useState, useRef, useEffect } from 'react';
import StartMenu from './StartMenu';
import { useClock } from './hooks';
import { formatTime } from './utils';
import startLogo from './images/winmort_logo_small.png';

export default function Taskbar({ windows, topZ, onWindowClick, popupConfig }) {
  const startMenuRef = useRef(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const currentTime = useClock();

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startMenuOpen &&
          startMenuRef.current &&
          !startMenuRef.current.contains(e.target) &&
          !e.target.closest('.start-button')) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen]);

  return (
    <div className="taskbar">
      <div className="start-button-container" ref={startMenuRef}>
        <button
          className={`start-button ${startMenuOpen ? 'active' : ''}`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <img src={startLogo} alt="Start" className="start-logo" />
          <span>Start</span>
        </button>
        {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} />}
      </div>

      <div className="taskbar-divider" />

      <div className="taskbar-windows">
        {windows.map(win => (
          <button
            key={`${win.type}-${win.id}`}
            className={`taskbar-window-btn ${win.zIndex === topZ && !win.minimized ? 'active' : ''}`}
            onClick={() => onWindowClick(win.type, win.id)}
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
  );
}
