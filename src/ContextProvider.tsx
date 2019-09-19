import React, { useState } from "react";
import { get, omit } from "lodash-es";

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
  const [workspaceName, setWorkspaceName] = useState(
    Storage.get({ key: "workspaceName" })
  ); // Load last used workspace
  const workspace = Helpers.findWorkspaceByName(workspaces, workspaceName);
  const [environment, setEnvironment] = useState(
    Helpers.getEnvForWorkspace(workspace)
  );
  const [routeConfig, setRouteConfig] = useState(
    Helpers.findRouteConfigByWorkspace(workspace)
  );

  return (
    <Context.Provider
      value={{
        workspaces,
        workspace,
        setWorkspaceName: (name) => {
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

        setEnvVar: ({ key, value }) => {
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

        getParam: ({ route, param, paramType }) => {
          return get(
            routeConfig,
            `[${route.name}][${paramType}][${param.name}]`,
            param.defaultValue || ""
          );
        },

        setParam: ({ route, param, value, paramType }) => {
          if (!workspace) {
            return;
          }

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name][paramType][param.name] = value;
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
