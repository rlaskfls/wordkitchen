import { useReducer } from "react";
import type { GameState, GameAction, LetterCollection } from "@/types/game";
import { createGrid } from "@/engine/grid";
import { PHASE1_DURATION } from "@/lib/constants";

function createInitialState(): GameState {
  return {
    phase: "ready",
    grid: createGrid(),
    score: 0,
    collectedLetters: {},
    timeRemaining: PHASE1_DURATION,
    selectedTile: null,
    submittedWords: [],
    comboMultiplier: 1,
    isProcessing: false,
  };
}

function addLetters(
  collection: LetterCollection,
  letters: string[]
): LetterCollection {
  const next = { ...collection };
  for (const l of letters) {
    next[l] = (next[l] || 0) + 1;
  }
  return next;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...createInitialState(),
        phase: "matching",
      };

    case "SELECT_TILE":
      if (state.isProcessing) return state;
      return { ...state, selectedTile: action.position };

    case "DESELECT_TILE":
      return { ...state, selectedTile: null };

    case "SWAP_TILES":
      return { ...state, selectedTile: null, isProcessing: true };

    case "SET_GRID":
      return { ...state, grid: action.grid };

    case "RESOLVE_MATCHES":
      return { ...state };

    case "COLLECT_LETTERS":
      return {
        ...state,
        collectedLetters: addLetters(state.collectedLetters, action.letters),
      };

    case "ADD_SCORE":
      return { ...state, score: state.score + action.points };

    case "TICK_TIMER":
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      };

    case "END_MATCHING_PHASE":
      return {
        ...state,
        phase: "wordbuilding",
        selectedTile: null,
        isProcessing: false,
      };

    case "SUBMIT_WORD":
      return {
        ...state,
        submittedWords: [...state.submittedWords, action.word],
        score: state.score + action.points,
        collectedLetters: consumeLetters(
          state.collectedLetters,
          action.word
        ),
      };

    case "SET_PROCESSING":
      return { ...state, isProcessing: action.value };

    case "FINISH_GAME":
      return { ...state, phase: "gameover" };

    case "RESET_GAME":
      return createInitialState();

    default:
      return state;
  }
}

function consumeLetters(
  collection: LetterCollection,
  word: string
): LetterCollection {
  const next = { ...collection };
  for (const ch of word.toUpperCase()) {
    if (next[ch] && next[ch] > 0) {
      next[ch]--;
      if (next[ch] === 0) delete next[ch];
    }
  }
  return next;
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  return { state, dispatch };
}
