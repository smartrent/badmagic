import React, { useMemo } from "react";

import Config from "./Config";
import { useGlobalContext } from "../context/GlobalContext";

import { Clock } from "../common/icons/Clock";

import { Workspace } from "../types";

export function TopBar({
  workspaces,
  activeWorkspaceNames,
  setActiveWorkspaceNames,
  toggleHistory,
}: {
  workspaces: Workspace[];
  activeWorkspaceNames: string[];
  setActiveWorkspaceNames: (activeWorkspaceNames: string[]) => void;
  toggleHistory: () => void;
}) {
  const { darkMode } = useGlobalContext();

  const styles = useMemo(() => {
    return {
      iconColor: darkMode ? "#eee" : "#333",
      headerBackground: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
    };
  }, [darkMode]);

  // TopBar needs z-10 so that anything from AuthForm (if it exists) renders underneath
  return (
    <div
      className={`flex justify-between items-center p-2 w-full border-b fixed top-0 right-0 left-0 z-10 ${styles.headerBackground}`}
    >
      <div className="flex items-center">
        <a
          className="text-3xl leading-none mt-1"
          href="https://github.com/smartrent/badmagic"
          target="_blank"
        >
          🔮
        </a>
      </div>

      <div className="flex items-center">
        <button
          className="flex items-center cursor-pointer"
          onClick={toggleHistory}
        >
          <Clock color={styles.iconColor} size={24} />
        </button>
        <div className="flex items-center ml-2">
          <Config
            workspaces={workspaces}
            activeWorkspaceNames={activeWorkspaceNames}
            setActiveWorkspaceNames={setActiveWorkspaceNames}
          />
        </div>
      </div>
    </div>
  );
}
