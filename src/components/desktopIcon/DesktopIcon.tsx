import React, {CSSProperties, FC, MouseEvent} from 'react';
import {FolderItem, OpenAction} from '../../types';

interface DesktopIconProps {
    item: FolderItem;
    selected: boolean;
    style: CSSProperties;
    onSelect: (id: string) => void;
    onOpen: (action: OpenAction) => void;
    onDragStart: (e: React.MouseEvent, item: FolderItem) => void;
}

const DesktopIcon: FC<DesktopIconProps> = ({
                                               item,
                                               selected,
                                               style,
                                               onSelect,
                                               onOpen,
                                               onDragStart
                                           }) => {
    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation();

        if (item.children) {
            onOpen({type: 'folder', item});
        } else if (item.popup) {
            onOpen({type: 'popup', id: item.popup, initialSize: item.initialSize} as OpenAction);
        } else if (item.link) {
            window.open(item.link, '_blank');
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(item.id);
        onDragStart?.(e, item);
    };

    return (
        <div
            className={`icon-wrapper ${selected ? 'selected' : ''}`}
            style={style}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
        >
            <div className="icon">
                <div className="icon-image">{item.icon}</div>
                <div className="icon-label">{item.name}</div>
            </div>
        </div>
    );
};

export default DesktopIcon;
