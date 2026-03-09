const LETTER_WEIGHTS: Record<string, number> = {
  A: 32, B: 2,  C: 3,  D: 16, E: 36, F: 4,
  G: 1,  H: 15, I: 25, J: 3,  K: 1,  L: 3,
  M: 15, N: 22, O: 28, P: 12, Q: 2,  R: 16,
  S: 8,  T: 25, U: 8,  V: 1,  W: 14, X: 1,
  Y: 6,  Z: 1,
};

const cumulativeWeights: { letter: string; cumWeight: number }[] = [];

let total = 0;
for (const [letter, weight] of Object.entries(LETTER_WEIGHTS)) {
  total += weight;
  cumulativeWeights.push({ letter, cumWeight: total });
}

export function getRandomLetter(): string {
  const rand = Math.random() * total;
  for (const { letter, cumWeight } of cumulativeWeights) {
    if (rand < cumWeight) return letter;
  }
  return "E";
}
