import React, { useState } from "react";
import "./PopupWindow.css";

export default function PopupWindow({ title, children, onClose }) {
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        });
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPos({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => setDragging(false);

    return (
        <div
            className="popup-window"
            style={{ top: pos.y, left: pos.x }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="popup-titlebar" onMouseDown={handleMouseDown}>
                <span>{title}</span>
                <button className="popup-close" onClick={onClose}>✕</button>
            </div>
            <div className="popup-content">{children}</div>
        </div>
    );
}
