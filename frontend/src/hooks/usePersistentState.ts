import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = sessionStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error("Error reading from sessionStorage", error);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to sessionStorage", error);
    }
  }, [key, state]);

  return [state, setState];
}