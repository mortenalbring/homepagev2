import React from 'react';
import {NotFoundContent, popupRegistry} from '../popups';

/**
 Renders stuff based on ID from popup registry (popups/index.tsx
 */
function PopupContent({popupId}) {
    const Component = popupRegistry[popupId];

    if (!Component) {
        return <NotFoundContent/>;
    }

    return <Component/>;
}

export default PopupContent;
