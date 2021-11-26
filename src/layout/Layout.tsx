import React, { useMemo, useState, useEffect, useCallback } from "react";
import { flatMap, get } from "lodash-es";

import Config from "./Config";
import { useGlobalContext } from "../context/GlobalContext";
import TextInput from "../common/TextInput";
import Route from "../Route";
import Helpers from "../lib/helpers";
import Storage from "../lib/storage";

import { Clock } from "../common/icons/Clock";

import { Route as RouteType, BadMagicProps } from "../types";

export function Layout({
  workspaces,
  AuthForm,
  applyAxiosInterceptors,
}: BadMagicProps) {
  const workspaceNames = useMemo(() => workspaces.map(({ name }) => name), [
    workspaces,
  ]);
  const { darkMode } = useGlobalContext();

  console.log("badmagic hooks", darkMode);
  const [keywords, setKeywords] = useState("");
  const [activeRouteName, setActiveRouteName] = useState("");
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

  // On page load, fetch active workspaces stored in local storage and filter down to those
  useEffect(() => {
    const activeWorkspacesFromLocalStorage = Storage.get("activeWorkspaces");
    setActiveWorkspaceNames(activeWorkspacesFromLocalStorage || workspaceNames);
  }, []);

  const allRoutes = useMemo(() => {
    return flatMap(workspaces, ({ routes, config, name }) => {
      return routes.map((route) => {
        return {
          ...route,
          baseUrl: config?.baseUrl || window.location.origin,
          workspaceName: name,
        };
      });
    });
  }, [workspaces]);

  const filteredRoutes = useMemo(() => {
    return allRoutes.filter(
      ({
        name,
        path,
        sticky,
        workspaceName,
      }: RouteType & { workspaceName: string }) =>
        (!keywords ||
          name.toLowerCase().includes(keywords.toLowerCase()) ||
          path.toLowerCase().includes(keywords.toLowerCase()) ||
          sticky) &&
        activeWorkspaceNames.includes(workspaceName)
    );
  }, [allRoutes, keywords, activeWorkspaceNames]);

  const { activeRoute, activeWorkspace } = useMemo(() => {
    const activeRoute = activeRouteName
      ? filteredRoutes.find(({ name }) => name === activeRouteName)
      : null;

    const activeWorkspace = (workspaces || []).find(
      ({ name }) => activeRoute?.workspaceName === name
    );

    return { activeRoute, activeWorkspace };
  }, [activeRouteName, filteredRoutes]);

  const styles = useMemo(() => {
    return {
      iconColor: darkMode ? "#eee" : "#333",
      headerBackground: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
      sidebarRouteText: darkMode ? "text-gray-400" : "text-gray-800",
      sidebarMethodBorder: darkMode ? "border-gray-700" : "border-gray-400",
      sidebarBackground: darkMode ? "bg-gray-800" : "bg-gray-200",
    };
  }, [darkMode]);

  console.log("darkMode in BadMagic.tsx", darkMode);

  const setKeywordsCallback = useCallback(
    (e: React.FormEvent<HTMLInputElement>) =>
      setKeywords(e.currentTarget.value),
    [setKeywords]
  );

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
              routes={filteredRoutes}
              workspaceNames={workspaceNames}
              activeWorkspaceNames={activeWorkspaceNames}
              setActiveWorkspaceNames={setActiveWorkspaceNames}
            />
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-12 mt-12 min-h-screen divide-x ${styles.sidebarBackground}`}
      >
        <div className="text-sm col-span-3 p-2">
          <div className="mt-1 mb-2 mr-2">
            <TextInput
              type="text"
              placeholder="Search Routes"
              value={keywords}
              onChange={setKeywordsCallback}
            />
          </div>
          <div className="overflow-scroll" style={{ height: "95vh" }}>
            {/* @todo move to separate component */}
            {filteredRoutes.map((r: RouteType & { baseUrl: string }, idx) => (
              <div
                key={`${r.method || "GET"}-${r.path}-${idx}`}
                className={`mb-2 cursor-pointer ${styles.sidebarRouteText}`}
                onClick={() => setActiveRouteName(r.name)}
              >
                <div className="flex">
                  <div
                    className={`text-xs w-12 flex flex-shrink items-center justify-center text-gray-700 font-semibold mr-1 p-0 border rounded ${styles.sidebarMethodBorder}`}
                    style={{
                      backgroundColor: get(
                        Helpers.colors.routes,
                        r.method ? r.method.toLowerCase() : "get"
                      ),
                    }}
                  >
                    {(r.method || "GET").toUpperCase()}
                  </div>
                  <div className="font-bold">{r.name}</div>
                </div>
                <div className="italic">{r.path}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-9 p-4">
          {activeRoute && activeWorkspace ? (
            <>
              {AuthForm ? (
                <AuthForm workspaceConfig={activeWorkspace.config} />
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
