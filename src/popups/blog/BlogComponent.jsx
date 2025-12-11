import React from "react";
import "./BlogComponent.css";

export function BlogComponent() {
    return (
        <div className="blog-content">
            <div className="blog-header">
                <span className="blog-icon">📓</span>
                <h3 className="blog-title">Notepad</h3>
            </div>
            <div className="blog-text">
                <p>Welcome to my blog!</p>
                <p>---</p>
                <p>Coming soon...</p>
                <p>&nbsp;</p>
                <p>Check back later for updates!</p>
            </div>
        </div>
    );
}