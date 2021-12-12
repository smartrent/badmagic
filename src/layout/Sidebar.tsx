import React, { useMemo, useState, useCallback } from "react";
import { flatMap, get } from "lodash-es";

import { useGlobalContext } from "../context/GlobalContext";
import TextInput from "../common/TextInput";
import Helpers from "../lib/helpers";

import { Route, Workspace } from "../types";

export function SideBar({
  setActiveRoute,
  workspaces,
}: {
  setActiveRoute: (
    route: Route & { workspaceName: string; baseUrl: string }
  ) => void;
  workspaces: Workspace[];
}) {
  const { darkMode } = useGlobalContext();
  const [keywords, setKeywords] = useState("");

  const filteredRoutes = useMemo(() => {
    return flatMap(workspaces, ({ routes, name, config }) => {
      return routes
        .filter(
          ({ name, path }) =>
            !keywords ||
            name.toLowerCase().includes(keywords.toLowerCase()) ||
            path.toLowerCase().includes(keywords.toLowerCase())
        )
        .map((route) => {
          return {
            ...route,
            baseUrl: config?.baseUrl || window.location.origin,
            workspaceName: name,
          };
        });
    });
  }, [keywords, workspaces]);

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
    <div className="text-sm p-4 overflow-x-hidden relative">
      <TextInput
        type="text"
        placeholder="Search"
        value={keywords}
        onChange={setKeywordsCallback}
        autoFocus={true}
      />

      <div className="overflow-y-scroll" style={{ height: "93vh" }}>
        {!filteredRoutes.length ? (
          <div className={`${styles.textColor} text-center mt-4`}>
            No routes found. Please select one or more Workspaces from the
            Config menu to load routes.
          </div>
        ) : null}
        {filteredRoutes.map((route, idx) => (
          <div
            key={`${route.method || "GET"}-${route.path}-${idx}`}
            className={`my-3 pb-2 cursor-pointer border-b border-gray-300 ${styles.sidebarRouteText}`}
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
    </div>
  );
}
