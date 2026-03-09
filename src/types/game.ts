export interface Tile {
  id: string;
  letter: string;
  row: number;
  col: number;
  isMatched: boolean;
  isNew: boolean;
}

export type Grid = (Tile | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Match {
  tiles: Position[];
  letter: string;
}

export interface LetterCollection {
  [letter: string]: number;
}

export type GamePhase =
  | "ready"
  | "matching"
  | "animating"
  | "wordbuilding"
  | "gameover";

export interface GameState {
  phase: GamePhase;
  grid: Grid;
  score: number;
  collectedLetters: LetterCollection;
  timeRemaining: number;
  selectedTile: Position | null;
  submittedWords: string[];
  comboMultiplier: number;
  isProcessing: boolean;
}

export interface AnimatingTile {
  id: string;
  letter: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

export type GameAction =
  | { type: "SELECT_TILE"; position: Position }
  | { type: "DESELECT_TILE" }
  | { type: "SWAP_TILES"; from: Position; to: Position }
  | { type: "SET_GRID"; grid: Grid }
  | { type: "RESOLVE_MATCHES"; matches: Match[] }
  | { type: "COLLECT_LETTERS"; letters: string[] }
  | { type: "ADD_SCORE"; points: number }
  | { type: "TICK_TIMER" }
  | { type: "END_MATCHING_PHASE" }
  | { type: "SUBMIT_WORD"; word: string; points: number }
  | { type: "RESET_GAME" }
  | { type: "SET_PROCESSING"; value: boolean }
  | { type: "START_GAME" }
  | { type: "FINISH_GAME" };
