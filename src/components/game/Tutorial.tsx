import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TutorialProps {
  onComplete: () => void;
}

const T = 34;
const GAP = 3;
const STEP = T + GAP;
const GRID3 = 3 * T + 2 * GAP;

const xy = (r: number, c: number) => ({ x: c * STEP, y: r * STEP });

type Phase = "idle" | "swap" | "settled" | "highlight" | "vanish" | "pause";

// ─── Shared tile renderer ───

interface DemoTile {
  id: string;
  letter: string;
  r: number;
  c: number;
  swapR?: number;
  swapC?: number;
  matched: boolean;
}

function renderTiles(
  tiles: DemoTile[],
  phase: Phase,
  tick: number,
  swapDur: number
) {
  const isSwap = phase === "swap";
  const post = phase === "settled" || phase === "highlight" || phase === "vanish" || phase === "pause";
  const hl = phase === "highlight" || phase === "vanish" || phase === "pause";
  const gone = phase === "vanish" || phase === "pause";

  return tiles.map((t) => {
    const base = xy(t.r, t.c);
    const hasMove = t.swapR !== undefined;
    const target = hasMove ? xy(t.swapR!, t.swapC!) : base;

    const dest = (isSwap || post) && hasMove ? target : base;
    const highlighted = hl && t.matched;
    const vanished = gone && t.matched;

    return (
      <motion.div
        key={`${t.id}-${tick}`}
        className="absolute flex items-center justify-center font-mono text-[15px] font-semibold select-none rounded-[3px]"
        style={{
          width: T,
          height: T,
          left: base.x,
          top: base.y,
          color: "var(--canvas-text)",
          border: `1.5px solid ${highlighted ? "var(--text-primary)" : "var(--border-color)"}`,
        }}
        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        animate={{
          x: dest.x - base.x,
          y: dest.y - base.y,
          opacity: vanished ? 0 : 1,
          scale: vanished ? 0.5 : highlighted ? 1.06 : 1,
          background: highlighted ? "var(--accent-light)" : "var(--bg-primary)",
        }}
        transition={{
          duration: isSwap && hasMove ? swapDur : 0.3,
          ease: "easeInOut",
        }}
      >
        {t.letter}
        {phase === "idle" && hasMove && (
          <motion.div
            className="absolute inset-[-3px] rounded-[5px]"
            style={{ border: "1.5px solid var(--text-tertiary)" }}
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  });
}

// ─── Demo 1: Row match — swap D↔A (vertical neighbors at (1,1)↔(2,1)) ───
//
//  Before:        Swap:              After:
//   C  E  B       C  E  B            C  E  B
//   A [D] A       A     A            A  A  A  ← row match!
//   F [A] G       F     G            F  D  G
//
// Tile "D" slides from (1,1) → (2,1). Tile "A" slides from (2,1) → (1,1).
// Letters stay on their tiles — never change.

const DEMO1: DemoTile[] = [
  { id: "0", letter: "C", r: 0, c: 0, matched: false },
  { id: "1", letter: "E", r: 0, c: 1, matched: false },
  { id: "2", letter: "B", r: 0, c: 2, matched: false },
  { id: "3", letter: "A", r: 1, c: 0, matched: true },
  { id: "4", letter: "D", r: 1, c: 1, swapR: 2, swapC: 1, matched: false },
  { id: "5", letter: "A", r: 1, c: 2, matched: true },
  { id: "6", letter: "F", r: 2, c: 0, matched: false },
  { id: "7", letter: "A", r: 2, c: 1, swapR: 1, swapC: 1, matched: true },
  { id: "8", letter: "G", r: 2, c: 2, matched: false },
];

function RowMatchDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [tick, setTick] = useState(0);
  const restart = useCallback(() => {
    setPhase("idle");
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase("swap"), 1000));
    t.push(setTimeout(() => setPhase("settled"), 1700));
    t.push(setTimeout(() => setPhase("highlight"), 1900));
    t.push(setTimeout(() => setPhase("vanish"), 2700));
    t.push(setTimeout(() => setPhase("pause"), 3300));
    t.push(setTimeout(restart, 4200));
    return () => t.forEach(clearTimeout);
  }, [tick, restart]);

  return (
    <div className="relative" style={{ width: GRID3, height: GRID3 }}>
      {renderTiles(DEMO1, phase, tick, 0.6)}
    </div>
  );
}

// ─── Demo 2: L-shape pattern ───
//
//  [A][A][A]      ← row 0: 3 A's
//  [A] D  E       ← col 0 extends down
//  [A] F  G
//
// Column 0 (A,A,A) + Row 0 (A,A,A) form an L sharing (0,0).
// Shows that the game recognizes L/T-shaped match patterns.

