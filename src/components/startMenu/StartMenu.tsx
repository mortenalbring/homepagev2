import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import './StartMenu.css';

interface MenuItem {
    id: string;
    /** i18n key under `startMenu.*`. Omitted for separators. */
    labelKey?: string;
    icon?: string;
    hasSubmenu?: boolean;
    type?: string;
}

const menuItems: MenuItem[] = [
    {id: 'programs',  labelKey: 'startMenu.programs',  icon: '📁', hasSubmenu: true},
    {id: 'documents', labelKey: 'startMenu.documents', icon: '📄', hasSubmenu: true},
    {id: 'settings',  labelKey: 'startMenu.settings',  icon: '⚙️', hasSubmenu: true},
    {id: 'find',      labelKey: 'startMenu.find',      icon: '🔍', hasSubmenu: true},
    {id: 'help',      labelKey: 'startMenu.help',      icon: '❓', hasSubmenu: false},
    {id: 'run',       labelKey: 'startMenu.run',       icon: '▶️', hasSubmenu: false},
    {id: 'separator', type: 'separator'},
    {id: 'shutdown',  labelKey: 'startMenu.shutdown',  icon: '🔌', hasSubmenu: false},
];

interface StartMenuProps {
    onClose: () => void;
    onShutdown?: () => void;
}

const StartMenu: FC<StartMenuProps> = ({onClose, onShutdown}) => {
    const {t} = useTranslation();

    const handleItemClick = (item: MenuItem) => {
        if (item.id === 'shutdown') {
            onShutdown?.();
        }
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
                        return <div key={item.id} className="start-menu-separator"/>;
                    }
                    return (
                        <button
                            key={item.id}
                            className="start-menu-item"
                            onClick={() => handleItemClick(item)}
                        >
                            <span className="start-menu-icon">{item.icon}</span>
                            <span className="start-menu-label">{item.labelKey ? t(item.labelKey) : ''}</span>
                            {item.hasSubmenu && <span className="start-menu-arrow">▶</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StartMenu;
