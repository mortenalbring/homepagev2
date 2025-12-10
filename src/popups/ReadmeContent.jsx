import React from 'react';
import './PopupStyles.css';
import {popupRegistry} from "./index";

export function ReadmeContent() {
  return (
    <div className="popup-content-inner popup-content-monospace">
      <p>README.txt</p>
      <p>-----------</p>
      <p>Welcome to Mortensoft 95</p>
        <p>This is a recreation of a classic OS desktop, but now in React!</p>
        <p>Currently features: </p>
        <p>- draggable icons that snap to a grid</p>
        <p>- resizeable and draggable 'windows'</p>
        <p>- maximize and minimize</p>
        <p>- folders (and subfolders!)</p>
        <p>- a semi-functional start-menu</p>
        <p>- a taskbar</p>
        <p>- a clock</p>
        <p>
            This uses React 18 and Typescript 4.9.
        </p>
        <p>
            To add new 'desktop icons', just add another entry to fileSystem.json and add the component reference to the popupRegistry  
        </p>
    </div>
  );
}
