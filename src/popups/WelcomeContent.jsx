import React, {useState} from 'react';
import './WelcomeContent.css';

export function WelcomeContent({onClose}) {
    const [showAgain, setShowAgain] = useState(true);

    const handleClose = () => {
        console.log("showAgain", showAgain);
        if (!showAgain) {
            localStorage.setItem('welcomeShown', 'true');
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="welcome-container">
            
        
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
                    <h3>Did you know?</h3>
                    <ul>
                        <li>You can double-click icons to open windows</li>
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
        <div className="welcome-controls">
            
        </div>
        </div>
    );
}
