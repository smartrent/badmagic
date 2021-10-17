import React, { useContext, useState, useCallback } from "react";

import storage from "../lib/storage";

export const Context = React.createContext({
  darkMode: storage.get({ key: "darkMode" }),
  setDarkMode: (darkMode: boolean) => {},
  setEnvVar: ({ key, value }: { key: string; value: any }) => {},
  deleteEnvVar: ({ key }: { key: string }) => {},
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(
    storage.get({ key: "darkMode" })
  );

  const setEnvVar = useCallback(
    ({ key, value }: { key: string; value: any }) => {
      return storage.set({ key, value });
    },
    []
  );

  const deleteEnvVar = useCallback(({ key }: { key: string }) => {
    return storage.delete({ key });
  }, []);

  const setDarkMode = useCallback(
    (darkMode: boolean) => {
      setEnvVar({ key: "darkMode", value: darkMode });
      setDarkModeState(darkMode);
    },
    [darkMode, setDarkModeState]
  );

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode: (darkMode: boolean) => {
          setEnvVar({ key: "darkMode", value: darkMode });
          setDarkModeState(darkMode);
        },
        setEnvVar,
        deleteEnvVar,
      }}
    >
      {children}
    </Context.Provider>
  );
}
