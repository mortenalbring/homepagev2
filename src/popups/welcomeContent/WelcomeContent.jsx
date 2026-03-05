import React, {useState} from 'react';
import './WelcomeContent.css';

const WELCOME_SCREENS = [
    {
        title: 'Welcome to Mortensoft 95',
        tagline: 'Where yesterday meets tomorrow',
        heading: 'Getting Started',
        content: [
            'Double-click icons on the desktop to open windows',
            'Click and drag windows to move them around',
            'Resize windows using the resize handle in the bottom-right corner',
            'Icons will not go off the side of the desktop anymore!'
        ]
    },
    {
        title: 'Desktop Tips',
        tagline: 'Master the desktop',
        heading: 'Icon Management',
        content: [
            'Drag desktop icons around!',
            'Icons snap to a grid for neat alignment',
            'Single-click to select, double-click to open'
        ]
    },
    {
        title: 'Window Management',
        tagline: 'Control your windows',
        heading: 'Window Controls',
        content: [
            'Drag windows by their title bar to move them',
            'Click minimize (−) to hide a window to the taskbar',
            'Click maximize (□) to fill the screen',
            'Click close (×) to close the window'
        ]
    },
    {
        title: 'Customization',
        tagline: 'Make it your own',
        heading: 'Features',
        content: [
            'The desktop is fully responsive - resize your browser!',
            'Windows automatically stay within bounds',
            'Each popup has its own configurable initial size'
        ]
    }
];

export function WelcomeContent({onClose}) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [showAgain, setShowAgain] = useState(true);

    const screen = WELCOME_SCREENS[currentScreen];
    const isFirstScreen = currentScreen === 0;
    const isLastScreen = currentScreen === WELCOME_SCREENS.length - 1;

    const handlePrevious = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleNext = () => {
        if (currentScreen < WELCOME_SCREENS.length - 1) {
            setCurrentScreen(currentScreen + 1);
        }
    };

    const handleClose = () => {
        if (!showAgain) {
            localStorage.setItem('welcomeShown', 'true');
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-sidebar">
                <div className="welcome-sidebar-content">
                    <div className="welcome-logo">🪟</div>
                    <h1>Mortensoft 95</h1>
                </div>
            </div>

            <div className="welcome-main">
                <div className="welcome-body">
                    <h2>{screen.title}</h2>
                    <p className="welcome-tagline">{screen.tagline}</p>

                    <div className="welcome-section">
                        <h3>{screen.heading}</h3>
                        <ul>
                            {screen.content.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="welcome-tip">
                        <strong>💡 Screen {currentScreen + 1} of {WELCOME_SCREENS.length}</strong>
                    </div>
                </div>

                <div className="welcome-footer">
                    <label className="welcome-checkbox">
                        <input
                            type="checkbox"
                            checked={showAgain}
                            onChange={(e) => setShowAgain(e.target.checked)}
                        />
                        Show this Welcome Screen on startup
                    </label>
                    <div className="welcome-buttons">
                        <button
                            className="win95-button welcome-button"
                            onClick={handlePrevious}
                            disabled={isFirstScreen}
                        >
                            &lt; Back
                        </button>
                        <button
                            className="win95-button welcome-button"
                            onClick={handleNext}
                            disabled={isLastScreen}
                        >
                            Next &gt;
                        </button>
                        <button
                            className="win95-button welcome-button welcome-button-finish"
                            onClick={handleClose}
                        >
                            {isLastScreen ? 'Finish' : 'OK'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
