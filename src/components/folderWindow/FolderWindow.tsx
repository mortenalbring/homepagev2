import {FC, RefObject, useState} from 'react';
import PopupWindow from '../popupWindow/PopupWindow';
import DesktopIcon from '../desktopIcon/DesktopIcon';
import {FolderItem, OpenAction, Size} from '../../types';
import './FolderWindow.css';

interface FolderWindowProps {
    folder: FolderItem;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
    onOpenPopup: (id: string, initialSize?: Size) => void;
    desktopRef: RefObject<HTMLDivElement>;
    zIndex: number;
}

const FolderWindow: FC<FolderWindowProps> = ({
    folder, onClose, onMinimize, onFocus, onOpenPopup, desktopRef, zIndex
}) => {
    const [history, setHistory] = useState<FolderItem[]>([folder]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

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
            onOpenPopup(action.id, action.initialSize);
        }
    };

    const clearSelection = () => setSelectedId(null);
    const breadcrumbs = history.map(f => f.name);

    return (
        <PopupWindow
            title={currentFolder.name}
            icon="📁"
            onClose={onClose}
            onMinimize={onMinimize}
            onFocus={onFocus}
            desktopRef={desktopRef}
            menuItems={['File', 'Edit', 'View', 'Help']}
            initialSize={{width: 450, height: 350}}
            zIndex={zIndex}
        >
            <div className="folder-container">
                <div className="folder-toolbar">
                    <button
                        className="folder-toolbar-btn"
                        onClick={goBack}
                        disabled={!canGoBack}
                        title="Back"
                    >←</button>
                    <button
                        className="folder-toolbar-btn"
                        onClick={goBack}
                        disabled={!canGoBack}
                        title="Up"
                    >↑</button>
                    <div className="folder-address win95-inset-border-thin">
                        <span className="address-icon">📁</span>
                        <span className="address-path">M:\{breadcrumbs.join('\\')}</span>
                    </div>
                </div>

                <div className="folder-contents win95-panel-inset" onClick={clearSelection}>
                    {currentFolder.children?.map((item) => (
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
                    {(!currentFolder.children || currentFolder.children.length === 0) && (
                        <div className="folder-empty">This folder is empty</div>
                    )}
                </div>

                <div className="folder-status win95-status-strip">
                    {currentFolder.children?.length ?? 0} object(s)
                </div>
            </div>
        </PopupWindow>
    );
};

export default FolderWindow;
