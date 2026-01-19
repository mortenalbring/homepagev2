import React from 'react';
import {NotFoundContent, popupRegistry} from '../popups';

/**
 Renders stuff based on ID from popup registry (popups/index.tsx
 */
function PopupContent({popupId, onClose, ...otherProps}) {
    const Component = popupRegistry[popupId];

    if (!Component) {
        return <NotFoundContent/>;
    }

    return <Component onClose={onClose} {...otherProps} />;
}

export default PopupContent;
