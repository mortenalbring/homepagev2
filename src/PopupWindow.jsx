import React, { useState } from "react";
import "./PopupWindow.css";

const PopupWindow = ({ title, children, onClose }) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    return (
        <div
            className="popup-window"
            style={{
                top: position.y,
                left: position.x,
                position: "absolute",
                zIndex: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Title bar (draggable area) */}
            <div
                className="popup-titlebar"
                onMouseDown={handleMouseDown}
                style={{
                    cursor: "move",
                    background: "navy",
                    color: "white",
                    padding: "4px",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    userSelect: "none", // prevent accidental text highlighting
                }}
            >
                {title}
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: "8px",
                        background: "silver",
                        border: "1px solid black",
                        cursor: "pointer",
                    }}
                >
                    X
                </button>
            </div>

            {/* Window content (not draggable) */}
            <div className="popup-content" style={{ padding: "8px", background: "white", border: "2px solid gray" }}>
                {children}
            </div>
        </div>
    );
};

export default PopupWindow;
