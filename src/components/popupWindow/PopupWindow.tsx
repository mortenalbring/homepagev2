import type {MouseEvent, TouchEvent, ReactNode, RefObject} from 'react';
import {useDragResize, useMaximize, useResizeConstraint} from '../../hooks';
import './PopupWindow.css';

interface PopupWindowProps {
    title: string;
    icon?: string;
    children: ReactNode;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
    desktopRef: RefObject<HTMLDivElement>;
    menuItems?: string[];
    statusText?: string;
    initialSize?: { width: number; height: number };
    cascadeOffset?: number;
    zIndex?: number;
}

const PopupWindow = ({
    title,
    icon,
    children,
    onClose,
    onMinimize,
    onFocus,
    desktopRef,
    menuItems,
    statusText,
    initialSize = {width: 400, height: 300},
    cascadeOffset = 0,
    zIndex = 100
}: PopupWindowProps) => {
    const initialPosition = {x: 100 + cascadeOffset, y: 50 + cascadeOffset};

    const {
        position,
        setPosition,
        size,
        setSize,
        handleDragStart,
        handleResizeStart
    } = useDragResize(desktopRef, initialPosition, initialSize);

    const {isMaximized, toggleMaximize} = useMaximize(
        desktopRef,
        position,
        size,
        setPosition,
        setSize
    );

    useResizeConstraint(desktopRef, size, setPosition, setSize);

    const handleMinimize = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onMinimize?.();
    };

    const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClose?.();
    };

    const handleWindowMouseDown = () => {
        onFocus?.();
    };

    return (
        <div
            className="popup-window"
            style={{
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                zIndex
            }}
            onMouseDown={handleWindowMouseDown}
        >
            <div className="popup-titlebar"
                 onMouseDown={(e) => handleDragStart(e, isMaximized)}
                 onTouchStart={(e) => handleDragStart(e, isMaximized)}>
                <span className="popup-title">
                    {icon && <span className="popup-title-icon">{icon}</span>}
                    {title}
                </span>
                <div className="popup-controls">
                    <button
                        className="popup-minimize"
                        onClick={handleMinimize}
                        title="Minimize"
                    ></button>
                    <button
                        className={`popup-maximize ${isMaximized ? 'restore' : ''}`}
                        onClick={toggleMaximize}
                        title={isMaximized ? "Restore" : "Maximize"}
                    ></button>
                    <button
                        className="popup-close"
                        onClick={handleClose}
                        title="Close"
                    ></button>
                </div>
            </div>

            {menuItems && menuItems.length > 0 && (
                <div className="popup-menubar">
                    {menuItems.map((item, index) => (
                        <span key={index} className="popup-menu-item">
                            <span className="menu-underline">{item.charAt(0)}</span>
                            {item.slice(1)}
                        </span>
                    ))}
                </div>
            )}

            <div className="popup-content">{children}</div>

            {statusText !== undefined && (
                <div className="popup-statusbar">
                    <div className="popup-status-section">{statusText}</div>
                </div>
            )}

            {!isMaximized && (
                <div
                    className="resize-handle"
                    onMouseDown={(e) => handleResizeStart(e, isMaximized)}
                    onTouchStart={(e) => handleResizeStart(e, isMaximized)}
                />
            )}
        </div>
    );
};

export default PopupWindow;
