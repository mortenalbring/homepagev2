import React, {useState} from 'react';
import './Mortsweeper.css';

// hardcoded 8x8 grid - 1 means mine, 0 means safe
// not random, just a fixed layout that's somewhat playable
const MINE_GRID = [
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1],
];

const GRID_SIZE = 8;

// counts how many mines are adjacent to a cell
function countAdjacentMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                count += MINE_GRID[nr][nc];
            }
        }
    }
    return count;
}

export function MortsweeperContent() {
    // tracks which cells have been revealed
    const [revealed, setRevealed] = useState(() =>
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
    );
    // tracks flagged cells (right click)
    const [flagged, setFlagged] = useState(() =>
        Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
    );
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const handleClick = (row, col) => {
        if (gameOver || won || flagged[row][col]) return;

        if (MINE_GRID[row][col] === 1) {
            // boom! reveal all mines
            setGameOver(true);
            setRevealed(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(true)));
            return;
        }

        // reveal this cell and maybe cascade if it's a 0
        const newRevealed = revealed.map(r => [...r]);
        revealCell(row, col, newRevealed);
        setRevealed(newRevealed);

        // check for win - all non-mine cells revealed
        checkWin(newRevealed);
    };

    // recursively reveal empty cells (the satisfying cascade thing)
    const revealCell = (row, col, grid) => {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
        if (grid[row][col]) return; // already revealed
        if (MINE_GRID[row][col] === 1) return; // don't reveal mines

        grid[row][col] = true;

        // if this cell has no adjacent mines, reveal neighbors too
        if (countAdjacentMines(row, col) === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    revealCell(row + dr, col + dc, grid);
                }
            }
        }
    };

    const handleRightClick = (e, row, col) => {
        e.preventDefault();
        if (gameOver || won || revealed[row][col]) return;

        const newFlagged = flagged.map(r => [...r]);
        newFlagged[row][col] = !newFlagged[row][col];
        setFlagged(newFlagged);
    };

    const checkWin = (revealedGrid) => {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                // if there's a non-mine cell that's not revealed, we haven't won yet
                if (MINE_GRID[r][c] === 0 && !revealedGrid[r][c]) {
                    return;
                }
            }
        }
        setWon(true);
    };

    const resetGame = () => {
        setRevealed(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)));
        setFlagged(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false)));
        setGameOver(false);
        setWon(false);
    };

    const renderCell = (row, col) => {
        const isRevealed = revealed[row][col];
        const isFlagged = flagged[row][col];
        const isMine = MINE_GRID[row][col] === 1;
        const adjacentMines = countAdjacentMines(row, col);

        let content = '';
        let className = 'mort-cell';

        if (isRevealed) {
            className += ' revealed';
            if (isMine) {
                content = '💥';
                className += ' mine';
            } else if (adjacentMines > 0) {
                content = adjacentMines;
                className += ` num-${adjacentMines}`;
            }
        } else if (isFlagged) {
            content = '🚩';
        }

        return (
            <button
                key={`${row}-${col}`}
                className={className}
                onClick={() => handleClick(row, col)}
                onContextMenu={(e) => handleRightClick(e, row, col)}
                disabled={isRevealed}
            >
                {content}
            </button>
        );
    };

    return (
        <div className="mortsweeper">
            <div className="mort-header">
                <div className="mort-face" onClick={resetGame}>
                    {gameOver ? '😵' : won ? '😎' : '🙂'}
                </div>
            </div>
            <div className="mort-grid">
                {Array(GRID_SIZE).fill(null).map((_, row) => (
                    <div key={row} className="mort-row">
                        {Array(GRID_SIZE).fill(null).map((_, col) => renderCell(row, col))}
                    </div>
                ))}
            </div>
            {(gameOver || won) && (
                <div className="mort-message">
                    {gameOver ? 'Game Over!' : 'You Win!'}
                </div>
            )}
        </div>
    );
}
