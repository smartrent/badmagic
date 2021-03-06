import React, { useContext, useState } from "react";
import { get, set, unset, omit } from "lodash-es";

import Helpers from "../lib/helpers";
import Storage from "../lib/storage";

import {
  Route,
  Param,
  Workspace,
  SetParamPayload,
  RouteConfig,
  RouteConfigVars,
} from "../types";

const workspaces: Workspace[] = [];

export const Context = React.createContext({
  workspace: Helpers.getDefaultWorkspace(),
  workspaces,
  setWorkspaceName: (name: string) => {},
  environment: null,
  darkMode: true,
  setDarkMode: (darkMode: boolean) => {},
  setEnvVar: (payload: { key: string; value: any }) => {},
  deleteEnvVar: (payload: { key: string }) => {},
  routeConfig: {} as RouteConfig,
  setRouteConfig: (routeConfig: RouteConfig) => {},
  getFromRouteConfig: (filters: { param?: Param; pathToValue: string }) => "",
  setRouteConfigVars: (routeConfigVars: RouteConfigVars, route: Route) => {},
  setParam: (payload: SetParamPayload) => {},
  setHeader: (payload: { route: Route; key: string; value: string }) => {},
  setApiResponse: (payload: {
    route: Route;
    response: any;
    error: any;
    loading: boolean;
  }) => {},
  getWorkspaceSearchKeywords: () => "",
  setWorkspaceSearchKeywords: (keywords: string) => {},
});

export const useGlobalContext = () => useContext(Context);

export function ContextProvider({
  children,
  workspaces,
}: {
  children: React.ReactNode;
  workspaces: Workspace[];
}) {
  const initialDarkMode = Storage.get({ key: "darkMode" });
  const initialWorkspace = Storage.get({ key: "workspaceName" });

  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [workspaceName, setWorkspaceName] = useState(initialWorkspace); // Load last used workspace
  const workspace = Helpers.findWorkspaceByName(workspaces, workspaceName);
  const [environment, setEnvironment] = useState(
    Helpers.getEnvForWorkspace(workspace)
  );
  const [routeConfig, setRouteConfig] = useState(
    Helpers.findRouteConfigByWorkspace(workspace)
  );

  const setEnvVar = ({ key, value }: { key: string; value: string }) => {
    if (!workspace) {
      return;
    }

    // We need to fetch synchronously from localStorage here otherwise
    // due to the React render loop, calling `setEnvVar` twice in a row will
    // cause it to not save the first set of data
    const newEnvironment = Helpers.getEnvForWorkspace(workspace);
    const newEnv = { ...(newEnvironment || {}), [key]: value };

    Storage.set({
      key: `${workspace.id}-env`,
      value: newEnv,
    });
    setEnvironment(newEnv);
  };

  return (
    <Context.Provider
      value={{
        workspaces,
        workspace,
        setWorkspaceName: (name: string) => {
          Storage.set({
            key: "workspaceName",
            value: name,
          });
          setWorkspaceName(name);
          const workspace = Helpers.findWorkspaceByName(workspaces, name);
          setEnvironment(Helpers.getEnvForWorkspace(workspace));
          setRouteConfig(Helpers.findRouteConfigByWorkspace(workspace));
        },
        environment,

        darkMode,
        setDarkMode: (darkMode: boolean) => {
          Storage.set({ key: "darkMode", value: darkMode });
          setDarkMode(darkMode);
        },

        setEnvVar,

        getWorkspaceSearchKeywords() {
          return environment && workspace && workspace.name
            ? environment[`${workspace.name}-route-filter`]
            : "";
        },

        setWorkspaceSearchKeywords(value: string) {
          if (workspace && workspace.name) {
            setEnvVar({
              key: `${workspace.name}-route-filter`,
              value,
            });
          }
        },

        deleteEnvVar: ({ key }) => {
          if (!workspace) {
            return;
          }
          const newEnv = omit({ ...environment }, key);

          Storage.set({
            key: `${workspace.id}-env`,
            value: newEnv,
          });
          setEnvironment(newEnv);
        },

        // A route must be initialized in routeConfig for it to show up in list of callable routes in the UI
        // because routeConfig stores body params, qs params, and url params as well as headers, responses, etc.
        routeConfig,

        // This is used to initialize a route's config (see above) for a workspace in local storage
        setRouteConfig,

        setHeader: ({ route, key, value }) => {
          if (!workspace) {
            return;
          }

          let newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            newRouteConfig = Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name].headers[key] = value;
          Storage.set({
            key: `${workspace.id}-route-config`,
            value: newRouteConfig,
          });

          setRouteConfig(newRouteConfig);
        },

        setApiResponse: ({ route, response, error, loading }) => {
          if (!workspace) {
            return;
          }

          let newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            newRouteConfig = Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name].loading = loading;
          newRouteConfig[route.name].error = error; // set api error (if any)
          newRouteConfig[route.name].response = response; // set api response (if not error)

          setRouteConfig(newRouteConfig);
        },

        // Uses Lodash's `get` to fetch deeply nested values from RouteConfig
        getFromRouteConfig: ({ param, pathToValue }) => {
          return get(routeConfig, pathToValue);
        },

        // Overwrites all Route Config variables for a route then saves to local storage
        setRouteConfigVars: (
          routeConfigVars: RouteConfigVars,
          route: Route
        ) => {
          return setRouteConfig({
            ...routeConfig,
            [route.name]: routeConfigVars,
          });
        },

        setParam: ({ param, value, pathToValue }: SetParamPayload) => {
          if (!workspace) {
            return;
          }

          let newValue = value;
          try {
            newValue = param?.json ? JSON.parse(value) : value;
          } catch (err) {}

          const newRouteConfig = { ...routeConfig };
          if (typeof value === "undefined") {
            unset(newRouteConfig, pathToValue);
          } else {
            set(newRouteConfig, pathToValue, newValue);
          }

          Storage.set({
            key: `${workspace.id}-route-config`,
            value: newRouteConfig,
          });

          setRouteConfig(newRouteConfig);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
