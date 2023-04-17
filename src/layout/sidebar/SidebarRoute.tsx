import React from "react";
import { get } from "lodash-es";
import { useRouteMatch, Link } from "react-router-dom";

import Helpers from "../../lib/helpers";

import { Route } from "../../types";

export function SidebarRoute({
  workspaceName,
  styles,
  route,
}: {
  workspaceName: string;
  styles: Record<string, any>;
  route: Route;
}) {
  const { path } = useRouteMatch();

  return (
    <Link
      className={`block mt-2 mb-2 pb-2 cursor-pointer border-b border-gray-300 ${styles.sidebarRouteText}`}
      to={Helpers.linkToRoute({ path, workspaceName, route })}
    >
      <div className="flex items-baseline">
        {/* The extra div prevents vertical expansion if the route text wraps */}
        <div>
          <div
            className={`text-xs w-12 flex flex-shrink items-center justify-center text-gray-700 font-semibold mr-1 p-0 border rounded ${styles.sidebarMethodBorder}`}
            style={{
              backgroundColor: get(
                Helpers.colors.routes,
                route.method ? route.method.toLowerCase() : "get"
              ),
            }}
          >
            {(route.method || "GET").toUpperCase()}
          </div>
        </div>
        <div className="font-bold">{route.name}</div>
      </div>
      <div className="italic">{route.path}</div>
    </Link>
  );
}
