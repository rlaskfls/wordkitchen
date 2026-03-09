import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BinProps {
  letter: string;
  count: number;
  dark?: boolean;
  onMeasure?: (letter: string, rect: DOMRect) => void;
}

export default function Bin({ letter, count, dark = false, onMeasure }: BinProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && onMeasure) {
      onMeasure(letter, ref.current.getBoundingClientRect());
    }
  });

  if (dark) {
    return (
      <div ref={ref} className="flex items-center gap-0.5 px-1.5 py-0.5">
        <span className="text-[11px] font-mono font-bold text-white/70">
          {letter}
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            className="text-[11px] font-mono text-white/40"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            {count > 0 ? count : ""}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-0.5 min-w-[28px]"
    >
      <span className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] font-mono">
        {letter}
      </span>
      <div className="w-7 h-7 rounded-[var(--radius-sm)] border border-dashed border-[var(--border-color)] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            className="text-xs font-mono font-bold"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            {count > 0 ? count : ""}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
