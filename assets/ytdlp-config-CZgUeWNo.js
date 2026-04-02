import{j as e}from"./popup-portfolio-CRtqsDS_.js";import{o as t}from"./one-dark-BiIZG4QM.js";import{h as s}from"./vendor-syntax-Bd4hsABJ.js";import"./vendor-react-B3XCSsYE.js";function u(){return e.jsx("div",{className:"popup-content-inner popup-content-monospace-2",children:e.jsx(s,{language:"text",showLineNumbers:!0,style:t,children:`
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
`})})}export{u as YtDlpConfig};
