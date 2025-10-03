// src/components/PopupWindow.jsx
import React, { useState, useEffect } from "react";
import "./PopupWindow.css";

export default function PopupWindow({ title, children, onClose, zIndex, onFocus }) {
    const [pos, setPos] = useState({ x: 120, y: 80 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e) => {
            if (!dragging) return;
            setPos({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        };
        const handleUp = () => setDragging(false);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, [dragging, offset]);

    const startDrag = (e) => {
        e.preventDefault();
        setDragging(true);
        const rect = e.currentTarget.parentElement.getBoundingClientRect();
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        if (onFocus) onFocus();
    };

    return (
        <div
            className="popup-window"
            style={{ left: pos.x, top: pos.y, zIndex }}
            onMouseDown={onFocus}
        >
            <div className="popup-titlebar" onMouseDown={startDrag}>
                <span className="popup-title-text">{title}</span>
                <button className="popup-close" onClick={onClose}>✕</button>
            </div>
            <div className="popup-content">{children}</div>
        </div>
    );
}
