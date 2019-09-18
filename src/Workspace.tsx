import React, { useContext, useState } from "react";
import { map, filter } from "lodash-es";

import Environment from "./Environment";
import Context from "./Context";
import Route from "./Route";

import { Route as RouteProps } from "./types";

export default function Workspace() {
  const { workspace, setEnvVar, environment } = useContext(Context);
  const [routeFilter, setRouteFilter] = useState(
    environment && environment.routeFilter ? environment.routeFilter : ""
  );

  if (!workspace) {
    return <div>Select a workspace to get started.</div>;
  }

  const allRoutes = workspace && workspace.routes ? workspace.routes : [];
  const filteredRoutes = filter(allRoutes, ({ name, path }: RouteProps) => {
    if (!routeFilter) {
      return true;
    }
    return (
      name.toLowerCase().includes(routeFilter.toLowerCase()) ||
      path.toLowerCase().includes(routeFilter.toLowerCase())
    );
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Environment />
        <div>
          <input
            type="text"
            placeholder="Search Routes"
            value={routeFilter}
            onChange={(e) => {
              setEnvVar({ key: "routeFilter", value: e.currentTarget.value });
              setRouteFilter(e.currentTarget.value);
            }}
          />
        </div>
      </div>

      {map(filteredRoutes, (r, idx) => {
        return (
          <Route key={`${r.method || "GET"}-${r.path}-${idx}`} route={r} />
        );
      })}
    </div>
  );
}
