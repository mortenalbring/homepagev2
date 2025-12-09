import React from "react";
import "./ContactComponent.css";

export function ContactComponent() {
    return (
        <div className="contact-content">
            <div className="win95-groupbox">
                <legend>Contact Information</legend>
                <div className="contact-item">
                    <span className="contact-icon">🔗</span>
                    <span className="contact-label">LinkedIn:</span>
                    <a
                        href="https://uk.linkedin.com/in/morten-albring-78738052/no"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="win95-link"
                    >
                        morten-albring
                    </a>
                </div>
                <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span className="contact-label">Email:</span>
                    <a
                        href="mailto:mortenalbring+contact@gmail.com"
                        className="win95-link"
                    >
                        mortenalbring@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}