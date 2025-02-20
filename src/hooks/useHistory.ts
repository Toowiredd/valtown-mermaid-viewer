import { useState, useCallback } from 'react';

interface HistoryEntry {
  code: string;
  timestamp: number;
}

export const useHistory = (initialCode: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { code: initialCode, timestamp: Date.now() },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addToHistory = useCallback((code: string) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { code, timestamp: Date.now() }];
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, history.length]);

  return {
    currentCode: history[currentIndex]?.code || '',
    addToHistory,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};
