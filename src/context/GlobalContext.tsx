import React, { useState, useCallback, useContext } from "react";

import storage from "../lib/storage";

const darkModeKey = "darkMode";

export const Context = React.createContext({
  darkMode: storage.get(darkModeKey),
  setDarkMode: (darkMode: boolean) => {},
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeInState] = useState<boolean>(
    storage.get(darkModeKey)
  );

  const setDarkMode = useCallback((darkMode: boolean) => {
    storage.set(darkModeKey, darkMode);
    setDarkModeInState(darkMode);
  }, []);

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </Context.Provider>
  );
}
