/**
 * A 2D position coordinate.
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Map of item IDs to their positions on the desktop.
 */
export interface IconPositions {
  [id: string]: Position;
}
