import React, { useMemo, useState, useEffect, useCallback } from "react";
import { flatMap, get } from "lodash-es";

import Config from "./Config";
import { useGlobalContext } from "../context/GlobalContext";
import TextInput from "../common/TextInput";
import Route from "../Route";
import Helpers from "../lib/helpers";
import Storage from "../lib/storage";
import { Sidebar } from "./Sidebar";

import { Clock } from "../common/icons/Clock";

import { Route as RouteType, BadMagicProps } from "../types";

export function Layout({
  workspaces,
  AuthForm,
  applyAxiosInterceptors,
}: BadMagicProps) {
  const { darkMode } = useGlobalContext();
  const [activeRoute, setActiveRoute] = useState<
    null | (RouteType & { workspaceName: string; baseUrl: string })
  >(null);
  const [activeWorkspaceNames, setActiveWorkspaceNamesInState] = useState<
    string[]
  >([]);

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

  const styles = useMemo(() => {
    return {
      iconColor: darkMode ? "#eee" : "#333",
      headerBackground: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
      sidebarRouteText: darkMode ? "text-gray-400" : "text-gray-800",
      sidebarMethodBorder: darkMode ? "border-gray-700" : "border-gray-400",
      background: darkMode ? "bg-gray-800" : "bg-gray-200",
    };
  }, [darkMode]);

  return (
    <>
      <div
        className={`w-full flex justify-between p-2 w-full border-b fixed top-0 right-0 left-0 z-10 ${styles.headerBackground}`}
      >
        <div className="flex items-center">
          <a
            className="text-3xl leading-none mt-1"
            href="https://github.com/smartrent/badmagic"
          >
            🔮
          </a>
        </div>

        <div className="flex items-center">
          <div className="flex items-center cursor-pointer">
            <Clock color={styles.iconColor} size={24} />
          </div>
          <div className="flex items-center ml-2">
            <Config
              workspaces={workspaces}
              activeWorkspaceNames={activeWorkspaceNames}
              setActiveWorkspaceNames={setActiveWorkspaceNames}
            />
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-12 mt-12 min-h-screen divide-x ${styles.background}`}
      >
        <Sidebar
          setActiveRoute={setActiveRoute}
          workspaces={activeWorkspaces}
        />
        <div className="col-span-9 p-4">
          {activeRoute ? (
            <>
              {AuthForm ? (
                <AuthForm
                  workspaceConfig={
                    (
                      activeWorkspaces.find(
                        ({ name }) => name === activeRoute?.workspaceName
                      ) || {}
                    ).config
                  }
                />
              ) : null}
              <Route
                route={activeRoute}
                applyAxiosInterceptors={applyAxiosInterceptors}
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
