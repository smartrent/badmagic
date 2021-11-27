import React, { useState, useCallback, useContext, useEffect } from "react";

import { AxiosResponse, AxiosError } from "axios";

import storage from "../lib/storage";

const storageKeys = {
  darkMode: "darkMode",
  historicResponses: "historic-responses",
};

import { HistoricResponse, StoreHistoricResponsePayload } from "../types";

export const Context = React.createContext({
  darkMode: storage.get(storageKeys.darkMode),
  setDarkMode: (darkMode: boolean) => {},
  historicResponses: (storage.get(storageKeys.historicResponses) ||
    []) as HistoricResponse[],
  storeHistoricResponse: (historicResponse: StoreHistoricResponsePayload) => {},
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeInState] = useState<boolean>(
    storage.get(storageKeys.darkMode)
  );

  const setDarkMode = useCallback((darkMode: boolean) => {
    storage.set(storageKeys.darkMode, darkMode);
    setDarkModeInState(darkMode);
  }, []);

  const [historicResponses, setHistoricResponseInState] = useState<
    HistoricResponse[]
  >([]);

  // On initial mount, this will fetch HistoricResponse from local storage once
  useEffect(() => {
    const historicResponsesFromStorage: HistoricResponse[] = storage.get(
      storageKeys.historicResponses
    );

    if (historicResponsesFromStorage?.length) {
      setHistoricResponseInState(historicResponsesFromStorage);
    }
  }, []);

  const storeHistoricResponse = useCallback(
    ({
      metadata,
      response,
      error,
      route,
      qsParams,
      body,
      urlParams,
    }: StoreHistoricResponsePayload) => {
      const newResponse: HistoricResponse = {
        route,
        qsParams,
        body,
        urlParams,
        response: response
          ? {
              status: response.status,
              data: response.data,
              headers: response.headers,
              config: {
                headers: response.config.headers,
              },
            }
          : null,
        error: error
          ? {
              code: error?.code,
              isAxiosError: error?.isAxiosError,
              response: {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
              },
            }
          : null,
        metadata: {
          ...(metadata || {}),
          insertedAt: new Date(),
        },
      };

      const newHistoricResponses = [newResponse, ...historicResponses].slice(
        0,
        49
      ); // prepend the new HistoricResponse, and ensure the array has a max of 50 cells

      storage.set(storageKeys.historicResponses, newHistoricResponses);
      setHistoricResponseInState(newHistoricResponses);
    },
    [historicResponses]
  );

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode,
        historicResponses,
        storeHistoricResponse,
      }}
    >
      {children}
    </Context.Provider>
  );
}
