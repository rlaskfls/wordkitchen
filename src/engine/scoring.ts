import type { Match } from "@/types/game";
import {
  MATCH_SCORES,
  WORD_SCORES,
  EXTRA_LETTER_BONUS,
  RARE_LETTERS,
  RARE_LETTER_MULTIPLIER,
} from "@/lib/constants";

export function scoreMatch(match: Match, comboMultiplier: number): number {
  const len = match.tiles.length;
  const base = MATCH_SCORES[Math.min(len, 6)] ?? MATCH_SCORES[6]!;
  return Math.round(base * comboMultiplier);
}

export function scoreMatches(matches: Match[], comboMultiplier: number): number {
  return matches.reduce((total, m) => total + scoreMatch(m, comboMultiplier), 0);
}

export function scoreWord(word: string): number {
  const len = word.length;
  let base: number;
  if (len <= 8) {
    base = WORD_SCORES[len] ?? WORD_SCORES[8]!;
  } else {
    base = WORD_SCORES[8]! + (len - 8) * EXTRA_LETTER_BONUS;
  }

  const hasRare = word
    .toUpperCase()
    .split("")
    .some((ch) => RARE_LETTERS.has(ch));

  return hasRare ? base * RARE_LETTER_MULTIPLIER : base;
}
