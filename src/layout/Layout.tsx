import React, { useMemo, useState, useEffect, useCallback } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import Route from "../Route";
import Storage from "../lib/storage";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import { History } from "../common/History";

import { Route as RouteType, BadMagicProps, WorkspaceConfig } from "../types";

type RouteWithWorkspaceConfig = RouteType & {
  workspaceName: string;
  baseUrl: string;
};

export function Layout({
  workspaces,
  AuthForm,
  HistoryMetadata,
  applyAxiosInterceptors,
}: BadMagicProps) {
  const { darkMode } = useGlobalContext();
  const [
    activeRoute,
    setActiveRoute,
  ] = useState<null | RouteWithWorkspaceConfig>(null);
  const [activeWorkspaceNames, setActiveWorkspaceNamesInState] = useState<
    string[]
  >([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [historyActive, setHistoryActive] = useState(false);

  // Saves activeWorkspaces to local storage so on page refresh the user doesn't need to re-filter
  const setActiveWorkspaceNames = useCallback(
    (workspaceNames: string[]) => {
      setActiveWorkspaceNamesInState(workspaceNames);
      Storage.set("activeWorkspaces", workspaceNames);
    },
    [setActiveWorkspaceNamesInState]
  );

  // On mount, fetch active workspaces from local storage
  useEffect(() => {
    const activeWorkspacesFromStorage = Storage.get("activeWorkspaces");
    if (activeWorkspacesFromStorage) {
      setActiveWorkspaceNames(activeWorkspacesFromStorage);
    }
  }, []);

  const activeWorkspaces = useMemo(() => {
    return workspaces.filter(({ name }) => activeWorkspaceNames.includes(name));
  }, [activeWorkspaceNames]);

  const workspaceConfig = useMemo(() => {
    if (!activeRoute) {
      return null;
    }

    const activeWorkspace = activeWorkspaces.find(
      ({ name }) => name === activeRoute?.workspaceName
    );

    return activeWorkspace ? activeWorkspace.config : null;
  }, [activeRoute, activeWorkspaces]);

  const styles = useMemo(() => {
    return {
      background: darkMode ? "bg-gray-800" : "bg-gray-200",
      textColor: darkMode ? "text-white" : "",
      totalColumns: `grid-cols-${(sidebarExpanded ? 1 : 0) +
        (activeRoute ? 3 : 0) +
        (historyActive ? 3 : 0)}`,
    };
  }, [darkMode, activeRoute, sidebarExpanded, historyActive]);

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded(!sidebarExpanded);
  }, [sidebarExpanded]);

  const toggleHistory = useCallback(() => {
    setHistoryActive(!historyActive);
  }, [historyActive]);

  return (
    <div
      className={`overflow-y-hidden min-h-full flex flex-col ${styles.background}`}
    >
      <TopBar
        workspaces={workspaces}
        activeWorkspaceNames={activeWorkspaceNames}
        setActiveWorkspaceNames={setActiveWorkspaceNames}
        toggleHistory={toggleHistory}
      />
      <div
        className={`w-full flex-grow grid divide-x ${styles.totalColumns}`}
        style={{ height: "98vh" }}
      >
        {sidebarExpanded ? (
          <div className="col-span-1">
            <SideBar
              setActiveRoute={setActiveRoute}
              workspaces={activeWorkspaces}
            />
          </div>
        ) : null}
        {activeRoute ? (
          <div className="p-4 col-span-3 overflow-y-scroll">
            <div
              onClick={toggleSidebar}
              className={`${styles.textColor} cursor-pointer mb-2 text-sm`}
            >
              {sidebarExpanded ? "Hide Sidebar" : "Show Sidebar"}
            </div>

            {activeRoute && workspaceConfig ? (
              <Route
                route={activeRoute}
                AuthForm={AuthForm}
                workspaceConfig={workspaceConfig}
                applyAxiosInterceptors={applyAxiosInterceptors}
                HistoryMetadata={HistoryMetadata}
              />
            ) : null}
          </div>
        ) : null}
        {historyActive ? (
          <div className="p-4 col-span-3 overflow-y-scroll">
            <History HistoryMetadata={HistoryMetadata} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
