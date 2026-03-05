import React, {useEffect, useState} from "react";
import "./PopupWindow.css";

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;

/*
The fake 'windows'
 */
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
        e.stopPropagation();
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


    useEffect(() => {
        // Constrain popup position/size to desktop bounds on window resize
        const handleResize = () => {
            console.log(`[${title}] Resize handler fired`);
            if (!desktopRef || !desktopRef.current) return;

            const desktopRect = desktopRef.current.getBoundingClientRect();
            const TITLE_BAR_HEIGHT = 22;

            setPosition(currentPosition => {
                let newPosition = {...currentPosition};
                let changed = false;

                // Constrain right edge
                if (newPosition.x + size.width > desktopRect.width) {
                    newPosition.x = Math.max(0, desktopRect.width - size.width);
                    changed = true;
                }

                // Constrain bottom edge
                if (newPosition.y + size.height > desktopRect.height) {
                    newPosition.y = Math.max(TITLE_BAR_HEIGHT, desktopRect.height - size.height);
                    changed = true;
                }

                // Constrain left edge
                if (newPosition.x < 0) {
                    newPosition.x = 0;
                    changed = true;
                }

                // Constrain top edge
                if (newPosition.y < 0) {
                    newPosition.y = 0;
                    changed = true;
                }

                if (changed) {
                    console.log(`[${title}] Position constrained: from`, currentPosition, 'to', newPosition);
                }
                return changed ? newPosition : currentPosition;
            });

            setSize(currentSize => {
                let newSize = {...currentSize};
                let changed = false;

                // If popup is too large for desktop, shrink it
                if (newSize.width > desktopRect.width) {
                    newSize.width = Math.max(MIN_WIDTH, desktopRect.width);
                    changed = true;
                }

                if (newSize.height > desktopRect.height - TITLE_BAR_HEIGHT) {
                    newSize.height = Math.max(MIN_HEIGHT, desktopRect.height - TITLE_BAR_HEIGHT);
                    changed = true;
                }

                if (changed) {
                    console.log(`[${title}] Size constrained: from`, currentSize, 'to', newSize);
                }
                return changed ? newSize : currentSize;
            });
        };

        console.log(`[${title}] Attaching resize listener (dependency: desktopRef)`);
        window.addEventListener('resize', handleResize);
        return () => {
            console.log(`[${title}] Removing resize listener`);
            window.removeEventListener('resize', handleResize);
        };
    }, [desktopRef]);

    useEffect(() => {
        // Dragging and resizing
        if (!dragging && !resizing) {
            return;
        }

        const handleMouseMove = (e) => {
            if (dragging) {
                setPosition({x: e.clientX - offset.x, y: e.clientY - offset.y});
            } else if (resizing) {
                const newWidth = Math.max(MIN_WIDTH, size.width + (e.clientX - offset.x));
                const newHeight = Math.max(MIN_HEIGHT, size.height + (e.clientY - offset.y));
                setSize({width: newWidth, height: newHeight});
                //this was the key! store the mouse position, and calc the delta between current pos and offset
                //makes resizing incremental, rather than the jaggedy stuff it was doing before 
                setOffset({x: e.clientX, y: e.clientY});
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            setResizing(false);
        };

        //yes! this fixed some of the issues with dragging too quickly
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, resizing, offset, size]);

    const toggleMaximize = () => {
        if (!desktopRef || !desktopRef.current) {
            return;
        }

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

    const handleMinimize = (e) => {
        e.stopPropagation();
        if (onMinimize) {
            onMinimize();
        }
    };

    const handleWindowMouseDown = () => {
        onFocus?.();
    };

    const handleClose = (e) => {
        e.stopPropagation();
        onClose?.();
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
                        onClick={handleClose}
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
