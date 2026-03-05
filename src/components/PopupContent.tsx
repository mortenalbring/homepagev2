import React, { FC } from 'react';
import { NotFoundContent, popupRegistry } from '../popups';

interface PopupContentProps {
    popupId: string;
    onClose?: () => void;
    [key: string]: any;
}

/**
 * Renders content based on ID from popup registry
 */
const PopupContent: FC<PopupContentProps> = ({ popupId, onClose, ...otherProps }) => {
    const Component = popupRegistry[popupId];

    if (!Component) {
        return <NotFoundContent />;
    }

    return <Component onClose={onClose} {...otherProps} />;
};

export default PopupContent;
