import type { Grid, Position } from "@/types/game";
import { findMatches } from "./matcher";

export function isAdjacent(a: Position, b: Position): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

export function executeSwap(grid: Grid, from: Position, to: Position): Grid {
  const newGrid = grid.map(row => [...row]);
  const tileA = newGrid[from.row]![from.col]
    ? { ...newGrid[from.row]![from.col]!, row: to.row, col: to.col }
    : null;
  const tileB = newGrid[to.row]![to.col]
    ? { ...newGrid[to.row]![to.col]!, row: from.row, col: from.col }
    : null;
  newGrid[from.row]![from.col] = tileB;
  newGrid[to.row]![to.col] = tileA;
  return newGrid;
}

export function isValidSwap(grid: Grid, from: Position, to: Position): boolean {
  if (!isAdjacent(from, to)) return false;
  const swapped = executeSwap(grid, from, to);
  return findMatches(swapped).length > 0;
}
