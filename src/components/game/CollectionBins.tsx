import type { LetterCollection } from "@/types/game";
import Bin from "./Bin";

interface CollectionBinsProps {
  collected: LetterCollection;
  dark?: boolean;
  onMeasureBin?: (letter: string, rect: DOMRect) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CollectionBins({
  collected,
  dark = false,
  onMeasureBin,
}: CollectionBinsProps) {
  const activeBins = ALPHABET.filter((l) => (collected[l] || 0) > 0);

  if (activeBins.length === 0) {
    return (
      <div
        className={`flex items-center justify-center py-1 text-[11px] ${
          dark ? "text-white/25" : "text-[var(--text-tertiary)]"
        }`}
      >
        Match letters to collect
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5">
      {activeBins.map((letter) => (
        <Bin
          key={letter}
          letter={letter}
          count={collected[letter] || 0}
          dark={dark}
          onMeasure={onMeasureBin}
        />
      ))}
    </div>
  );
}
