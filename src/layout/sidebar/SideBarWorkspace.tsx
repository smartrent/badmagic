import React, { useMemo, useState, useCallback, useEffect } from "react";
import { get, without } from "lodash-es";

import { useGlobalContext } from "../../context/GlobalContext";

import { Route } from "../../types";

import Helpers from "../../lib/helpers";

export function SideBarWorkspace({
  name,
  routes,
}: {
  name: string;
  routes: Route[];
}) {
  const {
    darkMode,
    setActiveRoute,
    collapsedWorkspaces,
    setCollapsedWorkspaces,
    keywords,
  } = useGlobalContext();

  const styles = useMemo(() => {
    return {
      sidebarRouteText: darkMode ? "text-gray-400" : "text-gray-800",
      sidebarMethodBorder: darkMode ? "border-gray-700" : "border-gray-400",
      textColor: darkMode ? "text-white" : "",
      title: darkMode ? "text-gray-100" : "",
    };
  }, [darkMode]);

  const toggleCollapseWorkspace = useCallback(() => {
    if (collapsedWorkspaces.includes(name)) {
      setCollapsedWorkspaces(without(collapsedWorkspaces, name));
    } else {
      setCollapsedWorkspaces([...collapsedWorkspaces, name]);
    }
  }, [name, collapsedWorkspaces]);

  const collapsed = useMemo(() => {
    return collapsedWorkspaces.includes(name);
  }, [name, collapsedWorkspaces]);

  return (
    <div>
      <div
        className={`mt-4 text-lg font-bold cursor-pointer ${styles.title}`}
        onClick={toggleCollapseWorkspace}
      >
        {name} {keywords ? null : collapsed ? "+" : "-"}
      </div>
      {!collapsed && !routes.length ? (
        <div className={`${styles.textColor} my-3 italic`}>No routes found</div>
      ) : null}
      {!collapsed &&
        routes.map((route, idx) => (
          <div
            key={`${route.method || "GET"}-${route.path}-${idx}`}
            className={`mt-2 mb-3 pb-2 cursor-pointer border-b border-gray-300 ${styles.sidebarRouteText}`}
            onClick={() => setActiveRoute(route)}
          >
            <div className="flex">
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
              <div className="font-bold">{route.name}</div>
            </div>
            <div className="italic">{route.path}</div>
          </div>
        ))}
    </div>
  );
}
