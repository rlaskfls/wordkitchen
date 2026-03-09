import { motion, AnimatePresence } from "motion/react";

interface ScoreDisplayProps {
  score: number;
  label?: string;
  dark?: boolean;
}

export default function ScoreDisplay({
  score,
  label = "Score",
  dark = false,
}: ScoreDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-[10px] uppercase tracking-wider ${
          dark ? "text-white/40" : "text-[var(--text-secondary)]"
        }`}
      >
        {label}
      </span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={score}
          className={`font-mono text-lg font-bold tabular-nums ${
            dark ? "text-white" : ""
          }`}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {score.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
