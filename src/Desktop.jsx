import React, { useState, useRef, useEffect } from "react";
import "./Desktop.css";

const GRID_SIZE = 80; // pixels
const ICON_SIZE = 48; // icon height/width (emoji)

const initialIcons = [
    { name: "My Portfolio", link: "/portfolio", icon: "💼", x: 20, y: 20 },
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

    // Get desktop size after mounting
    useEffect(() => {
        if (desktopRef.current) {
            const rect = desktopRef.current.getBoundingClientRect();
            setDesktopBounds({ width: rect.width, height: rect.height });
        }
    }, []);

    const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

    const handleMouseDown = (e, index) => {
        e.stopPropagation();
        const icon = icons[index];
        setDraggingIndex(index);
        setOffset({
            x: e.clientX - icon.x,
            y: e.clientY - icon.y,
        });
    };

    const handleMouseMove = (e) => {
        if (draggingIndex === null) return;

        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        // Snap to grid
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);

        // Clamp inside desktop boundaries
        newX = clamp(newX, 0, desktopBounds.width - ICON_SIZE);
        newY = clamp(newY, 0, desktopBounds.height - ICON_SIZE);

        const newIcons = [...icons];
        newIcons[draggingIndex] = { ...newIcons[draggingIndex], x: newX, y: newY };
        setIcons(newIcons);
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
    };

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    const handleDoubleClick = (link) => {
        window.open(link, "_self");
    };

    return (
        <div className="monitor">
            <div
                className="desktop"
                ref={desktopRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={() => setSelectedIndex(null)}
            >
                {icons.map((item, i) => (
                    <div
                        key={i}
                        className={`icon-wrapper ${selectedIndex === i ? "selected" : ""}`}
                        style={{ position: "absolute", left: item.x, top: item.y }}
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

                <div className="taskbar">
                    <button className="start-button">Start</button>
                    <div className="taskbar-time">12:00</div>
                </div>
            </div>
        </div>
    );
}
