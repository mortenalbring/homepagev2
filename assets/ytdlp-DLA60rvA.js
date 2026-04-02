import{j as t}from"./popup-portfolio-CRtqsDS_.js";import{o as e}from"./one-dark-BiIZG4QM.js";import{h as o}from"./vendor-syntax-Bd4hsABJ.js";import"./vendor-react-B3XCSsYE.js";function a(){return t.jsxs("div",{className:"popup-content-inner popup-content-sanserif",children:[t.jsx("h3",{children:"YT DLP"}),t.jsxs("p",{children:["yt-dlp is a fantastic command-line tool for downloading offline copies of files from various sites. More details about that project can be found on its ",t.jsx("a",{target:"_blank",rel:"noreferrer",href:"https://github.com/yt-dlp/yt-dlp",children:"GitHub repo"})]}),t.jsx("p",{children:"In this post I'd mostly like to share a few snippets that I've found useful for using yt-dlp to format for Jellyfin. "}),t.jsx("p",{children:"I typically run yt-dlp from a bat file with two inputs, a URL file and a config file."}),t.jsx(o,{language:"batch",showLineNumbers:!0,style:e,children:`@echo off
setlocal
set YTDLP=yt-dlp.exe
set CONFIG=yt-dlp-config.txt
set URLS=urls.txt
%YTDLP% --config-location "%~dp0%CONFIG%" -a "%~dp0%URLS%"
pause`})]})}export{a as YtDlp};
