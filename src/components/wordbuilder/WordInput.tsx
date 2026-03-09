import { motion } from "motion/react";

interface WordInputProps {
  letters: string[];
  onRemove: (index: number) => void;
  onClear: () => void;
  onSubmit: () => void;
  shake: boolean;
  error: string | null;
}

export default function WordInput({
  letters,
  onRemove,
  onClear,
  onSubmit,
  shake,
  error,
}: WordInputProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <motion.div
        className="flex items-center justify-center gap-1 min-h-[52px] w-full max-w-md px-3 py-2 bg-white border border-[var(--border-color)] rounded-[var(--radius-md)]"
        animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {letters.length === 0 ? (
          <span className="text-xs h-fit text-[var(--text-tertiary)]">
            Click letters to build a word...
          </span>
        ) : (
          letters.map((letter, i) => (
            <motion.button
              key={`${letter}-${i}`}
              onClick={() => onRemove(i)}
              className="flex items-center justify-center w-10 h-10 bg-[var(--accent-light)] border border-[var(--border-color)] rounded-[var(--radius-sm)] font-mono text-base font-bold hover:bg-[var(--danger)] hover:text-white hover:border-[var(--danger)] transition-colors cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {letter}
            </motion.button>
          ))
        )}
      </motion.div>

      {error && (
        <motion.span
          className="text-xs text-[var(--danger)] font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      )}

      <div className="flex items-center gap-2">
        {letters.length > 0 && (
          <>
            <button
              onClick={onClear}
              className="px-4 py-2 text-xs border border-[var(--border-color)] rounded-[336px] text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2 text-xs bg-[var(--accent)] text-white rounded-[336px] font-medium hover:opacity-90 transition-opacity"
            >
              Submit Word
            </button>
          </>
        )}
      </div>
    </div>
  );
}
