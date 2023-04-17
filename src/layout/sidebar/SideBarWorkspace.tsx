import React, { useMemo, useCallback } from "react";
import { without } from "lodash-es";

import { useGlobalContext } from "../../context/GlobalContext";

import { Route } from "../../types";
import { SidebarRoute } from "./SidebarRoute";

export function SideBarWorkspace({
  workspaceName,
  routes,
  displayExpandCollapseUI,
}: {
  workspaceName: string;
  routes: Route[];
  displayExpandCollapseUI: boolean;
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

    collapsedWorkspaces.includes(workspaceName)
      ? setCollapsedWorkspaces(without(collapsedWorkspaces, workspaceName))
      : setCollapsedWorkspaces([...collapsedWorkspaces, workspaceName]);
  }, [workspaceName, collapsedWorkspaces, displayExpandCollapseUI]);

  const collapsed = useMemo(() => {
    // If there is only one active workspace and it's __actually__ collapsed in localstorage, ignore that
    // otherwise we get an empty Sidenav
    return displayExpandCollapseUI
      ? collapsedWorkspaces.includes(workspaceName)
      : false;
  }, [workspaceName, collapsedWorkspaces, displayExpandCollapseUI]);

  return (
    <div>
      <div
        className={`mt-4 text-lg font-bold flex justify-between items-end ${
          displayExpandCollapseUI ? "cursor-pointer" : ""
        } ${styles.title}`}
        onClick={toggleCollapseWorkspace}
      >
        <div>
          {workspaceName}{" "}
          {displayExpandCollapseUI ? (collapsed ? "+" : "-") : null}{" "}
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
          <SidebarRoute
            key={`${route.method || "GET"}-${route.path}-${idx}`}
            styles={styles}
            route={route}
            workspaceName={workspaceName}
          />
        ))}
    </div>
  );
}
