import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import Desktop from './components/desktop/Desktop';
import './i18n';
import './index.css';

const syncViewportHeightVar = () => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--app-vh', `${Math.round(viewportHeight)}px`);
};

syncViewportHeightVar();
window.addEventListener('resize', syncViewportHeightVar, {passive: true});
window.addEventListener('orientationchange', syncViewportHeightVar);
window.visualViewport?.addEventListener('resize', syncViewportHeightVar);


const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Desktop/>
        </BrowserRouter>
    </React.StrictMode>
);

