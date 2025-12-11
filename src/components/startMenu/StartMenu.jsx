import React from 'react';
import './StartMenu.css';

const menuItems = [
  { id: 'programs', label: 'Programs', icon: '📁', hasSubmenu: true },
  { id: 'documents', label: 'Documents', icon: '📄', hasSubmenu: true },
  { id: 'settings', label: 'Settings', icon: '⚙️', hasSubmenu: true },
  { id: 'find', label: 'Find', icon: '🔍', hasSubmenu: true },
  { id: 'help', label: 'Help', icon: '❓', hasSubmenu: false },
  { id: 'run', label: 'Run...', icon: '▶️', hasSubmenu: false },
  { id: 'separator', type: 'separator' },
  { id: 'shutdown', label: 'Shut Down...', icon: '🔌', hasSubmenu: false },
];

export default function StartMenu({ onClose }) {
  const handleItemClick = (item) => {
    // doesn't do anything yet
    console.log('Clicked:', item.label);
    onClose();
  };

  return (
    <div className="start-menu">
      <div className="start-menu-sidebar">
        <span className="sidebar-text">Mortensoft 95</span>
      </div>
      <div className="start-menu-items">
        {menuItems.map((item) => {
          if (item.type === 'separator') {
            return <div key={item.id} className="start-menu-separator" />;
          }
          return (
            <button
              key={item.id}
              className="start-menu-item"
              onClick={() => handleItemClick(item)}
            >
              <span className="start-menu-icon">{item.icon}</span>
              <span className="start-menu-label">{item.label}</span>
              {item.hasSubmenu && <span className="start-menu-arrow">▶</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
