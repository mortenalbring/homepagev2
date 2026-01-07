import React, {useMemo, useRef, useState} from 'react';
import PopupWindow from '../popupWindow/PopupWindow';
import FolderWindow from '../folderWindow/FolderWindow';
import DesktopIcon from '../desktopIcon/DesktopIcon';
import PopupContent from '../PopupContent';
import Taskbar from '../taskbar/Taskbar';
import fileSystem from '../../fileSystem.json';
import {useIconDrag, useWindowManager} from '../../hooks';
import {buildInitialPositions} from '../../utils';
import './Desktop.css';

const {desktopItems, popupConfig} = fileSystem;

export default function Desktop() {
    //used for dragging the icons and maximise windows
    const desktopRef = useRef(null);
    //Tracks which icon is single clicked
    const [selectedId, setSelectedId] = useState(null);
    const [isShuttingDown, setIsShuttingDown] = useState(false);

    const handleShutdown = () => {
        setIsShuttingDown(true);
    };

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
        handleItemOpen
    } = useWindowManager();

    const {iconPositions, handleDragStart} = useIconDrag(
        desktopRef,
        buildInitialPositions(desktopItems)
    );

    //caching this stuff between re-renders
    //so it doesn't need to do this when single-clicking or dragging
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
            {isShuttingDown && <div className="shutdown-overlay"/>}
            <div className="desktop" ref={desktopRef} onClick={clearSelection}>

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

                <Taskbar
                    windows={allWindows}
                    topZ={topZ}
                    onWindowClick={handleTaskbarClick}
                    popupConfig={popupConfig}
                    onShutdown={handleShutdown}
                />

                {openPopups.map(popup => {
                    if (popup.minimized) return null;
                    const config = popupConfig[popup.id] || {title: popup.id, icon: '📄', menu: []};
                    return (
                        <PopupWindow
                            key={popup.id}
                            title={config.title}
                            icon={config.icon}
                            menuItems={config.menu}
                            statusText={config.status}
                            zIndex={popup.zIndex}
                            onClose={() => closePopup(popup.id)}
                            onMinimize={() => minimizePopup(popup.id)}
                            onFocus={() => bringToFront('popup', popup.id)}
                            desktopRef={desktopRef}
                        >
                            <PopupContent popupId={popup.id}/>
                        </PopupWindow>
                    );
                })}

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
                            onOpenPopup={openPopup}
                            desktopRef={desktopRef}
                        />
                    );
                })}
            </div>
        </div>
    );
}
