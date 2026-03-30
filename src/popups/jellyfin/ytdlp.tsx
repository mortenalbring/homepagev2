import React from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";


export function YtDlp() {

    const batchFileCode = `@echo off
setlocal
set YTDLP=yt-dlp.exe
set CONFIG=yt-dlp-config.txt
set URLS=urls.txt
%YTDLP% --config-location "%~dp0%CONFIG%" -a "%~dp0%URLS%"
pause`;


    return (
        <div className="popup-content-inner popup-content-sanserif">
            <h3>YT DLP</h3>
            <p>yt-dlp is a fantastic command-line tool for downloading offline copies of files from various sites.
                More details about that project can be found on its <a target="_blank" rel="noreferrer"
                                                                       href="https://github.com/yt-dlp/yt-dlp">GitHub
                    repo</a></p>

            <p>In this post I'd mostly like to share a few snippets that I've found useful for using yt-dlp to format
                for Jellyfin. </p>

            <p>I typically run yt-dlp from a bat file with two inputs, a URL file and a config file.</p>

            <SyntaxHighlighter language="batch" showLineNumbers={true} style={oneDark}>
                {batchFileCode}
            </SyntaxHighlighter>
        </div>
    );
}

