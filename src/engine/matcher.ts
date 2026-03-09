import type { Grid, Match, Position } from "@/types/game";
import { GRID_ROWS, GRID_COLS, MIN_MATCH } from "@/lib/constants";

export function findMatches(grid: Grid): Match[] {
  const matched = new Set<string>();
  const matches: Match[] = [];

  const key = (r: number, c: number) => `${r},${c}`;

  // Horizontal scan
  for (let r = 0; r < GRID_ROWS; r++) {
    let runStart = 0;
    for (let c = 1; c <= GRID_COLS; c++) {
      const current = c < GRID_COLS ? grid[r]?.[c] : null;
      const start = grid[r]?.[runStart];
      if (current && start && current.letter === start.letter) continue;

      const runLen = c - runStart;
      if (runLen >= MIN_MATCH && start) {
        const tiles: Position[] = [];
        for (let i = runStart; i < c; i++) {
          tiles.push({ row: r, col: i });
          matched.add(key(r, i));
        }
        matches.push({ tiles, letter: start.letter });
      }
      runStart = c;
    }
  }

  // Vertical scan
  for (let c = 0; c < GRID_COLS; c++) {
    let runStart = 0;
    for (let r = 1; r <= GRID_ROWS; r++) {
      const current = r < GRID_ROWS ? grid[r]?.[c] : null;
      const start = grid[runStart]?.[c];
      if (current && start && current.letter === start.letter) continue;

      const runLen = r - runStart;
      if (runLen >= MIN_MATCH && start) {
        const tiles: Position[] = [];
        for (let i = runStart; i < r; i++) {
          tiles.push({ row: i, col: c });
          matched.add(key(i, c));
        }
        matches.push({ tiles, letter: start.letter });
      }
      runStart = r;
    }
  }

  // 2x2 square scan
  for (let r = 0; r < GRID_ROWS - 1; r++) {
    for (let c = 0; c < GRID_COLS - 1; c++) {
      const tl = grid[r]?.[c];
      const tr = grid[r]?.[c + 1];
      const bl = grid[r + 1]?.[c];
      const br = grid[r + 1]?.[c + 1];
      if (tl && tr && bl && br &&
          tl.letter === tr.letter &&
          tl.letter === bl.letter &&
          tl.letter === br.letter) {
        const positions: Position[] = [
          { row: r, col: c }, { row: r, col: c + 1 },
          { row: r + 1, col: c }, { row: r + 1, col: c + 1 },
        ];
        // Only add if not all already matched (avoid pure duplicates)
        const allAlreadyMatched = positions.every(p => matched.has(key(p.row, p.col)));
        if (!allAlreadyMatched) {
          for (const p of positions) matched.add(key(p.row, p.col));
          matches.push({ tiles: positions, letter: tl.letter });
        }
      }
    }
  }

  return matches;
}

export function getAllMatchedPositions(matches: Match[]): Set<string> {
  const set = new Set<string>();
  for (const match of matches) {
    for (const tile of match.tiles) {
      set.add(`${tile.row},${tile.col}`);
    }
  }
  return set;
}

export function getMatchedLetters(matches: Match[]): string[] {
  const letters: string[] = [];
  const counted = new Set<string>();
  for (const match of matches) {
    for (const tile of match.tiles) {
      const k = `${tile.row},${tile.col}`;
      if (!counted.has(k)) {
        counted.add(k);
        letters.push(match.letter);
      }
    }
  }
  return letters;
}
