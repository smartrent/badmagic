import React, { useMemo, useCallback } from "react";
import { get, without } from "lodash-es";

import { useGlobalContext } from "../../context/GlobalContext";

import { Route } from "../../types";

import Helpers from "../../lib/helpers";
import { NavLink } from "react-router-dom";
import { routeHref } from "../../lib/routing";

export function SideBarWorkspace({
  name,
  routes,
  displayExpandCollapseUI,
  workspaceId,
}: {
  name: string;
  routes: Route[];
  displayExpandCollapseUI: boolean;
  workspaceId: string;
}) {
  const { darkMode, collapsedWorkspaces, setCollapsedWorkspaces, keywords } =
    useGlobalContext();

  const styles = useMemo(() => {
    return {
      sidebarRouteText: darkMode ? "text-gray-400" : "text-gray-800",
      sidebarMethodBorder: darkMode ? "border-gray-700" : "border-gray-400",
      textColor: darkMode ? "text-white" : "",
      title: darkMode ? "text-gray-100" : "",
    };
  }, [darkMode]);

  const toggleCollapseWorkspace = useCallback(() => {
    // Noop on click if we don't need to show the Collapse/Expand UI
    if (!displayExpandCollapseUI) {
      return;
    }

    if (collapsedWorkspaces.includes(name)) {
      setCollapsedWorkspaces(without(collapsedWorkspaces, name));
    } else {
      setCollapsedWorkspaces([...collapsedWorkspaces, name]);
    }
  }, [
    name,
    collapsedWorkspaces,
    displayExpandCollapseUI,
    setCollapsedWorkspaces,
  ]);

  const collapsed = useMemo(() => {
    // If there is only one active workspace and it's __actually__ collapsed in localstorage, ignore that
    // otherwise we get an empty Sidenav
    if (!displayExpandCollapseUI) {
      return false;
    }

    return collapsedWorkspaces.includes(name);
  }, [name, collapsedWorkspaces, displayExpandCollapseUI]);

  return (
    <div>
      <div
        className={`mt-4 text-lg font-bold flex justify-between items-end ${
          displayExpandCollapseUI ? "cursor-pointer" : ""
        } ${styles.title}`}
        onClick={toggleCollapseWorkspace}
      >
        <div>
          {name} {displayExpandCollapseUI ? (collapsed ? "+" : "-") : null}{" "}
        </div>
        {keywords ? (
          <div className={`text-sm italic ${styles.sidebarRouteText}`}>
            ({routes.length} match{routes.length === 1 ? "" : "es"})
          </div>
        ) : (
          ""
        )}
      </div>
      {!collapsed && !routes.length ? (
        <div className={`${styles.textColor} my-3 italic`}>No routes found</div>
      ) : null}
      {!collapsed &&
        routes.map((route, idx) => (
          <NavLink
            key={`${route.method || "GET"}-${route.path}-${idx}`}
            className={({ isActive }) =>
              `block p-2 cursor-pointer border-b border-gray-300 ${
                styles.sidebarRouteText
              }${
                isActive
                  ? ` ${darkMode ? "bg-purple-700" : "bg-purple-300"}`
                  : ""
              }`
            }
            end
            to={routeHref(workspaceId, route.method, route.path, route.name)}
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
              {route.deprecated ? (
                <>
                  <div className="flex-grow" />
                  <div className="flex flex-shrink-0 items-center justify-center text-xs text-white font-semibold p-1 mr-2 bg-red-700 rounded">
                    DEPRECATED
                  </div>
                </>
              ) : null}
            </div>
            <div className="italic">{route.path}</div>
          </NavLink>
        ))}
    </div>
  );
}
