import foodWords from "@/data/foodWords.json";
import type { LetterCollection } from "@/types/game";

const wordSet = new Set(foodWords as string[]);

export function isValidFoodWord(word: string): boolean {
  return wordSet.has(word.toLowerCase());
}

export function canFormWord(
  word: string,
  available: LetterCollection
): boolean {
  const needed: Record<string, number> = {};
  for (const ch of word.toUpperCase()) {
    needed[ch] = (needed[ch] || 0) + 1;
  }
  return Object.entries(needed).every(
    ([letter, count]) => (available[letter] || 0) >= count
  );
}

export function getFoodWordCount(): number {
  return wordSet.size;
}
