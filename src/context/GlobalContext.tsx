import React, { useState, useCallback, useContext, useMemo } from "react";

import * as storage from "../lib/storage";

import { HistoricResponse, Route, Workspace } from "../types";
import { useConfigContext } from "./ConfigContext";
import { routeHref } from "../lib/routing";

export const Context = React.createContext({
  workspaces: [] as Workspace[],
  darkMode: storage.get(storage.keys.darkMode) || false,
  setDarkMode: (darkMode: boolean) => {
    // noop
  },
  hideDeprecatedRoutes: storage.get(storage.keys.hideDeprecatedRoutes) || false,
  setHideDeprecatedRoutes: (hideDeprecatedRoutes: boolean) => {
    // noop
  },
  historicResponses: (storage.get(storage.keys.historicResponses) ||
    []) as HistoricResponse[],
  storeHistoricResponse: (historicResponse: HistoricResponse) => {
    return historicResponse;
  },
  clearHistoricResponses: (historicResponses: HistoricResponse[]) => {
    // noop
  },
  partialRequestResponses: {} as Record<string, HistoricResponse>,
  setPartialRequestResponse: (historicResponse: HistoricResponse) => {
    // noop
  },

  activeRoute: null as null | Route,
  activeHref: "",
  setActiveRoute: (activeRoute: Route | null) => {
    // noop
  },

  keywords: "",
  setKeywords: (keywords: string) => {
    // noop
  },

  collapsedWorkspaces: [] as string[],
  setCollapsedWorkspaces: (collapsedWorkspaces: string[]) => {
    // noop
  },
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const { workspaces, basename } = useConfigContext();

  const [activeRoute, setActiveRoute] = useState<null | Route>(null);
  const [keywords, setKeywordsInState] = useState(
    () => storage.get(storage.keys.searchKeywords) ?? ""
  );
  const [collapsedWorkspaces, setCollapsedWorkspacesInState] = useState<
    string[]
  >(() => storage.get(storage.keys.collapsedWorkspaces) || []);
  const [darkMode, setDarkModeInState] = useState<boolean>(
    () => storage.get(storage.keys.darkMode) || false
  );

  const activeHref = useMemo(
    () => routeHref(activeRoute, basename),
    [activeRoute, basename]
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
        [partialRequestResponse.route.path]: partialRequestResponse,
      });
    },
    [partialRequestResponses]
  );

  const setKeywords = useCallback((keywords: string) => {
    storage.set(storage.keys.searchKeywords, keywords);
    setKeywordsInState(keywords);
  }, []);

  const setDarkMode = useCallback((darkMode: boolean) => {
    storage.set(storage.keys.darkMode, darkMode);
    setDarkModeInState(darkMode);
  }, []);

  const [hideDeprecatedRoutes, setHideDeprecatedRoutesInState] =
    useState<boolean>(storage.get(storage.keys.hideDeprecatedRoutes) || false);

  const setCollapsedWorkspaces = useCallback(
    (collapsedWorkspaces: string[]) => {
      storage.set(storage.keys.collapsedWorkspaces, collapsedWorkspaces);
      setCollapsedWorkspacesInState(collapsedWorkspaces);
    },
    []
  );

  const setHideDeprecatedRoutes = useCallback(
    (hideDeprecatedRoutes: boolean) => {
      storage.set(storage.keys.hideDeprecatedRoutes, hideDeprecatedRoutes);
      setHideDeprecatedRoutesInState(hideDeprecatedRoutes);
    },
    []
  );

  const [historicResponses, setHistoricResponseInState] = useState<
    HistoricResponse[]
  >(() => storage.get(storage.keys.historicResponses) || []);

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

      setHistoricResponseInState((responses) => {
        // prepend the new HistoricResponse, and ensure the array has a max of 100 cells
        const newHistoricResponses = [newResponse, ...responses].slice(0, 100);

        if (newResponse.response || newResponse.error) {
          storage.set(
            storage.keys.historicResponses,
            newHistoricResponses.filter(
              (historicResponse) =>
                historicResponse.response || historicResponse.error
            )
          );
        }

        return newHistoricResponses;
      });

      return newResponse;
    },
    []
  );

  const clearHistoricResponses = useCallback((records: HistoricResponse[]) => {
    setHistoricResponseInState((responses) => {
      const recordsSet = new Set(records);
      responses = responses.filter((response) => !recordsSet.has(response));

      storage.set(storage.keys.historicResponses, responses);
      return responses;
    });
  }, []);

  const workspacesWithDefaults = useMemo(
    () =>
      workspaces.map((workspace) => ({
        ...workspace,
        routes: workspace.routes.map((route) => ({
          ...route,
          baseUrl: workspace.config.baseUrl || window.location.origin,
          workspaceName: workspace.name,
          workspaceId: workspace.id,
        })),
      })),
    [workspaces]
  );

  const context = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      hideDeprecatedRoutes,
      setHideDeprecatedRoutes,
      historicResponses,
      storeHistoricResponse,
      clearHistoricResponses,
      partialRequestResponses,
      setPartialRequestResponse,
      activeRoute,
      activeHref,
      setActiveRoute,
      keywords,
      setKeywords,
      collapsedWorkspaces,
      setCollapsedWorkspaces,
      workspaces: workspacesWithDefaults,
    }),
    [
      activeRoute,
      activeHref,
      collapsedWorkspaces,
      darkMode,
      hideDeprecatedRoutes,
      historicResponses,
      clearHistoricResponses,
      keywords,
      partialRequestResponses,
      setCollapsedWorkspaces,
      setDarkMode,
      setHideDeprecatedRoutes,
      setPartialRequestResponse,
      setKeywords,
      storeHistoricResponse,
      workspacesWithDefaults,
    ]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
}
