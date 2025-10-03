import React, { useState, useRef, useEffect } from "react";
import "./Desktop.css";

const GRID_SIZE = 80;
const ICON_SIZE = 64;

const initialIcons = [
    { name: "Portfolio", link: "/portfolio", icon: "💼", x: 20, y: 20 },
    { name: "Blog", link: "/blog", icon: "📓", x: 120, y: 20 },
    { name: "Contact", link: "/contact", icon: "📧", x: 220, y: 20 },
    { name: "GitHub", link: "https://github.com/mortenalbring", icon: "💻", x: 320, y: 20 },
];

export default function Desktop() {
    const desktopRef = useRef(null);
    const [icons, setIcons] = useState(initialIcons);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [desktopBounds, setDesktopBounds] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (desktopRef.current) {
            const rect = desktopRef.current.getBoundingClientRect();
            setDesktopBounds({ width: rect.width, height: rect.height });
        }
    }, []);

    // Attach global mouse events during dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (draggingIndex === null) return;

            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;

            // Snap to grid
            newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
            newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

            // Clamp inside desktop
            newX = Math.max(0, Math.min(newX, desktopBounds.width - ICON_SIZE));
            newY = Math.max(0, Math.min(newY, desktopBounds.height - ICON_SIZE));

            setIcons((prev) =>
                prev.map((icon, i) =>
                    i === draggingIndex ? { ...icon, x: newX, y: newY } : icon
                )
            );
        };

        const handleMouseUp = () => {
            setDraggingIndex(null);
        };

        if (draggingIndex !== null) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [draggingIndex, offset, desktopBounds]);

    const handleMouseDown = (e, index) => {
        e.stopPropagation();
        const icon = icons[index];
        setDraggingIndex(index);
        setOffset({ x: e.clientX - icon.x, y: e.clientY - icon.y });
    };

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    const handleDoubleClick = (link) => {
        window.open(link, "_self");
    };

    return (
        <div className="monitor">
            <div className="desktop" ref={desktopRef} onClick={() => setSelectedIndex(null)}>
                {icons.map((item, i) => (
                    <div
                        key={i}
                        className={`icon-wrapper ${selectedIndex === i ? "selected" : ""}`}
                        style={{ left: item.x, top: item.y, position: "absolute" }}
                        onMouseDown={(e) => handleMouseDown(e, i)}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick(i);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleDoubleClick(item.link);
                        }}
                    >
                        <div className="icon">
                            <div className="icon-image">{item.icon}</div>
                            <div className="icon-label">{item.name}</div>
                        </div>
                    </div>
                ))}

                {/* Taskbar */}
                <div className="taskbar">
                    <button className="start-button">Start</button>
                    <div className="taskbar-time">12:00</div>
                </div>
            </div>
        </div>
    );
}
