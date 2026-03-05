import React, { FC, useEffect, useRef, useState } from 'react';
import StartMenu from '../startMenu/StartMenu';
import { useClock } from '../../hooks';
import { formatTime } from '../../utils';
import startLogo from '../../images/winmort_logo_small.png';
import { WindowType } from '../../types';

interface Window {
    type: WindowType;
    id: string;
    zIndex: number;
    minimized: boolean;
    title: string;
}

interface TaskbarProps {
    windows: Window[];
    topZ: number;
    onWindowClick: (type: WindowType, id: string) => void;
    popupConfig: Record<string, { icon?: string }>;
    onShutdown: () => void;
}

const Taskbar: FC<TaskbarProps> = ({ windows, topZ, onWindowClick, popupConfig, onShutdown }) => {
    const startMenuRef = useRef<HTMLDivElement>(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const currentTime = useClock();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (startMenuOpen &&
                startMenuRef.current &&
                !startMenuRef.current.contains(e.target as Node) &&
                !(e.target as HTMLElement).closest('.start-button')) {
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
                    <img src={startLogo} alt="Start" className="start-logo"/>
                    <span>Start</span>
                </button>
                {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} onShutdown={onShutdown}/>}
            </div>

            <div className="taskbar-divider"/>

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
};

export default Taskbar;
