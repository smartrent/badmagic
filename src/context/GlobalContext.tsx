import React, { useState, useCallback, useContext, useEffect } from "react";

import * as storage from "../lib/storage";

const storageKeys = {
  darkMode: "darkMode",
  hideDeprecatedRoutes: "hideDeprecatedRoutes",
  historicResponses: "historic-responses",
};

import { HistoricResponse, Route } from "../types";

export const Context = React.createContext({
  darkMode: storage.get(storageKeys.darkMode),
  setDarkMode: (darkMode: boolean) => {
    // noop
  },
  hideDeprecatedRoutes: storage.get(storageKeys.hideDeprecatedRoutes),
  setHideDeprecatedRoutes: (hideDeprecatedRoutes: boolean) => {
    // noop
  },
  historicResponses: (storage.get(storageKeys.historicResponses) ||
    []) as HistoricResponse[],
  storeHistoricResponse: (historicResponse: HistoricResponse) => {
    return historicResponse;
  },
  partialRequestResponses: {} as Record<string, HistoricResponse>,
  setPartialRequestResponse: (historicResponse: HistoricResponse) => {
    // noop
  },

  activeRoute: null as null | Route,
  setActiveRoute: (activeRoute: Route) => {
    // noop
  },
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [activeRoute, setActiveRoute] = useState<null | Route>(null);

  const [darkMode, setDarkModeInState] = useState<boolean>(
    storage.get(storageKeys.darkMode)
  );

  // Used to track the state of a Request for a particular Route before it becomes a HistoricResponse
  // after the Request is issued. This allows the user to flip back and forth between routes and still have
  // Params stay loaded.
  const [partialRequestResponses, setPartialRequestResponses] = useState<
    Record<string, HistoricResponse>
  >({});

  const setPartialRequestResponse = useCallback(
    (partialRequestResponse: HistoricResponse) => {
      setPartialRequestResponses({
        ...partialRequestResponses,
        [partialRequestResponse.route.name]: partialRequestResponse,
      });
    },
    [partialRequestResponses]
  );

  const setDarkMode = useCallback((darkMode: boolean) => {
    storage.set(storageKeys.darkMode, darkMode);
    setDarkModeInState(darkMode);
  }, []);

  const [hideDeprecatedRoutes, setHideDeprecatedRoutesInState] = useState<
    boolean
  >(storage.get(storageKeys.hideDeprecatedRoutes));

  const setHideDeprecatedRoutes = useCallback(
    (hideDeprecatedRoutes: boolean) => {
      storage.set(storageKeys.hideDeprecatedRoutes, hideDeprecatedRoutes);
      setHideDeprecatedRoutesInState(hideDeprecatedRoutes);
    },
    []
  );

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
    }: HistoricResponse) => {
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
        100
      ); // prepend the new HistoricResponse, and ensure the array has a max of 100 cells

      storage.set(storageKeys.historicResponses, newHistoricResponses);
      setHistoricResponseInState(newHistoricResponses);

      return newResponse;
    },
    [historicResponses]
  );

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode,
        hideDeprecatedRoutes,
        setHideDeprecatedRoutes,
        historicResponses,
        storeHistoricResponse,
        partialRequestResponses,
        setPartialRequestResponse,
        activeRoute,
        setActiveRoute,
      }}
    >
      {children}
    </Context.Provider>
  );
}
