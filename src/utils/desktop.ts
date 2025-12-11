import {FolderItem, IconPositions} from '../types';

/**
 Sets initial icon positions
 */
export function buildInitialPositions(desktopItems: FolderItem[]): IconPositions {
    const positions: IconPositions = {};
    desktopItems.forEach(item => {
        positions[item.id] = item.position || {x: 10, y: 10};
    });
    return positions;
}
