import React, { useMemo, useState } from "react";
import { flatMap } from "lodash-es";

import Config from "./Config";
import { useGlobalContext } from "../context/Context";
import TextInput from "../common/TextInput";
import Route from "../Route";

import { Route as RouteType, Workspace } from "../types";

export function BadMagic({ workspaces }: { workspaces: Workspace[] }) {
  const workspaceNames = useMemo(() => workspaces.map(({ name }) => name), [
    workspaces,
  ]);
  const { darkMode } = useGlobalContext();
  const [keywords, setKeywords] = useState("");
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
          <TextInput
            type="text"
            placeholder="Search Routes"
            value={keywords}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setKeywords(e.currentTarget.value)
            }
          />
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
        className={`p-4 mt-12 ${
          darkMode ? "bg-gray-800 min-h-screen" : "bg-gray-100 min-h-screen"
        }`}
      >
        {filteredRoutes.map((r: RouteType & { baseUrl: string }, idx) => (
          <Route
            key={`${r.method || "GET"}-${r.path}-${idx}`}
            route={r}
            baseUrl={r.baseUrl}
          />
        ))}
      </div>
    </>
  );
}
