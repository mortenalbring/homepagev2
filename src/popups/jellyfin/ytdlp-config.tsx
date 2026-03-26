import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';


export function YtDlpConfig() {

    const code = `
# Jellyfin-safe TV layout (robust against NA metadata)

--output "%(series)s/Sesong %(season_number)d/S%(season_number)02dE%(episode_number)02d - %(title)s.%(ext)s"
--merge-output-format mp4
--windows-filenames
--write-info-json
--write-thumbnail
--write-description
--no-overwrites

# Subtitles
--write-subs
--sub-langs nb,all
--convert-subs srt

--progress
--console-title
`;


    return (
        <div className="popup-content-inner popup-content-monospace-2">
                <SyntaxHighlighter language="text" showLineNumbers={true} style={oneDark}>
                    {code}
                </SyntaxHighlighter>
         
        </div>
    );
}

