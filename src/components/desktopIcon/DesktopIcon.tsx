import React, {CSSProperties, FC, MouseEvent, TouchEvent, useRef} from 'react';
import {FolderItem, OpenAction} from '../../types';

interface DesktopIconProps {
    item: FolderItem;
    selected: boolean;
    style: CSSProperties;
    onSelect: (id: string) => void;
    onOpen: (action: OpenAction) => void;
    onDragStart: (e: React.MouseEvent | React.TouchEvent, item: FolderItem) => void;
}

const DesktopIcon: FC<DesktopIconProps> = ({
                                               item,
                                               selected,
                                               style,
                                               onSelect,
                                               onOpen,
                                               onDragStart
                                           }) => {
    const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation();
        openItem();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(item.id);
        onDragStart?.(e, item);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
        e.stopPropagation();
        onSelect?.(item.id);
        onDragStart?.(e, item);
        // attempting to distinguis dragging from opening..
        if (touchTimeout.current) clearTimeout(touchTimeout.current);
        touchTimeout.current = setTimeout(() => {
            openItem();
        }, 200); 
    };

    const handleTouchMove = () => {
        // this cancels the tap-to-open if it moves. this might be jank?
        if (touchTimeout.current) {
            clearTimeout(touchTimeout.current);
            touchTimeout.current = null;
        }
    };

    const handleTouchEnd = () => {
        if (touchTimeout.current) {
            clearTimeout(touchTimeout.current);
            touchTimeout.current = null;
        }
    };

    const openItem = () => {
        if (item.children) {
            onOpen({type: 'folder', item});
        } else if (item.popup) {
            onOpen({
                type: 'popup',
                id: item.popup,
                initialSize: item.initialSize,
                resizable: item.resizable
            } as OpenAction);
        } else if (item.link) {
            window.open(item.link, '_blank');
        }
    };

    return (
        <div
            className={`icon-wrapper ${selected ? 'selected' : ''}`}
            style={style}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="icon">
                <div className="icon-image">{item.icon}</div>
                <div className="icon-label">{item.name}</div>
            </div>
        </div>
    );
};

export default DesktopIcon;
