import {
  get,
  set,
  reduce,
  find,
  compact,
  map,
  startCase,
  omitBy,
} from "lodash-es";
import { stringify } from "querystring";

import Storage from "./storage";

import { Route, Workspace } from "../types";

export default {
  initializeRoute(routeConfig: any, route: Route) {
    set(routeConfig, route.name, {
      urlParams: {},
      qsParams: {},
      body: {},
      headers: {},
      response: null,
      error: null,
      loading: false,
    });
  },

  getEnvForWorkspace(workspace: Workspace) {
    if (!(workspace && workspace.id)) {
      return null;
    }
    // Default environment with any changes specified by end-user
    return Storage.get({ key: `${workspace.id}-env` });
  },

  getDefaultWorkspace(): Workspace {
    return {
      id: "default",
      routes: [],
      name: "default",
      plugins: [],
      config: {
        baseUrl: "",
      },
    };
  },

  findWorkspaceByName(workspaces: Workspace[], name: string): Workspace {
    let workspace;
    if (name) {
      workspace = find(workspaces, { name });
    }
    return workspace || this.getDefaultWorkspace();
  },

  findRouteConfigByWorkspace(workspace: Workspace) {
    if (!workspace) {
      return {};
    }
    const routeConfig = Storage.get({
      key: `${workspace.id}-route-config`,
    });
    return routeConfig || {};
  },

  buildUrl({
    route,
    baseUrl,
    urlParams,
    qsParams,
  }: {
    route: any;
    baseUrl: string;
    urlParams: Object;
    qsParams?: Object;
  }) {
    return reduce(
      this.getUrlParamsFromPath(route.path),
      (memo, urlParam) => {
        const value = get(urlParams || {}, urlParam.name);
        return memo.replace(`:${urlParam.name}`, value || `:${urlParam.name}`);
      },
      `${baseUrl}${route.path}${
        qsParams && !!Object.keys(qsParams).length
          ? `?${stringify(omitBy(qsParams, (p) => !p))}`
          : ""
      }`
    );
  },

  getUrlParamsFromPath(path: string) {
    const splitPath = path.split("/");

    return compact(
      map(splitPath, (part) => {
        if (part.indexOf(":") === -1) {
          return null;
        }
        const name = part.slice(1);
        return { label: startCase(name), name };
      })
    );
  },

  colors: {
    green: "#1cb30a",
    red: "red",
    routes: {
      get: "rgb(222, 238, 255)",
      delete: "rgb(255, 211, 211)",
      post: "rgb(214, 255, 209)",
      put: "rgb(255, 234, 195)",
      patch: "rgb(255, 234, 195)",
    },
  },
};
