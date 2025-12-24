import { useState, useEffect, useCallback } from "react";

const HISTORY_KEY = "devtools-history";
const MAX_HISTORY_ITEMS = 10;

export interface HistoryItem {
  path: string;
  timestamp: number;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // localStorage not available
    }
  }, [history]);

  const addToHistory = useCallback((path: string) => {
    setHistory((prev) => {
      // Remove existing entry if present
      const filtered = prev.filter((item) => item.path !== path);
      // Add new entry at the beginning
      const newHistory = [{ path, timestamp: Date.now() }, ...filtered];
      // Keep only the most recent items
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getRecentPaths = useCallback(() => {
    return history.map((item) => item.path);
  }, [history]);

  return { history, addToHistory, clearHistory, getRecentPaths };
}
