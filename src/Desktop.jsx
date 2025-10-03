import React, { useState, useRef, useEffect } from "react";
import "./Desktop.css";

const GRID_SIZE = 80;
const ICON_SIZE = 64;

const initialIcons = [
    { name: "Portfolio", link: "/portfolio", icon: "💼", x: 20, y: 20, zIndex: 1 },
    { name: "Blog", link: "/blog", icon: "📓", x: 120, y: 20, zIndex: 1 },
    { name: "Contact", link: "/contact", icon: "📧", x: 220, y: 20, zIndex: 1 },
    { name: "GitHub", link: "https://github.com/mortenalbring", icon: "💻", x: 320, y: 20, zIndex: 1 },
];

export default function Desktop() {
    const desktopRef = useRef(null);
    const [icons, setIcons] = useState(initialIcons);
    const [dragging, setDragging] = useState(null); // { index, offsetX, offsetY }
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [topZ, setTopZ] = useState(1);

    // Global mouse handlers for dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragging) return;
            const desktopRect = desktopRef.current.getBoundingClientRect();

            let newX = e.clientX - desktopRect.left - dragging.offsetX;
            let newY = e.clientY - desktopRect.top - dragging.offsetY;

            // Snap to grid
            newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
            newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

            // Clamp inside desktop
            newX = Math.max(0, Math.min(newX, desktopRect.width - ICON_SIZE));
            newY = Math.max(0, Math.min(newY, desktopRect.height - ICON_SIZE));

            setIcons((prev) =>
                prev.map((icon, i) =>
                    i === dragging.index ? { ...icon, x: newX, y: newY } : icon
                )
            );
        };

        const handleMouseUp = () => setDragging(null);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    const handleMouseDown = (e, index) => {
        e.stopPropagation();

        // raise z-index for this icon (bring to front)
        const newTopZ = topZ + 1;
        setTopZ(newTopZ);
        setIcons((prev) => prev.map((icon, i) => (i === index ? { ...icon, zIndex: newTopZ } : icon)));

        const icon = icons[index];
        const desktopRect = desktopRef.current.getBoundingClientRect();
        setDragging({
            index,
            offsetX: e.clientX - desktopRect.left - icon.x,
            offsetY: e.clientY - desktopRect.top - icon.y,
        });

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
                onClick={() => setSelectedIndex(null)}
            >
                {icons.map((item, i) => (
                    <div
                        key={i}
                        className={`icon-wrapper ${selectedIndex === i ? "selected" : ""}`}
                        style={{
                            left: item.x,
                            top: item.y,
                            position: "absolute",
                            zIndex: item.zIndex || 1,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, i)}
                        onDoubleClick={() => handleDoubleClick(item.link)}
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
