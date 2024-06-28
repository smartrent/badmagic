import React, { useMemo, useCallback } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import TextInput from "../common/TextInput";

import { SideBarWorkspace } from "./sidebar/SideBarWorkspace";

import { Workspace } from "../types";
import { orderBy } from "lodash-es";

export function SideBar({ workspaces }: { workspaces: Workspace[] }) {
  const {
    darkMode,
    hideDeprecatedRoutes,
    keywords,
    setKeywords,
    setCollapsedWorkspaces,
  } = useGlobalContext();

  // If the user searches for a specific route, this filters to those keywords
  // If the user has Deprecated routes hidden, this filters out deprecated routes
  const filteredWorkspaces = useMemo(() => {
    return workspaces.map(({ id, routes, name, config }) => {
      return {
        id,
        name,
        routes: orderBy(
          routes.filter(
            ({ name, path, deprecated }) =>
              (!keywords ||
                name.toLowerCase().includes(keywords.toLowerCase()) ||
                path.toLowerCase().includes(keywords.toLowerCase())) &&
              ((hideDeprecatedRoutes && deprecated !== true) ||
                !hideDeprecatedRoutes)
          ),
          ["path", "method"]
        ),
      };
    });
  }, [keywords, workspaces, hideDeprecatedRoutes]);

  const styles = useMemo(() => {
    return {
      sidebarRouteText: darkMode ? "text-gray-400" : "text-gray-800",
      sidebarMethodBorder: darkMode ? "border-gray-700" : "border-gray-400",
      textColor: darkMode ? "text-white" : "",
    };
  }, [darkMode]);

  // When there is only 1 active workspace don't show the Collapse / Expand UI.
  // In this scenario, we auto-expand the single active workspace (even if it was previously collapsed when there
  // were multiple active workspaces)
  const displayExpandCollapseUI = useMemo(
    () => filteredWorkspaces?.length > 1,
    [filteredWorkspaces]
  );

  const setKeywordsCallback = useCallback(
    (e: React.FormEvent<HTMLInputElement>) =>
      setKeywords(e.currentTarget.value),
    [setKeywords]
  );

  return (
    <div className="text-sm px-4 pb-4 pt-3 overflow-x-hidden relative">
      <div className={`${styles.textColor} text-xs mb-2 flex justify-end`}>
        {displayExpandCollapseUI ? (
          <>
            <div
              className="cursor-pointer pr-1"
              onClick={() =>
                setCollapsedWorkspaces(
                  filteredWorkspaces.map(({ name }) => name)
                )
              }
            >
              Collapse All
            </div>
            <div className="px-1"> / </div>
            <div
              className="cursor-pointer pl-1"
              onClick={() => setCollapsedWorkspaces([])}
            >
              Expand All
            </div>
          </>
        ) : (
          // keep height spacing so there isn't a height jump
          <div>&nbsp;</div>
        )}
      </div>
      <TextInput
        type="text"
        placeholder="Search"
        value={keywords}
        onChange={setKeywordsCallback}
        autoFocus={true}
      />

      <div
        className="overflow-y-scroll overflow-x-hidden"
        style={{ height: "86vh" }}
      >
        {!filteredWorkspaces.length ? (
          <div className={`${styles.textColor} text-center mt-4`}>
            No workspaces selected. Please select one or more Workspaces from
            the Config menu to load routes.
          </div>
        ) : null}
        {filteredWorkspaces.map(({ id, name, routes }) => (
          <SideBarWorkspace
            key={name}
            name={name}
            workspaceId={id}
            routes={routes}
            displayExpandCollapseUI={displayExpandCollapseUI}
          />
        ))}
      </div>
    </div>
  );
}
