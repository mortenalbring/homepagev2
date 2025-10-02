import React from "react";
import "./Desktop.css";

const icons = [
    { name: "My Portfolio", link: "/portfolio", icon: "💼" },
    { name: "Blog", link: "/blog", icon: "📓" },
    { name: "Contact", link: "/contact", icon: "📧" },
    { name: "GitHub", link: "https://github.com/mortenalbring", icon: "💻" },
];

export default function Desktop() {
    return (
        <div className="monitor">
            <div className="desktop">
                <div className="icons">
                    {icons.map((item, i) => (
                        <a key={i} href={item.link} className="icon">
                            <div className="icon-image">{item.icon}</div>
                            <div className="icon-label">{item.name}</div>
                        </a>
                    ))}
                </div>

                <div className="taskbar">
                    <button className="start-button">Start</button>
                    <div className="taskbar-time">12:00</div>
                </div>
            </div>
        </div>
    );
}
