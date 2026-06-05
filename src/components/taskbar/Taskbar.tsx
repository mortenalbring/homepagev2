import React, {FC, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import StartMenu from '../startMenu/StartMenu';
import {useClock} from '../../hooks';
import {formatTime} from '../../utils';
import startLogo from '../../images/winmort_logo_small.png';
import {LocalizedString, WindowType} from '../../types';
import {toggleLanguage} from '../../i18n';
import {formatLanguageLabel, toAppLanguage} from '../../i18n/language';
import {pickLocalized, useAppLanguage} from '../../i18n/Localized';

interface Window {
    type: WindowType;
    id: string;
    zIndex: number;
    minimized: boolean;
    title: LocalizedString;
}

interface TaskbarProps {
    windows: Window[];
    topZ: number;
    onWindowClick: (type: WindowType, id: string) => void;
    popupConfig: Record<string, { icon?: string }>;
    onShutdown: () => void;
}

const Taskbar: FC<TaskbarProps> = ({windows, topZ, onWindowClick, popupConfig, onShutdown}) => {
    const startMenuRef = useRef<HTMLDivElement>(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const currentTime = useClock();
    const {i18n, t} = useTranslation();
    const language = useAppLanguage();
    const currentLanguage = formatLanguageLabel(language);

    // Keep <html lang="..."> in sync with the active i18n language for a11y.
    useEffect(() => {
        document.documentElement.lang = toAppLanguage(i18n.language);
    }, [i18n.language]);

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
                    <span>{t('taskbar.start')}</span>
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
                        <span className="taskbar-btn-text">{pickLocalized(win.title, language) ?? win.id}</span>
                    </button>
                ))}
            </div>

            <div className="taskbar-tray">
                <button
                    className="taskbar-lang-toggle"
                    onClick={toggleLanguage}
                    title={t('language.toggleLabel')}
                    aria-label={t('language.toggleLabel')}
                >
                    {currentLanguage}
                </button>
                <span className="taskbar-time">{formatTime(currentTime)}</span>
            </div>
        </div>
    );
};

export default Taskbar;
