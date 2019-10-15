import {
  get,
  set,
  reduce,
  find,
  compact,
  map,
  startCase,
  omitBy,
  transform,
} from "lodash-es";
import { stringify } from "querystring";

import Storage from "./storage";

import { Route, Workspace, ParamType } from "../types";

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

    if (routeConfig) {
      return routeConfig;
    }

    // stub out routeConfig

    const initialRouteConfig = transform(
      workspace.routes,
      (memo, route) => {
        memo[route.name] = {
          headers: {},
          urlParams: {},
          body: transform(
            route.body,
            (memo, param) => {
              memo[param.name] = param.defaultValue;
            },
            {}
          ),
          qsParams: transform(
            route.qsParams,
            (memo, param) => {
              memo[param.name] = param.defaultValue;
            },
            {}
          ),
          error: {},
          response: {},
          loading: false,
        };
        return memo;
      },
      {}
    );

    Storage.set({
      key: `${workspace.id}-route-config`,
      value: initialRouteConfig,
    });

    return initialRouteConfig;
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

  resetRequest (route, setParamFunc) {
    const url_params = this.getUrlParamsFromPath(route.path);
    if (url_params) {
      url_params.forEach((param) => {
        setParamFunc({
          route,
          param,
          value: null,
          paramType: ParamType.urlParams,
        });
      });
    }
    if (route.body) {
      route.body.forEach((param) => {
        setParamFunc({ route, param, value: null, paramType: ParamType.body });
      });
    }
    if (route.qsParams) {
      route.qsParams.forEach((param) => {
        setParamFunc({
          route,
          param,
          value: null,
          paramType: ParamType.qsParams,
        });
      });
    }
  },
};
