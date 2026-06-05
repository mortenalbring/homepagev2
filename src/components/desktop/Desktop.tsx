import React, {FC, useEffect, useRef, useState} from 'react';
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

const Desktop: FC = () => {
    const desktopRef = useRef<HTMLDivElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isShuttingDown, setIsShuttingDown] = useState(false);

    const handleShutdown = () => {
        setIsShuttingDown(true);
    };

    const {
        openPopups,
        openFolders,
        topZ,
        allWindows,
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

    useEffect(() => {
        const welcomeShown = localStorage.getItem('welcomeShown');
        if (!welcomeShown) {
            const timer = setTimeout(() => {
                openPopup('welcome');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [openPopup]);

    const clearSelection = () => setSelectedId(null);

    return (
        <div className="monitor">
            {isShuttingDown && <div className="shutdown-overlay"/>}
            <div className="monitor-bezel">
                <div className="monitor-screen-surround">
                    <div className="desktop" ref={desktopRef} onClick={clearSelection}>

                        <div className="desktop-icons-area">
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

                            {openPopups.map((popup, index) => {
                                if (popup.minimized) return null;

                                const config = (popupConfig as Record<string, any>)[popup.id] || {
                                    title: popup.id,
                                    icon: '📄',
                                    menu: [],
                                    resizable: true
                                };
                                const initialSize = popup.initialSize ?? config.initialSize;
                                const isResizable = popup.resizable ?? config.resizable ?? true;
                                const cascadeOffset = index * 20;
                                return (
                                    <PopupWindow
                                        key={popup.id}
                                        title={config.title}
                                        icon={config.icon}
                                        menuItems={config.menu}
                                        statusText={config.status}
                                        initialSize={initialSize}
                                        resizable={isResizable}
                                        cascadeOffset={cascadeOffset}
                                        zIndex={popup.zIndex}
                                        onClose={() => closePopup(popup.id)}
                                        onMinimize={() => minimizePopup(popup.id)}
                                        onFocus={() => bringToFront('popup', popup.id)}
                                        desktopRef={desktopRef}
                                    >
                                        <PopupContent popupId={popup.id} onClose={() => closePopup(popup.id)}/>
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
                        </div>{/* desktop-icons-area */}

                        <Taskbar
                            windows={allWindows}
                            topZ={topZ}
                            onWindowClick={handleTaskbarClick}
                            popupConfig={popupConfig}
                            onShutdown={handleShutdown}
                        />

                    </div>{/* desktop */}
                </div>{/* monitor-screen-surround */}
            </div>{/* monitor-bezel */}
        </div>
    );
};

export default Desktop;
