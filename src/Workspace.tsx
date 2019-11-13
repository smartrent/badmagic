import React, { useContext } from "react";
import { map, filter } from "lodash-es";

import Context from "./Context";
import Route from "./Route";

import { Route as RouteProps } from "./types";

export default function Workspace() {
  const { workspace, routeFilter } = useContext(Context);
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
    <div className="p-4 mt-12">
      {map(filteredRoutes, (r, idx) => {
        return (
          <Route key={`${r.method || "GET"}-${r.path}-${idx}`} route={r} />
        );
      })}
    </div>
  );
}
