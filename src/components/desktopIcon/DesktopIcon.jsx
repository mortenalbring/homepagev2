import React from 'react';

function DesktopIcon({
                         item,
                         selected,
                         style,
                         onSelect,
                         onOpen,
                         onDragStart
                     }) {
    const handleDoubleClick = (e) => {
        e.stopPropagation();

        if (item.children) {
            onOpen({type: 'folder', item});
        } else if (item.popup) {
            onOpen({type: 'popup', id: item.popup});
        } else if (item.link) {
            window.open(item.link, '_blank');
        }
    };

    const handleMouseDown = (e) => {
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
}

export default DesktopIcon;
