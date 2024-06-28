import React from "react";
import { get, reduce, compact, map, startCase } from "lodash-es";
import { stringify } from "querystring";

import OpenApi from "./openapi";
import { Route, Workspace, Param, HistoricResponse } from "../types";
import { routeLookupFactory } from "./routing";

// Given a Route, URL Params, and QSParams, returns a route's path with the QS params included
function buildPathWithQS({
  route,
  urlParams,
  qsParams,
}: {
  route: Route;
  urlParams?: Record<string, any>;
  qsParams?: Record<string, any>;
}) {
  const stringifiedQS =
    qsParams && !!Object.keys(qsParams).length ? stringify(qsParams) : "";

  return reduce(
    Helpers.getUrlParamsFromPath(route.path),
    (memo, urlParam) => {
      const value = get(urlParams || {}, urlParam.name);
      return memo.replace(`:${urlParam.name}`, value || `:${urlParam.name}`);
    },
    `${route.path}${stringifiedQS ? `?${stringifiedQS}` : ""}`
  );
}

const Helpers = {
  downloadOpenApiJson: ({ workspace }: { workspace?: Workspace }) => {
    if (!workspace) {
      return null;
    }

    const openApiResult = OpenApi.generate({
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

  setArrayCellValue(values: any[], cell: number, newValue: any): any[] {
    const newValues = [...values];
    newValues[cell] = newValue;
    return newValues;
  },

  reduceDefaultParamValues(params: undefined | Param[]) {
    return (params || []).reduce((memo: Record<string, any>, param: Param) => {
      if (param?.defaultValue) {
        memo[param?.name] = param.json
          ? JSON.parse(param.defaultValue)
          : param.defaultValue;
      }
      return memo;
    }, {} as Record<string, any>);
  },

  /** If `activeRoute` is specified, filter displayed History to records matching just that route */
  filterHistory(
    historicResponses: HistoricResponse[],
    workspaces: Workspace[],
    route?: Route | null,
    includeIncomplete = false
  ) {
    if (route) {
      return historicResponses.filter(
        (historicResponse: HistoricResponse) =>
          historicResponse?.route?.path === route.path &&
          historicResponse?.route?.method === route.method &&
          (!historicResponse?.route?.workspaceId ||
            historicResponse.route.workspaceId === route.workspaceId) &&
          (includeIncomplete ||
            historicResponse.response ||
            historicResponse.error)
      );
    } else {
      const lookupRoute = routeLookupFactory(workspaces);

      return historicResponses.filter(
        (historicResponse) =>
          historicResponse?.route?.workspaceId !== undefined &&
          (includeIncomplete ||
            historicResponse.response ||
            historicResponse.error) &&
          lookupRoute(
            historicResponse.route.workspaceId,
            historicResponse.route.method,
            historicResponse.route.path,
            historicResponse.route.name
          ) !== undefined
      );
    }
  },

  buildUrl({
    route,
    urlParams,
    qsParams,
  }: {
    route: Route;
    urlParams: Record<string, any>;
    qsParams?: Record<string, any>;
  }) {
    return `${route.baseUrl}${buildPathWithQS({
      route,
      urlParams,
      qsParams,
    })}`;
  },

  buildPathWithQS,

  getUrlParamsFromPath(
    path: string
  ): { label: string; name: string; required: true; nullable: false }[] {
    const splitPath = path.split("/");

    return compact(
      map(splitPath, (part) => {
        if (part.indexOf(":") === -1) {
          return null;
        }
        const name = part.slice(1);
        return {
          label: startCase(name),
          name,
          required: true,
          nullable: false,
        };
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

  getStyles(darkMode: boolean, category: string): React.CSSProperties {
    switch (category) {
      case "themeContainer":
        return darkMode
          ? {
              backgroundColor: "#1A1F27",
              color: "#FBFAF5",
            }
          : {};
      case "fixedHeader":
        return darkMode
          ? {
              backgroundColor: "#1A1F27",
              borderBottom: "1px solid rgb(56, 56, 56)",
            }
          : {
              backgroundColor: "#FBFAF5",
              borderBottom: "1px solid #eee",
            };

      case "routePanelHeader":
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
        "inline-block py-2 px-4 text-blue-600 hover:text-blue-800 font-semibold",
      disabled:
        "inline-block py-2 px-4 text-gray-400 font-semibold cursor-not-allowed",
    },
  },

  reactJsonViewTheme: (darkMode: boolean) =>
    darkMode ? "ocean" : "rjv-default",
};

export default Helpers;
