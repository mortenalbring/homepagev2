import React, {useState} from 'react';
import PopupWindow from '../popupWindow/PopupWindow';
import DesktopIcon from '../desktopIcon/DesktopIcon';
import './FolderWindow.css';

/*
a popup 'window' that's a folder. 
 */
function FolderWindow({folder, onClose, onMinimize, onFocus, onOpenPopup, desktopRef, zIndex}) {
    // Navigation stack - lets us go back
    const [history, setHistory] = useState([folder]);
    const [selectedId, setSelectedId] = useState(null);

    const currentFolder = history[history.length - 1];
    const canGoBack = history.length > 1;

    const navigateTo = (newFolder) => {
        setHistory([...history, newFolder]);
        setSelectedId(null);
    };

    const goBack = () => {
        if (canGoBack) {
            setHistory(history.slice(0, -1));
            setSelectedId(null);
        }
    };

    const goUp = () => {
        // Go to parent (does same as back)
        goBack();
    };

    const handleItemOpen = (action) => {
        if (action.type === 'folder') {
            navigateTo(action.item);
        } else if (action.type === 'popup') {
            onOpenPopup(action.id);
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
                {/* Toolbar */}
                <div className="folder-toolbar">
                    <button
                        className="folder-toolbar-btn"
                        onClick={goBack}
                        disabled={!canGoBack}
                        title="Back"
                    >
                        ←
                    </button>
                    <button
                        className="folder-toolbar-btn"
                        onClick={goUp}
                        disabled={!canGoBack}
                        title="Up"
                    >
                        ↑
                    </button>
                    <div className="folder-address">
                        <span className="address-icon">📁</span>
                        <span className="address-path">
              C:\{breadcrumbs.join('\\')}
            </span>
                    </div>
                </div>

                <div className="folder-contents" onClick={clearSelection}>
                    {currentFolder.children?.map((item) => (
                        <DesktopIcon
                            key={item.id}
                            item={item}
                            selected={selectedId === item.id}
                            onSelect={setSelectedId}
                            onOpen={handleItemOpen}
                        />
                    ))}

                    {(!currentFolder.children || currentFolder.children.length === 0) && (
                        <div className="folder-empty">This folder is empty</div>
                    )}
                </div>

                {/* not sure if I need this? */}
                <div className="folder-status">
                    {currentFolder.children?.length || 0} object(s)
                </div>
            </div>
        </PopupWindow>
    );
}

export default FolderWindow;
