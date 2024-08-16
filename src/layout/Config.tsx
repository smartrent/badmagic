import React, { useState, useCallback, useMemo } from "react";
import { findIndex } from "lodash-es";

import { useGlobalContext } from "../context/GlobalContext";
import Helpers from "../lib/helpers";
import Button from "../common/Button";

// Icons
import Cog from "../common/icons/Cog";
import DarkMode from "../common/icons/DarkMode";
import Download from "../common/icons/Download";
import Close from "../common/icons/Close";

import { Workspace } from "../types";

export default function Config({
  workspaces,
  activeWorkspaceNames,
  setActiveWorkspaceNames,
}: {
  workspaces: Workspace[];
  activeWorkspaceNames: string[];
  setActiveWorkspaceNames: (workspaceNames: string[]) => void;
}) {
  const {
    darkMode,
    setDarkMode,
    hideDeprecatedRoutes,
    setHideDeprecatedRoutes,
  } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);

  const iconColor = darkMode ? "#eee" : "#333";

  const workspaceNames = useMemo(() => {
    return workspaces.map(({ name }) => name);
  }, [workspaces]);

  const areAllWorkspacesSelected = useMemo(() => {
    return workspaceNames.length === activeWorkspaceNames.length;
  }, [workspaceNames, activeWorkspaceNames]);

  const toggleAllWorkspaces = useCallback(() => {
    if (areAllWorkspacesSelected) {
      setActiveWorkspaceNames([]);
    } else {
      setActiveWorkspaceNames(workspaceNames);
    }
  }, [areAllWorkspacesSelected, setActiveWorkspaceNames, workspaceNames]);

  const toggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed]
  );

  const toggleDarkMode = useCallback(
    () => setDarkMode(!darkMode),
    [darkMode, setDarkMode]
  );

  const styles = useMemo(() => {
    return {
      textColor: darkMode ? "text-gray-400" : "text-gray-800",
      background: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
    };
  }, [darkMode]);

  return (
    <>
      <button onClick={toggleCollapsed}>
        <Cog size={24} color={iconColor} />
      </button>
      {!collapsed && (
        <div
          className={`absolute flex flex-col border p-2 z-10 rounded ${styles.background}`}
          style={{ top: "0.25rem", right: "0.25rem" }}
        >
          <div className="flex self-end">
            <button className="text-gray-700 mt-1" onClick={toggleCollapsed}>
              <Close size={14} color={iconColor} />
            </button>
          </div>
          <div className={`px-2 ${styles.textColor}`}>
            <div className="flex justify-between items-center my-2">
              <div className="text-md">Workspaces:</div>
              <button
                className="text-xs text-gray-500"
                onClick={toggleAllWorkspaces}
              >
                {areAllWorkspacesSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            {workspaceNames.map((workspaceName) => {
              return (
                <div key={workspaceName}>
                  <label>
                    <input
                      name="activeWorkspaces"
                      value={workspaceName}
                      type="checkbox"
                      checked={
                        !!activeWorkspaceNames.find(
                          (name) => name === workspaceName
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActiveWorkspaceNames([
                            ...activeWorkspaceNames,
                            workspaceName,
                          ]);
                        } else {
                          const newActiveWorkspaceNames = [
                            ...activeWorkspaceNames,
                          ];
                          const valueIdx = findIndex(
                            activeWorkspaceNames,
                            (name) => name === workspaceName
                          );
                          newActiveWorkspaceNames.splice(valueIdx, 1);
                          setActiveWorkspaceNames(newActiveWorkspaceNames);
                        }
                      }}
                    />{" "}
                    {workspaceName}
                  </label>
                </div>
              );
            })}
            <div className="flex mt-3 pt-2 border-t border-gray-400 text-gray-400">
              <label>
                <input
                  name="hideDeprecatedRoutes"
                  value="true"
                  type="checkbox"
                  checked={hideDeprecatedRoutes}
                  onChange={() =>
                    setHideDeprecatedRoutes(!hideDeprecatedRoutes)
                  }
                />{" "}
                Hide Deprecated Routes
              </label>
            </div>
          </div>
          <div className="flex mt-3 py-3 border-t border-b border-gray-400">
            <button
              className={`w-full flex justify-center items-center ${styles.textColor}`}
              onClick={toggleDarkMode}
            >
              <div className="mr-1">
                <DarkMode size={16} color={iconColor} />
              </div>
              <div>Dark Mode</div>
            </button>
          </div>
          {activeWorkspaceNames.length === 1 ? (
            <div className="flex pt-2">
              <Button
                className="w-full flex justify-center items-center"
                onClick={() =>
                  Helpers.downloadOpenApiJson({
                    workspace: workspaces.find(({ name }) =>
                      activeWorkspaceNames.includes(name)
                    ),
                  })
                }
              >
                <div className="mr-1">
                  <Download size={16} color="#eee" />
                </div>
                <div>Download OpenAPI</div>
              </Button>
            </div>
          ) : null}

          {activeWorkspaceNames.length !== 1 ? (
            <div className={`${styles.textColor} text-xs mt-2`}>
              <div>Select a single workspace</div>
              <div>to download OpenAPI</div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
