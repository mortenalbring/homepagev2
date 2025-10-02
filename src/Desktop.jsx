import React, { useState } from "react";
import "./Desktop.css";

const initialIcons = [
    { name: "My Portfolio", link: "/portfolio", icon: "💼", x: 20, y: 20 },
    { name: "Blog", link: "/blog", icon: "📓", x: 120, y: 20 },
    { name: "Contact", link: "/contact", icon: "📧", x: 220, y: 20 },
    { name: "GitHub", link: "https://github.com/mortenalbring", icon: "💻", x: 320, y: 20 },
];

export default function Desktop() {
    const [icons, setIcons] = useState(initialIcons);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [selectedIndex, setSelectedIndex] = useState(null);

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
        const newIcons = [...icons];
        newIcons[draggingIndex] = {
            ...newIcons[draggingIndex],
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        };
        setIcons(newIcons);
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
    };

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    const handleDoubleClick = (link) => {
        window.open(link, "_self"); // opens link in same tab
    };

    return (
        <div className="monitor">
            <div
                className="desktop"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={() => setSelectedIndex(null)} // deselect on desktop click
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
