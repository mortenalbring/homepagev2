import React from 'react';
import { ContactComponent } from './ContactComponent';
import { BlogComponent } from './BlogComponent';

// Renders content for a popup based on its ID
function PopupContent({ popupId }) {
  switch (popupId) {
    case 'portfolio':
      return (
        <div style={{ padding: 8 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>Welcome!</h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            This is my retro Portfolio window.
          </p>
        </div>
      );

    case 'contact':
      return <ContactComponent />;

    case 'blog':
      return <BlogComponent />;

    case 'readme':
      return (
        <div style={{ padding: 8, fontFamily: 'Fixedsys, Courier New, monospace' }}>
          <p style={{ margin: '0 0 8px 0' }}>README.txt</p>
          <p style={{ margin: '0 0 8px 0' }}>-----------</p>
          <p style={{ margin: 0 }}>Welcome to my Windows 95 themed portfolio site!</p>
        </div>
      );

    case 'site-redesign':
    case 'api-work':
    case 'experiments':
    case 'old-stuff':
      return (
        <div style={{ padding: 8 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
            {popupId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Project details coming soon...
          </p>
        </div>
      );

    default:
      return (
        <div style={{ padding: 8 }}>
          <p>Content not found</p>
        </div>
      );
  }
}

export default PopupContent;
