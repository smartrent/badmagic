import React, { useContext, useState, useCallback } from "react";

import storage from "../lib/storage";

export const Context = React.createContext({
  darkMode: storage.get("darkMode"),
  setDarkMode: (darkMode: boolean) => {},
  setEnvVar: (key: string, value: any) => storage.set(key, value),
  deleteEnvVar: (key: string) => storage.delete(key),
  getEnvVar: (key: string) => storage.get(key),
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const getEnvVar = useCallback((key: string) => storage.get(key), []);

  const [darkMode, setDarkModeState] = useState(getEnvVar("darkMode"));

  const setEnvVar = useCallback((key: string, value: any) => {
    return storage.set(key, value);
  }, []);

  const deleteEnvVar = useCallback((key: string) => {
    return storage.delete(key);
  }, []);

  const setDarkMode = useCallback(
    (darkMode: boolean) => {
      setEnvVar("darkMode", darkMode);
      setDarkModeState(darkMode);
    },
    [darkMode, setDarkModeState]
  );

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode,
        setEnvVar,
        getEnvVar,
        deleteEnvVar,
      }}
    >
      {children}
    </Context.Provider>
  );
}
