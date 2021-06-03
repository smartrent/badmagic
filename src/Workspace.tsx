import React, { useEffect, useMemo } from "react";

import { useGlobalContext } from "./context/Context";
import Route from "./Route";
import Helpers from "./lib/helpers";

import { Route as RouteProps } from "./types";

export default function Workspace() {
  const {
    workspace,
    getWorkspaceSearchKeywords,
    routeConfig,
    setRouteConfig,
  } = useGlobalContext();
  if (!workspace) {
    return <div>Select a workspace to get started.</div>;
  }

  const allRoutes = workspace && workspace.routes ? workspace.routes : [];

  // Initializes new routes at startup
  useEffect(() => {
    if (allRoutes?.length) {
      let newRouteConfig = { ...routeConfig };
      allRoutes.forEach((route) => {
        newRouteConfig = Helpers.initializeRoute(newRouteConfig, route);
      });
      setRouteConfig(newRouteConfig);
    }
  }, [allRoutes]);

  const keywords: string = getWorkspaceSearchKeywords();
  const filteredRoutes = useMemo(() => {
    return keywords
      ? allRoutes.filter(
          ({ name, path, sticky }: RouteProps) =>
            name.toLowerCase().includes(keywords.toLowerCase()) ||
            path.toLowerCase().includes(keywords.toLowerCase()) ||
            sticky
        )
      : allRoutes;
  }, [allRoutes, keywords]);

  return (
    <div className="p-4 mt-12">
      {filteredRoutes.map((r: RouteProps, idx) => (
        <Route key={`${r.method || "GET"}-${r.path}-${idx}`} route={r} />
      ))}
    </div>
  );
}
