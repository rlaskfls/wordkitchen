import { motion } from "motion/react";
import type { LetterCollection } from "@/types/game";

interface LetterPoolProps {
  available: LetterCollection;
  onLetterClick: (letter: string) => void;
}

export default function LetterPool({
  available,
  onLetterClick,
}: LetterPoolProps) {
  // Build a flat list of letters sorted alphabetically
  const letters: { letter: string; count: number }[] = [];
  for (const [letter, count] of Object.entries(available)) {
    if (count > 0) {
      letters.push({ letter, count });
    }
  }
  letters.sort((a, b) => a.letter.localeCompare(b.letter));

  if (letters.length === 0) {
    return (
      <div className="text-sm text-[var(--text-tertiary)] py-4">
        No letters remaining
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 py-2 w-full">
      {letters.map(({ letter, count }) => (
        <motion.button
          key={letter}
          onClick={() => onLetterClick(letter)}
          className="relative flex items-center justify-center w-11 h-11 bg-white border border-[var(--border-color)] rounded-[var(--radius-sm)] font-mono text-base font-bold hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {letter}
          {count > 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] text-white text-[10px] font-mono rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
