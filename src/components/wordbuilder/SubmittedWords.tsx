import { motion, AnimatePresence } from "motion/react";
import { scoreWord } from "@/engine/scoring";

interface SubmittedWordsProps {
  words: string[];
}

export default function SubmittedWords({ words }: SubmittedWordsProps) {
  if (words.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        Words Found ({words.length})
      </span>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <AnimatePresence>
          {words.map((word, i) => (
            <motion.div
              key={`${word}-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[var(--border-color)] rounded-[var(--radius-sm)]"
            >
              <span className="text-xs font-mono font-medium">{word}</span>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                +{scoreWord(word)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
