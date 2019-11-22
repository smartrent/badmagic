import React, { useContext, useState, useEffect } from "react";
import { get } from "lodash-es";
import useAxios from "@smartrent/use-axios";
import axios from "axios";

import Context from "./Context";
import Request from "./route/Request";
import Response from "./route/Response";
import Helpers from "./lib/helpers";

import Navigation from "./common/Navigation";

import { Route } from "./types";

export default function Route({ route }: { route: Route }) {
  const { routeConfig, setApiResponse, workspace, darkMode } = useContext(
    Context
  );
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState('request');

  const routeConfigVars = get(routeConfig, route.name, {
    headers: {},
    urlParams: {},
    body: {},
  });
  const method = route.method ? route.method.toLowerCase() : "get";
  const { response, loading, error, reFetch } = useAxios({
    axios: axios.create({
      baseURL: workspace.config.baseUrl,
      headers: routeConfigVars.headers,
    }),
    method: route.method || "GET",
    url: Helpers.buildUrl({
      route,
      urlParams: routeConfigVars.urlParams,
      baseUrl: workspace.config.baseUrl,
      qsParams: routeConfigVars.qsParams,
    }),
    options: {
      data: route.body ? routeConfigVars.body : null,
    },
  });

  useEffect(() => {
    if (response || error || loading) {
      setApiResponse({ route, response, loading, error });
    }
  }, [response, loading, error, route]);

  if (!route) {
    return null;
  }

  // Route plugins completely override workspace plugins
  // If Route plugins are not specified, this will default to workspace plugins
  const plugins =
    route.plugins && route.plugins.length ? route.plugins : workspace.plugins;

  // Tabs for the navigation component for each route
  const tabs = [
    {
      key: "request",
      label: "Try Request",
      enabled: true,
    }
  ]

  const renderBody = (activeTab: string) => {
    let content;

    switch (activeTab) {
      case "request":
        content = 
          <>
            <Request
              route={route}
              loading={loading}
              reFetch={reFetch}
              plugins={plugins}
            />
            <Response
              route={route}
              loading={loading}
              reFetch={reFetch}
              plugins={plugins}
            />
          </>
        break;
      default:
        content = <p className="italic p-2">Something went wrong...</p>;
    }

    return content;
  }

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 border border-gray-700 rounded overflow-x-hidden my-2"
          : "bg-white border border-gray-300 rounded overflow-x-hidden my-2"
      }
    >
      <div
        className="flex justify-start items-center overflow-hidden p-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div
          className={
            darkMode
              ? "w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border border-gray-700 rounded"
              : "w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border border-gray-300 rounded"
          }
          style={{
            backgroundColor: get(Helpers.colors.routes, method),
          }}
        >
          {method.toUpperCase()}
        </div>

        <div
          className={
            darkMode
              ? "flex flex-grow-2 text-gray-100 mr-auto"
              : "flex flex-grow-2 text-gray-800 mr-auto"
          }
        >
          {Helpers.buildUrl({
            route,
            urlParams: routeConfigVars.urlParams,
            baseUrl: "",
            qsParams: routeConfigVars.qsParams,
          })}
        </div>
        <div
          className={
            darkMode
              ? "flex text-right text-gray-100 ml-2 mr-1"
              : "flex text-right text-gray-800 ml-2 mr-1"
          }
        >
          {route.name}
        </div>
      </div>
      <div className={collapsed ? "none" : "w-full p-2"}>
        {!collapsed && (
          <Navigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
      <div className={collapsed ? "none" : "flex p-2"}>
        {!collapsed && renderBody(activeTab)}
      </div>
    </div>
  );
}
