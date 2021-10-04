import React, { useContext, useState } from "react";

import Storage from "../lib/storage";

export const Context = React.createContext({
  darkMode: true,
  setDarkMode: (darkMode: boolean) => {},
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const initialDarkMode = Storage.get({ key: "darkMode" });
  const initialWorkspace = Storage.get({ key: "workspaceName" });

  const [darkMode, setDarkMode] = useState(initialDarkMode);

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode: (darkMode: boolean) => {
          Storage.set({ key: "darkMode", value: darkMode });
          setDarkMode(darkMode);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
