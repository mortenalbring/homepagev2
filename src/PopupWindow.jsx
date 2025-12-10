import React, {useState} from "react";
import "./PopupWindow.css";

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;

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
    zIndex = 100
}) => {
    const [position, setPosition] = useState({x: 100, y: 50});
    const [size, setSize] = useState(initialSize);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [isMaximized, setIsMaximized] = useState(false);
    const [prevState, setPrevState] = useState(null);

    const handleMouseDown = (e) => {
        if (!isMaximized) {
            setDragging(true);
            setOffset({x: e.clientX - position.x, y: e.clientY - position.y});
        }
    };

    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        if (!isMaximized) {
            setResizing(true);
            setOffset({x: e.clientX, y: e.clientY});
        }
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({x: e.clientX - offset.x, y: e.clientY - offset.y});
        } else if (resizing) {
            const newWidth = Math.max(MIN_WIDTH, size.width + (e.clientX - offset.x));
            const newHeight = Math.max(MIN_HEIGHT, size.height + (e.clientY - offset.y));
            setSize({width: newWidth, height: newHeight});
            setOffset({x: e.clientX, y: e.clientY});
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
    };

    const toggleMaximize = () => {
        if (!desktopRef || !desktopRef.current) return;
        const desktopRect = desktopRef.current.getBoundingClientRect();

        if (!isMaximized) {
            setPrevState({position: {...position}, size: {...size}});
            const borderOffset = 40;
            setPosition({x: borderOffset, y: borderOffset});
            setSize({
                width: desktopRect.width - borderOffset * 3,
                height: desktopRect.height - borderOffset * 3,
            });
            setIsMaximized(true);
        } else {
            if (prevState) {
                setPosition(prevState.position);
                setSize(prevState.size);
            }
            setIsMaximized(false);
        }
    };

    const handleMinimize = () => {
        if (onMinimize) {
            onMinimize();
        }
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="popup-titlebar" onMouseDown={handleMouseDown}>
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
                        onClick={onClose}
                        title="Close"
                    ></button>
                </div>
            </div>

            {/* menu stuff (File, Edit). doesn't do anything (yet) */}
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

            {/* this handle needs some work */}
            {!isMaximized && <div className="resize-handle" onMouseDown={handleResizeMouseDown}/>}
        </div>
    );
};

export default PopupWindow;
