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

        setUrlParam: ({ route, urlParam, value }) => {
          if (!workspace) {
            return;
          }
          const key = `${workspace.id}-route-config`;

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name].urlParams[urlParam.name] = value;
          Storage.set({ key, value: newRouteConfig });

          setRouteConfig(newRouteConfig);
        },

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

        getUrlParam: ({ route, urlParam }) => {
          return get(
            routeConfig,
            `[${route.name}].urlParams[${urlParam.name}]`,
            ""
          );
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

        setBody: ({ route, param, value }) => {
          if (!workspace) {
            return;
          }

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name].body[param.name] = value;
          Storage.set({
            key: `${workspace.id}-route-config`,
            value: newRouteConfig,
          });

          setRouteConfig(newRouteConfig);
        },

        getBody: ({ route, param }) => {
          return get(routeConfig, `[${route.name}].body[${param.name}]`, "");
        },

        setQSParam: ({ route, param, value }) => {
          if (!workspace) {
            return;
          }

          const newRouteConfig = { ...routeConfig };
          if (!newRouteConfig[route.name]) {
            Helpers.initializeRoute(newRouteConfig, route);
          }

          newRouteConfig[route.name].qsParams[param.name] = value;
          Storage.set({
            key: `${workspace.id}-route-config`,
            value: newRouteConfig,
          });

          setRouteConfig(newRouteConfig);
        },

        getQSParam: ({ route, param }) => {
          return get(
            routeConfig,
            `[${route.name}].qsParams[${param.name}]`,
            ""
          );
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
