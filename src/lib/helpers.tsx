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
import OpenApi from "./openapi";

import { Route, Workspace, ParamType } from "../types";

const Helpers = {
  downloadOpenApiJson: ({ workspace }: { workspace: Workspace }) => {
    const openApiResult = OpenApi.downloadOpenApiJson({
      workspace,
    });

    const openApiJson = JSON.stringify(openApiResult);

    const type = "application/json";
    const downloadReportUrl = window.URL.createObjectURL(
      new Blob([openApiJson], { type })
    );

    const aLink = document.createElement("a");
    aLink.download = `${workspace.name.toLowerCase()}-openapi.json`;
    aLink.href = downloadReportUrl;

    const event = new MouseEvent("click");
    aLink.dispatchEvent(event);
  },

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
      id: "",
      routes: [],
      name: "",
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
    return workspace || Helpers.getDefaultWorkspace();
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
    const stringifiedQS =
      qsParams && !!Object.keys(qsParams).length
        ? stringify(omitBy(qsParams, (p) => !p))
        : "";

    return reduce(
      Helpers.getUrlParamsFromPath(route.path),
      (memo, urlParam) => {
        const value = get(urlParams || {}, urlParam.name);
        return memo.replace(`:${urlParam.name}`, value || `:${urlParam.name}`);
      },
      `${baseUrl}${route.path}${stringifiedQS ? `?${stringifiedQS}` : ""}`
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

  resetRequest(route, setParamFunc) {
    const urlParams = Helpers.getUrlParamsFromPath(route.path);
    if (urlParams) {
      urlParams.forEach((param) => {
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

  getStyles(darkMode: boolean, category: string) {
    switch (category) {
      case "themeContainer":
        return darkMode
          ? {
              backgroundColor: "#1A1F27",
              color: "#fff",
            }
          : {};
      case "fixedHeader":
        return darkMode
          ? {
              backgroundColor: "#1A1F27",
              borderBottom: "1px solid rgb(56, 56, 56)",
            }
          : {
              backgroundColor: "#fff",
              borderBottom: "1px solid #eee",
            };

      case "routePanelHeader":
      case "responseStatusCode":
        return darkMode
          ? { border: "1px solid rgb(56, 56, 56)" }
          : { border: "1px solid #eee" };

      case "routePanelBody":
        return darkMode
          ? {
              borderRight: "1px solid rgb(56, 56, 56)",
              borderLeft: "1px solid rgb(56, 56, 56)",
              borderBottom: "1px solid rgb(56, 56, 56)",
            }
          : {
              borderRight: "1px solid #eee",
              borderBottom: "1px solid #eee",
              borderLeft: "1px solid #eee",
            };
      case "label":
        return darkMode ? { color: "rgb(206, 206, 206)" } : { color: "#555" };
      default:
        return {};
    }
  },

  classes: {
    tabs: {
      active:
        "inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold",
      inactive:
        "inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold",
      disabled:
        "inline-block py-2 px-4 text-gray-400 font-semibold cursor-not-allowed",
    },
  },
};

export default Helpers;
