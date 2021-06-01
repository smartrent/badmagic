import React, { useState, useEffect, useCallback, useMemo } from "react";
import { get, compact } from "lodash-es";
import useAxios from "@smartrent/use-axios";
import axios from "axios";
import * as yup from "yup";

import { useGlobalContext } from "./context/Context";
import Request from "./route/Request";
import Response from "./route/Response";
import Navigation from "./route/Navigation";
import Docs from "./route/Documentation";

import Helpers from "./lib/helpers";
import { Route, RouteConfigVars } from "./types";

export default function Route({ route }: { route: Route }) {
  const {
    routeConfig,
    setRouteConfigVars,
    setApiResponse,
    workspace,
    darkMode,
  } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("request");
  const routeConfigVars: RouteConfigVars = routeConfig[route.name];

  const userSpecifiedUrlParams: Record<string, any> =
    routeConfigVars?.urlParams || {};

  const method = route.method ? route.method.toLowerCase() : "get";
  const { response, loading, error, reFetch } = useAxios({
    axios: axios.create({
      baseURL: workspace.config.baseUrl,
      headers: routeConfigVars?.headers || {},
    }),
    method: route.method || "GET",
    url: Helpers.buildUrl({
      route,
      urlParams: userSpecifiedUrlParams,
      baseUrl: workspace.config.baseUrl,
      qsParams: routeConfigVars?.qsParams || {},
    }),
    options: {
      data: route.body ? routeConfigVars?.body : null,
    },
  });

  // Before submitting a network request, validate that the request is valid
  // Note: Currently only supports URL Param validation
  const reFetchWithValidation = useCallback(() => {
    if (!routeConfigVars) {
      return reFetch();
    }
    // @todo: Use Yup to validate all nested, required fields, currently this only supports urlParams
    const requiredUrlParams = Helpers.getUrlParamsFromPath(route.path).reduce(
      (accumulator, { name }) => {
        accumulator[name] = yup
          .string()
          .required()
          .min(1);

        return accumulator;
      },
      {} as Record<string, any>
    );

    const yupSchema = yup.object({
      urlParams: yup.object().shape(requiredUrlParams),
    });
    try {
      yupSchema.validateSync(routeConfigVars);
      setRouteConfigVars({ ...routeConfigVars, validationErrors: [] }, route);
      return reFetch();
    } catch (err) {
      // Yup returns errors like `urlParams.someField is required`, so we trim off the prefix
      setRouteConfigVars(
        {
          ...routeConfigVars,
          validationErrors: err.errors.map((message: string) =>
            message.slice(message.indexOf(".") + 1)
          ),
        },
        route
      );
    }
    return {};
  }, [routeConfigVars, userSpecifiedUrlParams]);

  useEffect(() => {
    if (response || error || loading) {
      setApiResponse({ route, response, loading, error });
    }
  }, [response, loading, error, route]);

  // Route plugins completely override workspace plugins
  // If Route plugins are not specified, this will default to workspace plugins
  const plugins =
    route.plugins && route.plugins.length ? route.plugins : workspace.plugins;

  // Tabs for the navigation component for each route
  const tabs = compact([
    {
      key: "request",
      label: "Try Request",
    },
    route.documentation
      ? {
          key: "docs",
          label: "Documentation",
        }
      : null,
  ]);

  const isDeprecated = route.deprecated || false;

  // Renders the Request/Response tab or the Documentation tab
  const routeActiveTabDOM = useMemo(() => {
    let content;

    // Route is collapsed, don't render any content
    if (collapsed) {
      return null;
    }

    switch (activeTab) {
      case "request":
        content = (
          <>
            <Request
              route={route}
              loading={loading}
              reFetch={reFetchWithValidation}
              plugins={plugins}
            />
            <Response
              route={route}
              loading={loading}
              reFetch={reFetchWithValidation}
              plugins={plugins}
            />
          </>
        );
        break;
      case "docs":
        content = (
          <Docs documentation={route.documentation} darkMode={darkMode} />
        );
        break;
      default:
        content = <p className="italic p-2">Something went wrong...</p>;
    }

    return content;
  }, [activeTab, collapsed, loading]);

  // The system must initialize the routeConfigVars before continuing
  if (!routeConfigVars) {
    return null;
  }

  if (!route) {
    return null;
  }

  return (
    <div
      style={route.sticky ? { borderRight: "1px solid rgb(251, 189, 28)" } : {}}
      className={`border rounded overflow-x-hidden my-2 ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div
        className="flex justify-start items-center overflow-hidden p-2"
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        <div
          className={`w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border rounded ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
          style={{
            backgroundColor: get(Helpers.colors.routes, method),
          }}
        >
          {method.toUpperCase()}
        </div>

        {isDeprecated && (
          <div
            className={`flex flex-shrink-0 items-center justify-center text-xs text-white font-semibold p-1 mr-2 bg-red-700 rounded`}
          >
            DEPRECATED
          </div>
        )}

        <div
          className={`flex flex-grow-2 mr-auto ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {Helpers.buildUrl({
            route,
            urlParams: routeConfigVars.urlParams,
            baseUrl: "",
            qsParams: routeConfigVars.qsParams,
          })}
        </div>
        <div
          className={`flex text-right ml-2 mr-1 items-center ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {route.name}
          {route.sticky ? (
            <span className="text-xs ml-1" title="Sticky">
              ⭐
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
      {!collapsed && tabs && tabs.length > 1 && (
        <div className={collapsed ? "none" : "w-full p-2"}>
          <Navigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
      <div className={collapsed ? "none" : "flex p-2"}>{routeActiveTabDOM}</div>
    </div>
  );
}
