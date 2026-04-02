import {ReactNode} from 'react';

interface LocalizedPopupFrameProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * Shared popup content frame to keep localized variants structurally identical.
 */
export function LocalizedPopupFrame({
    title,
    children,
    className = 'popup-content-monospace'
}: LocalizedPopupFrameProps) {
    return (
        <div className={`popup-content-inner ${className}`}>
            <h3>{title}</h3>
            {children}
        </div>
    );
}

