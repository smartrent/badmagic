import React, { useMemo, useState } from "react";
import { flatMap, get } from "lodash-es";

import Config from "./Config";
import { useGlobalContext } from "../context/Context";
import TextInput from "../common/TextInput";
import Route from "../Route";
import Helpers from "../lib/helpers";

import { Route as RouteType, Workspace } from "../types";

export function BadMagic({ workspaces }: { workspaces: Workspace[] }) {
  const workspaceNames = useMemo(() => workspaces.map(({ name }) => name), [
    workspaces,
  ]);
  const { darkMode } = useGlobalContext();
  const [keywords, setKeywords] = useState("");
  const [activeRouteName, setActiveRouteName] = useState("");
  const [activeWorkspaceNames, setActiveWorkspaceNames] = useState<string[]>(
    workspaceNames // @todo pull from local storage
  );

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

  // @todo maybe debounce here for performance
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

  const activeRoute = useMemo(() => {
    return activeRouteName
      ? filteredRoutes.find(({ name }) => name === activeRouteName)
      : null;
  }, [activeRouteName, filteredRoutes]);

  return (
    <>
      <div
        className={`w-full flex justify-between p-2 w-full border-b fixed top-0 right-0 left-0 z-10 ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}
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
          {/* @todo here remove select dropdown. Under config, show workspaces that are selectable */}
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
        className={`grid grid-cols-12 mt-12 min-h-screen divide-x ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="text-sm col-span-3 p-2">
          <div className="mb-2 mr-2">
            <TextInput
              type="text"
              placeholder="Search Routes"
              value={keywords}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setKeywords(e.currentTarget.value)
              }
            />
          </div>
          <div className="overflow-scroll" style={{ height: "95vh" }}>
            {filteredRoutes.map((r: RouteType & { baseUrl: string }, idx) => (
              <div
                key={`${r.method || "GET"}-${r.path}-${idx}`}
                className="flex mb-2"
                onClick={() => setActiveRouteName(r.name)}
              >
                <div
                  className={`${darkMode ? "text-gray-400" : "text-gray-800"}`}
                >
                  <div className="flex">
                    <div
                      className={`w-16 flex flex-shrink items-center justify-center text-gray-700 font-semibold mr-1 p-0 border rounded ${
                        darkMode ? "border-gray-700" : "border-gray-300"
                      }`}
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
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-9 p-2">
          {activeRoute ? (
            <Route route={activeRoute} baseUrl={activeRoute?.baseUrl} />
          ) : null}
        </div>
      </div>
    </>
  );
}
