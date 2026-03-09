export const GRID_ROWS = 40;
export const GRID_COLS = 64;
export const TILE_SIZE = 34;
export const TILE_GAP = 2;
export const CELL_W = 50;
export const CELL_H = 46;
export const PHASE1_DURATION = 300; // seconds
export const MIN_MATCH = 3;

// Animation durations in ms
export const HIGHLIGHT_DURATION = 100;
export const FLOAT_DURATION = 1200;
export const FLOAT_STAGGER = 80;
export const GRAVITY_DURATION = 850;
export const SWAP_DURATION = 200;
export const CASCADE_DELAY = 100;

// Scoring
export const MATCH_SCORES: Record<number, number> = {
  3: 30,
  4: 80,
  5: 150,
  6: 250,
};
export const CASCADE_MULTIPLIER = 1.5;

export const WORD_SCORES: Record<number, number> = {
  3: 100,
  4: 250,
  5: 500,
  6: 1000,
  7: 2000,
  8: 3000,
};
export const EXTRA_LETTER_BONUS = 500;
export const RARE_LETTER_MULTIPLIER = 2;
export const RARE_LETTERS = new Set(["J", "Q", "X", "Z"]);
