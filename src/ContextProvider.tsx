import React, { useState } from "react";
import { get, set, unset, omit } from "lodash-es";

import Context from "./Context";

import Helpers from "./lib/helpers";
import Storage from "./lib/storage";

import { Workspace } from "./types";

export default function ContextProvider({
  children,
  workspaces,
}: {
  children: any;
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

  const setEnvVar = ({ key, value }) => {
    if (!workspace) {
      return;
    }
    const newEnv = { ...environment };
    newEnv[key] = value;

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

        routeConfig,

        setHeader: ({ route, key, value }) => {
          if (!workspace) {
            return;
          }

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
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

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name].loading = loading;
          newRouteConfig[route.name].error = error; // set api error (if any)
          newRouteConfig[route.name].response = response; // set api response (if not error)

          setRouteConfig(newRouteConfig);
        },

        getParam: ({ route, param, paramType, parent }) => {
          let propertyPath = `[${param.name}]`;
          // parent is used for json objects in body params
          if (parent) {
            propertyPath = `[${parent}]${propertyPath}`;
          }

          return get(
            routeConfig,
            `[${route.name}][${paramType}]${propertyPath}`,
            param.defaultValue
          );
        },

        setParam: ({ route, param, value, paramType, parent }) => {
          if (!workspace) {
            return;
          }

          let newValue = value;
          try {
            newValue = param.json ? JSON.parse(value) : value;
          } catch (err) {}

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
          }

          let propertyPath = `[${param.name}]`;
          // parent is used for json objects in body params
          if (parent) {
            propertyPath = `[${parent}]${propertyPath}`;
          }

          const fullParamPath = `[${route.name}][${paramType}]${propertyPath}`;
          if (typeof value === "undefined") {
            unset(newRouteConfig, fullParamPath);
          } else {
            set(newRouteConfig, fullParamPath, newValue);
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
