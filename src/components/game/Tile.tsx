import { motion } from "motion/react";
import type { Tile as TileType } from "@/types/game";
import { CELL_W, CELL_H } from "@/lib/constants";

interface TileProps {
  tile: TileType;
  row: number;
  col: number;
  isDragging: boolean;
  dragDx: number;
  dragDy: number;
  isMatched: boolean;
  floatTo?: { x: number; y: number } | null;
  floatDelay?: number;
  fallDistance?: number;
  fallDelay?: number;
}

export default function Tile({
  tile,
  row,
  col,
  isDragging,
  dragDx,
  dragDy,
  isMatched,
  floatTo,
  floatDelay = 0,
  fallDistance = 0,
  fallDelay = 0,
}: TileProps) {
  const left = col * CELL_W;
  const top = row * CELL_H;

  const animateProps =
    isMatched && floatTo
      ? {
          left,
          top,
          x: floatTo.x,
          y: floatTo.y,
          scale: 0.3,
          opacity: 0,
          transition: {
            duration: 1.2,
            delay: floatDelay,
            ease: [0.25, 0.1, 0.25, 1] as const,
          },
        }
      : isDragging
      ? {
          left: left + dragDx,
          top: top + dragDy,
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1.08,
          transition: { duration: 0 },
        }
      : {
          left,
          top,
          y: 0,
          opacity: 1,
          scale: 1,
          x: 0,
          transition:
            fallDistance > 0
              ? {
                  type: "spring" as const,
                  stiffness: 100,
                  damping: 22,
                  mass: 1.8,
                  delay: fallDelay,
                }
              : {
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 25,
                },
        };

  const initialProps = isMatched
    ? { left, top, x: 0, y: 0, opacity: 1, scale: 1 }
    : fallDistance > 0
    ? { left, top, y: -fallDistance * CELL_H, x: 0, opacity: 1, scale: 1 }
    : false;

  return (
    <motion.div
      className={`
        absolute flex items-center justify-center select-none
        font-mono text-[19px] tracking-wide text-[var(--canvas-text)]
        ${isDragging ? "z-10 font-extrabold" : "font-medium"}
      `}
      style={{
        width: CELL_W,
        height: CELL_H,
        pointerEvents: "none",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
      transformTemplate={(_, generated) => {
        const xMatch = generated.match(/translateX\(([^)]+)\)/);
        const yMatch = generated.match(/translateY\(([^)]+)\)/);
        const sMatch = generated.match(/scale\(([^)]+)\)/);
        const rx = Math.round(parseFloat(xMatch?.[1] || "0"));
        const ry = Math.round(parseFloat(yMatch?.[1] || "0"));
        const s = parseFloat(sMatch?.[1] || "1");
        if (Math.abs(s - 1) < 0.005) {
          return `translate3d(${rx}px,${ry}px,0)`;
        }
        return `translate3d(${rx}px,${ry}px,0) scale(${s})`;
      }}
      initial={initialProps}
      animate={animateProps}
    >
      {tile.letter}
    </motion.div>
  );
}
