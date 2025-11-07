// src/components/Desktop.jsx
import React, {useEffect, useRef, useState} from "react";
import PopupWindow from "./PopupWindow";
import "./Desktop.css"; 
import {ContactComponent} from "./ContactComponent";
import {BlogComponent} from "./BlogComponent";
import { useLocation, useNavigate } from "react-router-dom";

const GRID_SIZE = 80;
const ICON_SIZE = 64;

const initialIcons = [
    {name: "Portfolio", link: null, icon: "💼", x: 20, y: 20, zIndex: 1, opensPopup: "portfolio"},
    {name: "Blog", link: "/blog", icon: "📓", x: 120, y: 20, zIndex: 1, opensPopup: "blog"},
    {name: "Contact", link: null, icon: "📧", x: 220, y: 20, zIndex: 1, opensPopup: "contact"},
    {name: "GitHub", link: "https://github.com/mortenalbring", icon: "💻", x: 320, y: 20, zIndex: 1},
];

export default function Desktop() {
    const desktopRef = useRef(null);
    const [icons, setIcons] = useState(initialIcons);
    const [dragging, setDragging] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [topZ, setTopZ] = useState(1);

//tracking the routing stuff 
    const location = useLocation();
    const navigate = useNavigate();
    
    // Track which popups are open
    const [popups, setPopups] = useState([]); // [{id, zIndex}]


// Sync popup state with route
    useEffect(() => {
        if (location.pathname === "/blog") {
            setPopups(prev => {
                if (prev.find(p => p.id === "blog")) return prev; // already open
                const newTopZ = topZ + 1;
                setTopZ(newTopZ);
                return [...prev, { id: "blog", zIndex: newTopZ }];
            });
        } else {
            setPopups(prev => prev.filter(p => p.id !== "blog"));
        }
    }, [location.pathname, topZ]);    
    
    
    // Handle dragging icons
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragging) return;
            const desktopRect = desktopRef.current.getBoundingClientRect();

            let newX = e.clientX - desktopRect.left - dragging.offsetX;
            let newY = e.clientY - desktopRect.top - dragging.offsetY;

            newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
            newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

            newX = Math.max(0, Math.min(newX, desktopRect.width - ICON_SIZE));
            newY = Math.max(0, Math.min(newY, desktopRect.height - ICON_SIZE));

            setIcons((prev) =>
                prev.map((icon, i) =>
                    i === dragging.index ? {...icon, x: newX, y: newY} : icon
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
        const newTopZ = topZ + 1;
        setTopZ(newTopZ);
        setIcons((prev) =>
            prev.map((ic, i) => (i === index ? {...ic, zIndex: newTopZ} : ic))
        );

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
        if (item.opensPopup === "blog") {
            navigate("/blog");
        }
        
        if (item.opensPopup) {
            const popupId = item.opensPopup;
            const newTopZ = topZ + 1;
            setTopZ(newTopZ);
            setPopups((prev) => {
                // If popup already open, just bring it to front
                if (prev.find((p) => p.id === popupId)) {
                    return prev.map((p) =>
                        p.id === popupId ? {...p, zIndex: newTopZ} : p
                    );
                }
                // Otherwise, open a new one
                return [...prev, {id: popupId, zIndex: newTopZ}];
            });
            return;
        }
        if (item.link) window.open(item.link, "_self");
    };

    const closePopup = (id) => {

        if (id === "blog") navigate("/");
        setPopups((prev) => prev.filter((p) => p.id !== id));
        
        setPopups((prev) => prev.filter((p) => p.id !== id));
    };

    const bringPopupToFront = (id) => {
        const newTopZ = topZ + 1;
        setTopZ(newTopZ);
        setPopups((prev) =>
            prev.map((p) => (p.id === id ? {...p, zIndex: newTopZ} : p))
        );
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

                {/* Render all open popups */}
                {popups.map((popup) => (
                    <PopupWindow
                        key={popup.id}
                        title={popup.id === "portfolio" ? "Portfolio" : "Contact"}
                        onClose={() => closePopup(popup.id)}
                        zIndex={popup.zIndex}
                        desktopRef={desktopRef}
                        onFocus={() => bringPopupToFront(popup.id)}
                    >
                        {popup.id === "portfolio" && (
                            <div style={{padding: 8}}>
                                <h3>Welcome!</h3>
                                <p>This is my retro Portfolio window.</p>
                            </div>
                        )}
                        {popup.id === "contact" && (
                            <ContactComponent/>
                        )}
                        {popup.id === "blog" && (
                            <BlogComponent/>
                        )}
                        
                    </PopupWindow>
                ))}
            </div>
        </div>
    );
}
