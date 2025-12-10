import { FolderItem, IconPositions } from '../types';

/**
 * Builds initial icon positions from desktop items configuration.
 * Falls back to (10, 10) if no position is specified.
 */
export function buildInitialPositions(desktopItems: FolderItem[]): IconPositions {
  const positions: IconPositions = {};
  desktopItems.forEach(item => {
    positions[item.id] = item.position || { x: 10, y: 10 };
  });
  return positions;
}
