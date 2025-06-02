/**
 * Given a JEN string and knowledge about the player who won,
 * calculate the cells that contribute to this win.
 * Yes I know this is mostly a duplicate of the win detection code in the backend. Duplication
 * is a deliberate decision in order to not clutter the backend or database with makeshift board representations
 * and not having to refactor the entire JSON communication (which would be a horrible time-vs-use tradeoff).
 * Boards are small enough that running O(n^2) twice isn't a practical problem.
 * @param {*} jen a jen string
 * @param {*} player the symbol of the player who won
 * @returns {Array} an Array containing 4 coordinate tupels representing the winning squares, or null if no win was found
 */

export default function getWinningCoordinates(jen, player) {
    const width = parseInt(jen.slice(0, 3), 10);
    const height = parseInt(jen.slice(3, 6), 10);
    const boardStr = jen.slice(7);

    const board = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push(boardStr[y * width + x]);
        }
        board.push(row);
    }

    // Horizontal
    for (let y = 0; y < height; y++) {
        for (let x = 0; x <= width - 4; x++) {
            if (
                board[y][x] === player &&
                board[y][x + 1] === player &&
                board[y][x + 2] === player &&
                board[y][x + 3] === player
            ) {
                return [
                    { x, y },
                    { x: x + 1, y },
                    { x: x + 2, y },
                    { x: x + 3, y },
                ];
            }
        }
    }

    // Vertical
    for (let x = 0; x < width; x++) {
        for (let y = 0; y <= height - 4; y++) {
            if (
                board[y][x] === player &&
                board[y + 1][x] === player &&
                board[y + 2][x] === player &&
                board[y + 3][x] === player
            ) {
                return [
                    { x, y },
                    { x, y: y + 1 },
                    { x, y: y + 2 },
                    { x, y: y + 3 },
                ];
            }
        }
    }

    // Diagonal ↘
    for (let x = 0; x <= width - 4; x++) {
        for (let y = 0; y <= height - 4; y++) {
            if (
                board[y][x] === player &&
                board[y + 1][x + 1] === player &&
                board[y + 2][x + 2] === player &&
                board[y + 3][x + 3] === player
            ) {
                return [
                    { x, y },
                    { x: x + 1, y: y + 1 },
                    { x: x + 2, y: y + 2 },
                    { x: x + 3, y: y + 3 },
                ];
            }
        }
    }

    // Diagonal ↙
    for (let x = 0; x <= width - 4; x++) {
        for (let y = 3; y < height; y++) {
            if (
                board[y][x] === player &&
                board[y - 1][x + 1] === player &&
                board[y - 2][x + 2] === player &&
                board[y - 3][x + 3] === player
            ) {
                return [
                    { x, y },
                    { x: x + 1, y: y - 1 },
                    { x: x + 2, y: y - 2 },
                    { x: x + 3, y: y - 3 },
                ];
            }
        }
    }

    return null; // no win found - likely draw
}
