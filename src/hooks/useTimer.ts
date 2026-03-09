import { useEffect, useRef, useCallback } from "react";

export function useTimer(
  timeRemaining: number,
  isRunning: boolean,
  onTick: () => void,
  onEnd: () => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clear();
      return;
    }

    intervalRef.current = setInterval(() => {
      onTick();
    }, 1000);

    return clear;
  }, [isRunning, onTick, clear]);

  useEffect(() => {
    if (timeRemaining <= 0 && isRunning) {
      clear();
      onEnd();
    }
  }, [timeRemaining, isRunning, onEnd, clear]);
}
