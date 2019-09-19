import React, { useContext, useState, useEffect } from "react";
import { get } from "lodash-es";
import useAxios from "@smartrent/use-axios";
import axios from "axios";

import Context from "./Context";
import Request from "./route/Request";
import Response from "./route/Response";
import Helpers from "./lib/helpers";

import { Route } from "./types";

export default function Route({ route }: { route: Route }) {
  const { routeConfig, setApiResponse, workspace } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
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
      data: routeConfigVars.body,
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

  return (
    <div
      style={{
        marginTop: "8px",
        marginBottom: "8px",
        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.2)",
        overflowX: "hidden",
        textOverflow: "wrap",
      }}
    >
      <div
        style={{
          color: "#333",
          padding: "8px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: get(Helpers.colors.routes, method),
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ fontSize: "12px" }}>
          <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>
            {route.name}
          </div>
          {Helpers.buildUrl({
            route,
            urlParams: routeConfigVars.urlParams,
            baseUrl: "",
            qsParams: routeConfigVars.qsParams,
          })}
        </div>
        <div style={{ fontSize: "10px" }}>{method.toUpperCase()}</div>
      </div>
      <div
        style={{
          display: collapsed ? "none" : "flex",
          padding: "16px",
          borderRight: "1px solid #eee",
          borderBottom: "1px solid #eee",
          borderLeft: "1px solid #eee",
        }}
      >
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
      </div>
    </div>
  );
}
