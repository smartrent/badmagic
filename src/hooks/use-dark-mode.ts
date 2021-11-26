import { useState, useCallback } from "react";

import storage from "../lib/storage";

export function useDarkMode(): [boolean, (darkMode: boolean) => void] {
  const storageKey = "darkMode";
  const getEnvVar = useCallback((key: string) => storage.get(key), []);
  const [darkMode, setDarkModeState] = useState<boolean>(getEnvVar(storageKey));

  const setDarkMode = useCallback(
    (darkMode: boolean) => {
      storage.set("darkMode", darkMode);
      setDarkModeState(darkMode);
    },
    [darkMode, setDarkModeState]
  );

  return [darkMode, setDarkMode];
}
