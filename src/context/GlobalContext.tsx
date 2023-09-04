import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { getLinkedRouteFromUrl } from "../lib/links";

import * as storage from "../lib/storage";

const storageKeys = {
  darkMode: "darkMode",
  hideDeprecatedRoutes: "hideDeprecatedRoutes",
  historicResponses: "historic-responses",
  collapsedWorkspaces: "collapsed-workspaces",
};

import { HistoricResponse, Route, Workspace } from "../types";

export const Context = React.createContext({
  workspaces: [] as Workspace[],
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

export function ContextProvider({
  children,
  workspaces,
}: {
  children: React.ReactNode;
  workspaces: Workspace[];
}) {
  const [activeRoute, setActiveRoute] = useState<null | Route>(null);
  const [keywords, setKeywords] = useState("");
  const [collapsedWorkspaces, setCollapsedWorkspacesInState] = useState<
    string[]
  >(storage.get(storageKeys.collapsedWorkspaces) || []);
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
        [partialRequestResponse.route.path]: partialRequestResponse,
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

  const setCollapsedWorkspaces = useCallback(
    (collapsedWorkspaces: string[]) => {
      storage.set(storageKeys.collapsedWorkspaces, collapsedWorkspaces);
      setCollapsedWorkspacesInState(collapsedWorkspaces);
    },
    []
  );

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

        storage.set(storageKeys.historicResponses, newHistoricResponses);

        return newHistoricResponses;
      });

      return newResponse;
    },
    []
  );

  const workspacesWithDefaults = useMemo(
    () =>
      workspaces.map((workspace) => ({
        ...workspace,
        routes: workspace.routes.map((route) => ({
          ...route,
          baseUrl: workspace.config.baseUrl || window.location.origin,
          workspaceName: workspace.name,
        })),
      })),
    [workspaces]
  );

  // On initial mount, this will fetch HistoricResponse from local storage
  // and load any request that was deep linked
  useEffect(() => {
    const historicResponsesFromStorage: HistoricResponse[] = storage.get(
      storageKeys.historicResponses
    );
    if (historicResponsesFromStorage?.length) {
      setHistoricResponseInState(historicResponsesFromStorage);
    }

    const { route, historicResponse } = getLinkedRouteFromUrl({
      workspaces: workspacesWithDefaults,
    });

    if (route && historicResponse) {
      setActiveRoute(route);
      storeHistoricResponse(historicResponse);
    }
  }, [storeHistoricResponse, workspacesWithDefaults]);

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
        keywords,
        setKeywords,
        collapsedWorkspaces,
        setCollapsedWorkspaces,
        workspaces: workspacesWithDefaults,
      }}
    >
      {children}
    </Context.Provider>
  );
}
