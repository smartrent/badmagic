import React, { useMemo, useState, useEffect, useCallback } from "react";
import { orderBy } from "lodash-es";

import { useGlobalContext } from "../context/GlobalContext";
import Route from "../Route";
import * as Storage from "../lib/storage";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import { History } from "../common/History";
import Helpers from "../lib/helpers";

import { useConfigContext } from "../context/ConfigContext";

export function Layout() {
  const { AuthForm, HistoryMetadata, applyAxiosInterceptors } =
    useConfigContext();

  const { darkMode, historicResponses, activeRoute, workspaces } =
    useGlobalContext();
  const [activeWorkspaceNames, setActiveWorkspaceNamesInState] = useState<
    string[]
  >([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [historyActive, setHistoryActive] = useState(false);

  // Badmagic needs design help, but this gets rid of the annoying screen wiggle since we already have
  // independent scrollbars for the sidenav, main area, and history section
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
  }, []);

  // Saves activeWorkspaces to local storage so on page refresh the user doesn't need to re-filter
  const setActiveWorkspaceNames = useCallback(
    (workspaceNames: string[]) => {
      setActiveWorkspaceNamesInState(workspaceNames);
      Storage.set(Storage.keys.activeWorkspaces, workspaceNames);
    },
    [setActiveWorkspaceNamesInState]
  );

  // On mount, fetch active workspaces from local storage
  useEffect(() => {
    const activeWorkspacesFromStorage = Storage.get(
      Storage.keys.activeWorkspaces
    );
    if (activeWorkspacesFromStorage) {
      setActiveWorkspaceNames(activeWorkspacesFromStorage);
    }
  }, [setActiveWorkspaceNames]);

  const activeWorkspaces = useMemo(
    () =>
      orderBy(
        workspaces.filter(({ name }) => activeWorkspaceNames.includes(name)),
        ["name"],
        ["asc"]
      ),
    [activeWorkspaceNames, workspaces]
  );

  const workspaceConfig = useMemo(() => {
    if (!activeRoute) {
      return null;
    }

    const activeWorkspace = workspaces.find(({ routes }) =>
      routes.find(
        (route) =>
          route.path === activeRoute.path && route.method === activeRoute.method
      )
    );

    return activeWorkspace ? activeWorkspace.config : null;
  }, [activeRoute, workspaces]);

  const styles = useMemo(() => {
    return {
      background: darkMode ? "bg-gray-800" : "bg-gray-200",
      textColor: darkMode ? "text-white" : "",
      totalColumns: `grid-cols-${
        (sidebarExpanded ? 1 : 0) +
        (activeRoute ? 3 : 0) +
        (historyActive ? 3 : 0)
      }`,
    };
  }, [darkMode, activeRoute, sidebarExpanded, historyActive]);

  const toggleSidebar = useCallback(
    () => setSidebarExpanded(!sidebarExpanded),
    [sidebarExpanded]
  );

  const toggleHistory = useCallback(
    () => setHistoryActive(!historyActive),
    [historyActive]
  );

  const filteredHistory = useMemo(
    () => Helpers.filterHistory(historicResponses, workspaces),
    [historicResponses, workspaces]
  );

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
        style={{ height: "96vh" }}
      >
        {sidebarExpanded ? (
          <div className="col-span-1">
            <SideBar workspaces={activeWorkspaces} />
          </div>
        ) : null}
        {activeRoute ? (
          <div className="p-4 col-span-3 overflow-y-scroll">
            <div
              onClick={toggleSidebar}
              className={`${styles.textColor} cursor-pointer mb-2 text-sm`}
            >
              {sidebarExpanded ? "Hide" : "Show"} Sidebar
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
            <History
              filteredHistory={filteredHistory}
              HistoryMetadata={HistoryMetadata}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
