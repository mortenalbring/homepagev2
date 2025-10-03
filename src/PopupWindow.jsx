import React, { useState } from "react";
import "./PopupWindow.css";

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;

const PopupWindow = ({ title, children, onClose }) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 300, height: 200 });
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Drag window
    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    // Resize window
    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        setResizing(true);
        setOffset({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        } else if (resizing) {
            const newWidth = Math.max(MIN_WIDTH, size.width + (e.clientX - offset.x));
            const newHeight = Math.max(MIN_HEIGHT, size.height + (e.clientY - offset.y));
            setSize({ width: newWidth, height: newHeight });
            setOffset({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
    };

    return (
        <div
            className="popup-window"
            style={{ top: position.y, left: position.x, width: size.width, height: size.height }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Title bar */}
            <div className="popup-titlebar" onMouseDown={handleMouseDown}>
                <span className="popup-title">{title}</span>
                <button className="popup-close" onClick={onClose}>X</button>
            </div>

            {/* Content */}
            <div className="popup-content">{children}</div>

            {/* Resize handle */}
            <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
        </div>
    );
};

export default PopupWindow;
