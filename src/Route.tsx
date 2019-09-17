import React, { useContext, useState } from "react";
import { get } from "lodash-es";

import Context from "./Context";
import RequestResponse from "./route/RequestResponse";
import Helpers from "./lib/helpers";

import { Route } from "./types";

export default function Route({ route }: { route: Route }) {
  const { routeConfig } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  if (!route) {
    return null;
  }

  const routeConfigVars = get(routeConfig, route.name, {
    urlParams: {},
  });
  const method = route.method ? route.method.toLowerCase() : "get";

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
          display: collapsed ? "none" : "block",
          padding: "16px",
          borderRight: "1px solid #eee",
          borderBottom: "1px solid #eee",
          borderLeft: "1px solid #eee",
        }}
      >
        <RequestResponse route={route} />
      </div>
    </div>
  );
}
