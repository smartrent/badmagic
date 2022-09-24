import React, { useMemo, useState, useCallback } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import TextInput from "../common/TextInput";

import { SideBarWorkspace } from "./sidebar/SideBarWorkspace";

import { Workspace } from "../types";

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
    return workspaces.map(({ routes, name, config }) => {
      return {
        name,
        routes: routes
          .filter(
            ({ name, path, deprecated }) =>
              (!keywords ||
                name.toLowerCase().includes(keywords.toLowerCase()) ||
                path.toLowerCase().includes(keywords.toLowerCase())) &&
              ((hideDeprecatedRoutes && deprecated !== true) ||
                !hideDeprecatedRoutes)
          )
          .map((route) => {
            return {
              ...route,
              baseUrl: config?.baseUrl || window.location.origin,
              workspaceName: name,
            };
          }),
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

  const setKeywordsCallback = useCallback(
    (e: React.FormEvent<HTMLInputElement>) =>
      setKeywords(e.currentTarget.value),
    [setKeywords]
  );

  return (
    <div className="text-sm px-4 pb-4 pt-3 overflow-x-hidden relative">
      <div className={`${styles.textColor} text-xs mb-2 flex justify-end`}>
        {keywords ? (
          // keep height spacing so there isn't a height jump
          <div>&nbsp;</div>
        ) : (
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
        )}
      </div>
      <TextInput
        type="text"
        placeholder="Search"
        value={keywords}
        onChange={setKeywordsCallback}
        autoFocus={true}
      />

      <div className="overflow-y-scroll" style={{ height: "93vh" }}>
        {!filteredWorkspaces.length ? (
          <div className={`${styles.textColor} text-center mt-4`}>
            No workspaces selected. Please select one or more Workspaces from
            the Config menu to load routes.
          </div>
        ) : null}
        {filteredWorkspaces.map(({ name, routes }) => (
          <SideBarWorkspace name={name} routes={routes} />
        ))}
      </div>
    </div>
  );
}