const DEMO2: DemoTile[] = [
  { id: "0", letter: "A", r: 0, c: 0, matched: true },
  { id: "1", letter: "A", r: 0, c: 1, matched: true },
  { id: "2", letter: "A", r: 0, c: 2, matched: true },
  { id: "3", letter: "A", r: 1, c: 0, matched: true },
  { id: "4", letter: "D", r: 1, c: 1, matched: false },
  { id: "5", letter: "E", r: 1, c: 2, matched: false },
  { id: "6", letter: "A", r: 2, c: 0, matched: true },
  { id: "7", letter: "F", r: 2, c: 1, matched: false },
  { id: "8", letter: "G", r: 2, c: 2, matched: false },
];

function LShapeDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [tick, setTick] = useState(0);
  const restart = useCallback(() => {
    setPhase("idle");
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase("highlight"), 900));
    t.push(setTimeout(() => setPhase("vanish"), 1900));
    t.push(setTimeout(() => setPhase("pause"), 2500));
    t.push(setTimeout(restart, 3500));
    return () => t.forEach(clearTimeout);
  }, [tick, restart]);

  return (
    <div className="relative" style={{ width: GRID3, height: GRID3 }}>
      {renderTiles(DEMO2, phase, tick, 0)}
    </div>
  );
}

// ─── Steps ───

const CONTENT_H = 280;

const steps = [
  {
    title: "Match Letters",
    body: "Swap adjacent tiles to line up 3 or more identical letters in a row. Matched letters disappear and get collected into your pot.",
    icon: <RowMatchDemo />,
  },
  {
    title: "Match Patterns",
    body: "Matches can also form in columns, L-shapes, and T-shapes. Larger patterns and cascading combos earn more points.",
    icon: <LShapeDemo />,
  },
  {
    title: "Navigate the Board",
    body: "Use two fingers to pinch-zoom and pan around the board. Drag tiles with one finger to swap them with a neighbor.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8 L24 4 M24 44 L24 40 M8 24 L4 24 M44 24 L40 24" opacity={0.3} />
        <circle cx="24" cy="24" r="10" fill="var(--accent-light)" />
        <path d="M20 20 L28 28 M28 20 L20 28" opacity={0.4} />
        <path d="M24 14 L24 10 M24 38 L24 34" strokeWidth={2} />
        <path d="M14 24 L10 24 M38 24 L34 24" strokeWidth={2} />
      </svg>
    ),
  },
  {
    title: "Collect & Cook",
    body: "Matched letters fall into the pot at the bottom. After time runs out, use collected letters to spell food words for bonus points.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 20 L10 36 Q10 42 16 42 L32 42 Q38 42 38 36 L38 20" fill="var(--accent-light)" />
        <line x1="8" y1="20" x2="40" y2="20" />
        <path d="M6 18 Q6 14 14 13 Q24 10 34 13 Q42 14 42 18" />
        <path d="M21 10 Q21 6 24 6 Q27 6 27 10" />
      </svg>
    ),
  },
  {
    title: "Beat the Clock",
    body: "You have 5 minutes to match as many letters as you can. Longer words and rare letters (J, Q, X, Z) earn extra points.\n\nGood luck!",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round">
        <circle cx="24" cy="26" r="16" fill="var(--accent-light)" />
        <line x1="24" y1="26" x2="24" y2="18" />
        <line x1="24" y1="26" x2="30" y2="26" />
        <line x1="24" y1="6" x2="24" y2="10" />
        <path d="M18 7 L24 6 L30 7" />
      </svg>
    ),
  },
];

// ─── Tutorial card ───

export default function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = steps[step]!;
  const isLast = step === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
      />

      <motion.div
        className="relative z-10 w-[320px] rounded-2xl border shadow-lg overflow-hidden"
        style={{
          background: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <button
          onClick={onComplete}
          className="absolute top-3 right-3 text-[11px] tracking-wide text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors z-20"
        >
          Skip
        </button>

        <div className="px-6 pt-6 pb-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                leave: (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="leave"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col items-center text-center gap-3"
              style={{ minHeight: CONTENT_H, paddingTop: 20 }}
            >
              <div
                className="flex items-center justify-center"
                style={{ height: GRID3, flexShrink: 0 }}
              >
                {current.icon}
              </div>
              <h3 className="text-base font-semibold tracking-tight">
                {current.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed text-[var(--text-secondary)]"
                style={{ minHeight: 60, whiteSpace: "pre-line" }}
              >
                {current.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-6 pb-5 pt-2 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-0"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12 L6 8 L10 4" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === step ? 16 : 6,
                  height: 6,
                  background: i === step ? "var(--text-primary)" : "var(--border-color)",
                }}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={onComplete}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={goNext}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4 L10 8 L6 12" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
