// src/components/Desktop.jsx
import React, { useState, useRef, useEffect } from "react";
import PopupWindow from "./PopupWindow";
import "./Desktop.css";

const GRID_SIZE = 80;
const ICON_SIZE = 64; // used for clamping; matches your CSS/icon size roughly

const initialIcons = [
    { name: "Portfolio", link: "/portfolio", icon: "💼", x: 20, y: 20, zIndex: 1, opensPopup: true },
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
    const [showPortfolio, setShowPortfolio] = useState(false);

    // Global mouse handlers for dragging (attach once, check 'dragging')
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragging) return;
            const desktopRect = desktopRef.current.getBoundingClientRect();

            let newX = e.clientX - desktopRect.left - dragging.offsetX;
            let newY = e.clientY - desktopRect.top - dragging.offsetY;

            // Snap to grid
            newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
            newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

            // Clamp inside desktop area
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
        // bring to front
        const newTopZ = topZ + 1;
        setTopZ(newTopZ);
        setIcons((prev) => prev.map((ic, i) => (i === index ? { ...ic, zIndex: newTopZ } : ic)));

        const icon = icons[index];
        const desktopRect = desktopRef.current.getBoundingClientRect();

        setDragging({
            index,
            offsetX: e.clientX - desktopRect.left - icon.x,
            offsetY: e.clientY - desktopRect.top - icon.y,
        });

        setSelectedIndex(index);
    };

    const handleDoubleClick = (item, e) => {
        e.stopPropagation();
        if (item.opensPopup) {
            setShowPortfolio(true);
            return;
        }
        // otherwise open link (same tab)
        if (item.link) window.open(item.link, "_self");
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
                        onDoubleClick={(e) => handleDoubleClick(item, e)}
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

                {/* Portfolio popup */}
                {showPortfolio && (
                    <PopupWindow
                        title="Portfolio"
                        onClose={() => setShowPortfolio(false)}
                    >
                        <div style={{ padding: 8 }}>
                            <h3 style={{ margin: "0 0 8px 0" }}>Welcome!</h3>
                            <p style={{ margin: 0 }}>
                                This is a retro Portfolio popup. Put projects, links or images here.
                            </p>
                        </div>
                    </PopupWindow>
                )}
            </div>
        </div>
    );
}
