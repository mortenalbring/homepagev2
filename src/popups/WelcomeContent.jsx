import React, { useState } from 'react';
import './WelcomeContent.css';

export function WelcomeContent({ onClose }) {
    const [showAgain, setShowAgain] = useState(true);

    const handleClose = () => {
        // Store preference in localStorage
        if (!showAgain) {
            localStorage.setItem('welcomeShown', 'true');
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="welcome-content">
            <div className="welcome-header">
                <div className="welcome-icon">🪟</div>
                <div className="welcome-text">
                    <h2>Welcome to Mortensoft 95</h2>
                    <p className="welcome-tagline">Where yesterday meets tomorrow</p>
                </div>
            </div>

            <div className="welcome-body">
                <div className="welcome-section">
                    <h3>Getting Started</h3>
                    <ul>
                        <li>Double-click icons to open windows</li>
                        <li>Drag windows by their title bars</li>
                        <li>Resize windows from the bottom-right corner</li>
                        <li>Use the taskbar to switch between open windows</li>
                    </ul>
                </div>

                <div className="welcome-section">
                    <h3>What's Inside</h3>
                    <ul>
                        <li><strong>Portfolio</strong> - View my work and projects</li>
                        <li><strong>Blog</strong> - Read my thoughts and experiences</li>
                        <li><strong>Contact</strong> - Get in touch with me</li>
                        <li><strong>Mortsweeper</strong> - Play a classic game!</li>
                    </ul>
                </div>

                <div className="welcome-tip">
                    <strong>Tip:</strong> Try clicking the Start button for quick access to shutdown!
                </div>
            </div>

            <div className="welcome-footer">
                <label className="welcome-checkbox">
                    <input
                        type="checkbox"
                        checked={showAgain}
                        onChange={(e) => setShowAgain(e.target.checked)}
                    />
                    Show this Welcome Screen next time
                </label>
                <button className="win95-button welcome-button" onClick={handleClose}>
                    OK
                </button>
            </div>
        </div>
    );
}
