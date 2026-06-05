import React from 'react';
import {useTranslation} from 'react-i18next';
import PopupWindow from '../popupWindow/PopupWindow';
import DesktopIcon from '../desktopIcon/DesktopIcon';
import {FolderItem, OpenAction, Size} from '../../types';
import {pickLocalized, useAppLanguage} from '../../i18n/Localized';
import './FolderWindow.css';

interface FolderWindowProps {
    folder: FolderItem;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
    onOpenPopup: (id: string, initialSize?: Size, resizable?: boolean) => void;
    desktopRef: React.RefObject<HTMLDivElement>;
    zIndex: number;
}

const FolderWindow = ({
    folder,
    onClose,
    onMinimize,
    onFocus,
    onOpenPopup,
    desktopRef,
    zIndex
}: FolderWindowProps) => {
    const {t} = useTranslation();
    const language = useAppLanguage();
    const [history, setHistory] = React.useState<FolderItem[]>([folder]);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    const currentFolder = history[history.length - 1];
    const canGoBack = history.length > 1;

    const navigateTo = (newFolder: FolderItem) => {
        setHistory([...history, newFolder]);
        setSelectedId(null);
    };

    const goBack = () => {
        if (canGoBack) {
            setHistory(history.slice(0, -1));
            setSelectedId(null);
        }
    };

    const handleItemOpen = (action: OpenAction) => {
        if (action.type === 'folder') {
            navigateTo(action.item);
        } else if (action.type === 'popup') {
            onOpenPopup(action.id, action.initialSize, action.resizable);
        }
    };

    const clearSelection = () => setSelectedId(null);
    const breadcrumbs = history.map((f) => pickLocalized(f.name, language) ?? f.id);
    const folderTitle = pickLocalized(currentFolder.name, language) ?? currentFolder.id;
    const childCount = currentFolder.children?.length ?? 0;
    const menuItems = [
        t('folderWindow.menu.file'),
        t('folderWindow.menu.edit'),
        t('folderWindow.menu.view'),
        t('folderWindow.menu.help')
    ];

    return (
        <PopupWindow
            title={folderTitle}
            icon="📁"
            onClose={onClose}
            onMinimize={onMinimize}
            onFocus={onFocus}
            desktopRef={desktopRef}
            menuItems={menuItems}
            initialSize={{width: 450, height: 350}}
            zIndex={zIndex}
        >
            <div className="folder-container">
                <div className="folder-toolbar">
                    <button
                        className="folder-toolbar-btn"
                        onClick={goBack}
                        disabled={!canGoBack}
                        title={t('folderWindow.back')}
                    >←</button>
                    <button
                        className="folder-toolbar-btn"
                        onClick={goBack}
                        disabled={!canGoBack}
                        title={t('folderWindow.up')}
                    >↑</button>
                    <div className="folder-address win95-inset-border-thin">
                        <span className="address-icon">📁</span>
                        <span className="address-path">M:\{breadcrumbs.join('\\')}</span>
                    </div>
                </div>

                <div className="folder-contents win95-panel-inset" onClick={clearSelection}>
                    {currentFolder.children?.map((item: FolderItem) => (
                        <DesktopIcon
                            key={item.id}
                            item={item}
                            selected={selectedId === item.id}
                            onSelect={setSelectedId}
                            onOpen={handleItemOpen}
                            onDragStart={() => {}}
                            style={{}}
                        />
                    ))}
                    {childCount === 0 && (
                        <div className="folder-empty">{t('folderWindow.empty')}</div>
                    )}
                </div>

                <div className="folder-status win95-status-strip">
                    {t('folderWindow.objects', {count: childCount})}
                </div>
            </div>
        </PopupWindow>
    );
};

export default FolderWindow;
